const express = require("express");
const mysqConnection = require("../../database");
const axios = require('axios');

const { verifyToken } = require("../middleware/jwtmiddleware")
const { insertPedido, insertCarrinho, getCartData, formatCartDataForPayment, deletarLinhasPorUserId, insertLink } = require("../models/pedidoModel")

const router = express.Router();


router.post('/carrinho', verifyToken, async (req, res) => {
  try {
      const user_id = req.userId;
      const { produtos } = req.body;

      await insertCarrinho(user_id, produtos, res);

      // res.status(200).json({ message: "Itens adicionados ao carrinho." });
  
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro interno do servidor." });
  }
});

router.get('/carrinholist', verifyToken, async (req, res) => {
  try {
      const user_id = req.userId;
      const user_type = req.userType
      const cartData = await getCartData(user_id, user_type); 
      console.log(cartData)
      res.status(200).json(cartData)
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro interno do servidor." });
  }
});



// Rota para criar um pedido
router.post('/pedidos', verifyToken, async (req, res) => {
  try {
      const user_id= req.userId;
      const user_type = req.userType;
      const token = req.headers.authorization; // Obtenha o token de autenticação da solicitação original

      
      const cartData = await getCartData(user_id, user_type); // Replace with logic to retrieve processed cart
      
      if (!cartData || cartData.length === 0) {
        return res.status(400).json({ message: "O carrinho está vazio. Não é possível fazer o pedido." });
      }

      console.log(cartData)
      const { items, totalAmount } = formatCartDataForPayment(cartData);
      
      // Construa o objeto paymentBody usando os dados formatados
      const paymentBody = {
        items: items,
      };
      
      const dataAtual = new Date().toISOString().split('T')[0]; 

      const pedidoId = await insertPedido( totalAmount, dataAtual, user_id,  res);

      console.log(pedidoId)

      await deletarLinhasPorUserId(user_id, res);

      
      console.log(paymentBody)
      const response = await axios.post('http://localhost:3001/payment/pagamento', paymentBody, {
        headers: {
          Authorization: token // Inclua o token no cabeçalho da solicitação
        }
      });

      console.log(pedidoId, user_id, response.data.paymentlink)

      await insertLink(pedidoId, user_id, response.data.paymentlink)

      res.status(200).json('pedido feito com sucesso')

  } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro interno do servidor." });
  }
});


router.get('/list', verifyToken, async (req, res) => {
  try {
    const user_id = req.userId;
    const user_type = req.userType; // Obtém o tipo de usuário

    // Verifica se o tipo de usuário é CPF ou CNPJ
    if (user_type !== "CPF" && user_type !== "CNPJ") {
      return res.status(403).json({ message: "Acesso não autorizado para este tipo de usuário." });
    }

    // Define o nome do campo de valor com base no tipo de usuário
    const valorField = (user_type === "CPF") ? "c.prod_valorcpf" : "c.prod_valorcnpj";

    // Consultar o banco de dados para obter os pedidos do usuário
    const getPedidosQuery = `
      SELECT 
        p.ped_id, 
        GROUP_CONCAT(CONCAT(
          pp.prod_id, 
          ':', 
          pp.quantidade, 
          ':', 
          c.prod_name, 
          ':', 
          ${valorField}, 
          ':', 
          c.prod_descricao
        )) AS produtos 
      FROM tbl_pedido p 
      INNER JOIN tbl_pedido_produto pp ON p.ped_id = pp.ped_id 
      INNER JOIN tbl_produto c ON pp.prod_id = c.prod_id 
      WHERE p.user_id = ? 
      GROUP BY p.ped_id
    `;

    mysqConnection.query(getPedidosQuery, [user_id], (err, results) => {
      if (err) {
        console.error(err);
        return res.status(400).json({ message: "Erro ao buscar os pedidos no banco de dados." });
      }

      if (results.length > 0) {
        const pedidos = results.map(row => ({
          pedido_id: row.ped_id,
          produtos: row.produtos.split(',').map(p => {
            const [produto_id, quantidade, nome, valor, descricao] = p.split(':');
            return { produto_id: produto_id, quantidade: quantidade, nome: nome, valor: valor, descricao: descricao };
          })
        }));

        res.status(200).json({ pedidos });
      } else {
        res.status(404).json({ message: "Nenhum pedido encontrado para o usuário especificado." });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro interno do servidor." });
  }
});

router.get('/list/:pedido_id', verifyToken, async (req, res) => {
  try {
    const user_id = req.userId;
    const user_type = req.userType; // Obtém o tipo de usuário

    // Verifica se o tipo de usuário é CPF ou CNPJ
    if (user_type !== "CPF" && user_type !== "CNPJ") {
      return res.status(403).json({ message: "Acesso não autorizado para este tipo de usuário." });
    }

    const pedido_id = req.params.pedido_id; // Obtém o ID do pedido da URL

    // Consulta o banco de dados para obter os detalhes do pedido
    const getPedidoQuery = `
      SELECT 
        p.ped_id,
        p.ped_pago,
        p.link_pagamento,
        GROUP_CONCAT(CONCAT(
          pp.prod_id, 
          ':', 
          pp.quantidade, 
          ':', 
          c.prod_name, 
          ':', 
          ${user_type === "CPF" ? "c.prod_valorcpf" : "c.prod_valorcnpj"}, 
          ':', 
          c.prod_descricao
        )) AS produtos 
      FROM tbl_pedido p 
      INNER JOIN tbl_pedido_produto pp ON p.ped_id = pp.ped_id 
      INNER JOIN tbl_produto c ON pp.prod_id = c.prod_id 
      WHERE p.user_id = ? AND p.ped_id = ? 
      GROUP BY p.ped_id
    `;

    mysqConnection.query(getPedidoQuery, [user_id, pedido_id], (err, results) => {
      if (err) {
        console.error(err);
        return res.status(400).json({ message: "Erro ao buscar os detalhes do pedido no banco de dados." });
      }

      if (results.length > 0) {
        const pedido = results.map(row => ({
          pedido_id: row.ped_id,
          ped_pago: row.ped_pago,
          link_pagamento: row.link_pagamento,
          produtos: row.produtos.split(',').map(p => {
            const [produto_id, quantidade, nome, valor, descricao] = p.split(':');
            return { produto_id: produto_id, quantidade: quantidade, nome: nome, valor: valor, descricao: descricao };
          })
        }))[0]; // Obtem apenas o primeiro resultado, pois o ID do pedido é único

        res.status(200).json({ pedido });
      } else {
        res.status(404).json({ message: "Pedido não encontrado para o usuário especificado." });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro interno do servidor." });
  }
});

  


  module.exports = router;