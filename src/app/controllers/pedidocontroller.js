const express = require("express");
const mysqConnection = require("../../database");
// const bcrypt = require("bcrypt");
// const jwt = require('jsonwebtoken');

const { verifyToken } = require("../middleware/jwtmiddleware")
const { insertPedido } = require("../models/pedidoModel")

const router = express.Router();


router.post('/pedidos', verifyToken, async (req, res) => {
  try {
      const user_id = req.userId;
      const { data, valor_total, produtos } = req.body;

      insertPedido(valor_total,data, user_id, produtos,res);
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