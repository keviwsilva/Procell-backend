const express = require("express");
const mysqConnection = require("../../database");
const axios = require('axios');

const { verifyToken } = require("../middleware/jwtmiddleware")
const { insertPedido, insertCarrinho, getCartData, formatCartDataForPayment, deletarLinhasPorUserId } = require("../models/pedidoModel")

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

      await insertPedido( totalAmount, dataAtual, user_id,  res);

      await deletarLinhasPorUserId(user_id, res);

      
      console.log(paymentBody)
      const response = await axios.post('http://localhost:3001/payment/pagamento', paymentBody, {
        headers: {
          Authorization: token // Inclua o token no cabeçalho da solicitação
        }
      });

      res.status(200).json({ paymentLink: response.data })

  } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro interno do servidor." });
  }
});

router.get('/list', verifyToken, async (req, res) => {
  try {
      const user_id = req.userId;

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
            c.prod_valor, 
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

  


  module.exports = router;