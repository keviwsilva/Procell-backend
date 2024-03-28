const express = require("express");
const { isAdmin } = require("../models/adminModel");
const mysqConnection = require("../../database/index");


const { jwt, verifyToken } = require('../middleware/jwtmiddleware');
const router = express.Router();

router.post('/register-admin', verifyToken, async (req, res) => {
    try {
        const user_id = req.userId;

        // Verifica se o usuário atual é um administrador
        const userIsAdmin = await isAdmin(user_id);

        if (!userIsAdmin) {
            return res.status(403).json({ message: "Você não tem permissão para realizar esta ação. Apenas administradores podem registrar novos administradores." });
        }

        // Extrai os dados do corpo da requisição
        const { name, email, password, telefone, sexo, endereço, type, cpfcnpj } = req.body;

        // Define o novo usuário como administrador
        const is_admin = true;

        // Insere o novo administrador no banco de dados
        await insertAdmin(name, email, password, telefone, sexo, endereço, type, cpfcnpj, is_admin);

        // Retorna uma resposta de sucesso
        res.status(200).json({ message: "Novo administrador registrado com sucesso." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro interno do servidor." });
    }
});

router.get('/listpedidos', verifyToken, async (req, res) => {
    try {
      const user_id = req.userId;
      const userIsAdmin = await isAdmin(user_id); // Verifica se o usuário é um administrador
  
      if (!userIsAdmin) {
        return res.status(403).json({ message: "Acesso não autorizado. Esta rota é permitida apenas para administradores." });
      }
  
      // Consulta o banco de dados para obter todos os pedidos de todos os usuários
      const getAllPedidosQuery = `
        SELECT 
          p.ped_id, 
          p.user_id,
          u.user_name,
          u.user_email,
          p.ped_pago,
          GROUP_CONCAT(CONCAT(
            pp.prod_id, 
            ':', 
            pp.quantidade, 
            ':', 
            c.prod_name, 
            ':', 
            IFNULL(c.prod_valorcpf, c.prod_valorcnpj), 
            ':', 
            c.prod_descricao
          )) AS produtos 
        FROM tbl_pedido p 
        INNER JOIN tbl_user u ON p.user_id = u.user_id
        INNER JOIN tbl_pedido_produto pp ON p.ped_id = pp.ped_id 
        INNER JOIN tbl_produto c ON pp.prod_id = c.prod_id 
        GROUP BY p.ped_id, p.user_id
      `;
  
      mysqConnection.query(getAllPedidosQuery, (err, results) => {
        if (err) {
          console.error(err);
          return res.status(400).json({ message: "Erro ao buscar os pedidos no banco de dados." });
        }
  
        if (results.length > 0) {
          const pedidos = results.map(row => ({
            pedido_id: row.ped_id,
            user_id: row.user_id,
            user_name: row.user_name,
            user_email: row.user_email,
            pedido_pago: row.ped_pago,
            produtos: row.produtos.split(',').map(p => {
              const [produto_id, quantidade, nome, valor, descricao] = p.split(':');
              return { produto_id: produto_id, quantidade: quantidade, nome: nome, valor: valor, descricao: descricao };
            })
          }));
  
          res.status(200).json({ pedidos });
        } else {
          res.status(404).json({ message: "Nenhum pedido encontrado." });
        }
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro interno do servidor." });
    }
  });


  router.post('/list-by-date-range', verifyToken, async (req, res) => {
    try {
      const user_id = req.userId;
  
      // Verifica se o usuário é um administrador
      const userIsAdmin = await isAdmin(user_id);
  
      if (!userIsAdmin) {
        return res.status(403).json({ message: "Acesso não autorizado. Esta rota é permitida apenas para administradores." });
      }
  
      const { startDate, endDate } = req.body; // Obtém as datas de início e término do corpo da requisição
  
      // Consulta o banco de dados para obter os pedidos dentro do intervalo de datas especificado
      const getPedidosByDateRangeQuery = `
        SELECT 
          p.ped_id, 
          p.user_id,
          p.ped_pago,
          GROUP_CONCAT(CONCAT(
            pp.prod_id, 
            ':', 
            pp.quantidade, 
            ':', 
            c.prod_name, 
            ':', 
            IFNULL(c.prod_valorcpf, c.prod_valorcnpj), 
            ':', 
            c.prod_descricao
          )) AS produtos 
        FROM tbl_pedido p 
        INNER JOIN tbl_pedido_produto pp ON p.ped_id = pp.ped_id 
        INNER JOIN tbl_produto c ON pp.prod_id = c.prod_id 
        WHERE DATE(p.ped_data) BETWEEN ? AND ? -- Filtra os pedidos pelo intervalo de datas
        GROUP BY p.ped_id, p.user_id
      `;
  
      mysqConnection.query(getPedidosByDateRangeQuery, [startDate, endDate], (err, results) => {
        if (err) {
          console.error(err);
          return res.status(400).json({ message: "Erro ao buscar os pedidos no banco de dados." });
        }
  
        if (results.length > 0) {
          const pedidos = results.map(row => ({
            pedido_id: row.ped_id,
            user_id: row.user_id,
            ped_pago: row.ped_pago,
            produtos: row.produtos.split(',').map(p => {
              const [produto_id, quantidade, nome, valor, descricao] = p.split(':');
              return { produto_id: produto_id, quantidade: quantidade, nome: nome, valor: valor, descricao: descricao };
            })
          }));
  
          res.status(200).json({ pedidos });
        } else {
          res.status(404).json({ message: "Nenhum pedido encontrado para o intervalo de datas especificado." });
        }
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro interno do servidor." });
    }
  });
  
  

module.exports = router;
