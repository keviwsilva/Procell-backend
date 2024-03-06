const mysqConnection = require("../../database/index");

const insertPedido = (valor_total, data, user_id, produtos, res) => {
const insertPedidoQuery = "INSERT INTO tbl_pedido (ped_valor, ped_data, user_id) VALUES (?, ?, ?)";
      mysqConnection.query(insertPedidoQuery, [valor_total, data, user_id], async (err, result) => {
          if (err) {
              console.error(err);
              return res.status(400).json({ message: "Erro ao inserir o pedido no banco de dados." });
          }

          const pedidoId = result.insertId;

          // Inserir produtos associados ao pedido na tabela tbl_pedido_produto
          const insertProdutosQuery = "INSERT INTO tbl_pedido_produto (ped_id, prod_id, quantidade) VALUES (?, ?, ?)";
          for (const produto of produtos) {
              mysqConnection.query(insertProdutosQuery, [pedidoId, produto.id_produto, produto.quantidade], async (err, result) => {
                  if (err) {
                      console.error(err);
                      return res.status(400).json({ message: "Erro ao inserir os produtos associados ao pedido no banco de dados." });
                  }

                  // Atualizar a quantidade do produto na tabela tbl_produto
                //   const updateProdutoQuery = "UPDATE tbl_produto SET prod_quantidade = prod_quantidade - " + produto.quantidade + " WHERE prod_id = " + produto.id_produto;
                const updateProdutoQuery = `UPDATE tbl_produto SET prod_quantidade = IF(prod_quantidade >= ${produto.quantidade}, prod_quantidade - ${produto.quantidade}, 0) WHERE prod_id = ${produto.id_produto}`;

                  await mysqConnection.query(updateProdutoQuery, [produto.quantidade, produto.id_produto], (err, result) => {
                      if (err) {
                          console.error(err);
                          return res.status(400).json({ message: "Erro ao atualizar a quantidade do produto no banco de dados." });
                      }
                  });
              });
          }

          res.status(201).json({ id_pedido: pedidoId });
      });
}

module.exports = { insertPedido };