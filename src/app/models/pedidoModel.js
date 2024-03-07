const mysqConnection = require("../../database/index");

const insertCarrinho = (usuarioId, produtos, res) => {
    const values = produtos.map(produto => [usuarioId, produto.id_produto, produto.quantidade]);
    const insertCarrinhoQuery = "INSERT INTO tbl_carrinho (user_id, prod_id, quantidade) VALUES ?";
    
    mysqConnection.query(insertCarrinhoQuery, [values], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(400).json({ message: "Erro ao inserir os produtos no carrinho de compras." });
        }
        
        res.status(201).json({ message: "Produtos adicionados ao carrinho com sucesso." });
    });
}


function calcularValorTotalPedido(user_type, userId) {
    return new Promise((resolve, reject) => {
        let calcularValorTotalQuery;

        if (user_type === 'CPF') {
            calcularValorTotalQuery = `
                SELECT SUM(p.prod_valorCPF * c.quantidade) AS valor_total
                FROM tbl_produto p
                JOIN tbl_carrinho c ON p.prod_id = c.prod_id
                WHERE c.user_id = ?;
            `;
        } else if (user_type === 'CNPJ') {
            calcularValorTotalQuery = `
                SELECT SUM(p.prod_valorCNPJ * c.quantidade) AS valor_total
                FROM tbl_produto p
                JOIN tbl_carrinho c ON p.prod_id = c.prod_id
                WHERE c.user_id = ?;
            `;
        } else {
            reject("Tipo de usuário inválido.");
            return;
        }

        mysqConnection.query(calcularValorTotalQuery, [userId], (err, result) => {
            if (err) {
                console.error(err);
                reject("Erro ao calcular o valor total do pedido.");
                return;
            }
            resolve(result);
        });
    });
}

function inserirPedido(valorTotal, data, userId) {
    return new Promise((resolve, reject) => {
        const insertPedidoQuery = "INSERT INTO tbl_pedido (ped_valor, ped_data, user_id) VALUES (?, ?, ?)";
        mysqConnection.query(insertPedidoQuery, [valorTotal, data, userId], (err, result) => {
            if (err) {
                console.error(err);
                reject("Erro ao inserir o pedido no banco de dados.");
                return;
            }
            resolve(result.insertId); // Retorna o ID do pedido inserido
        });
    });
}

function transferirItensDoCarrinhoParaPedido(pedidoId, userId) {
    return new Promise((resolve, reject) => {
        const transferirItensQuery = `
            INSERT INTO tbl_pedido_produto (ped_id, prod_id, quantidade)
            SELECT ?, prod_id, quantidade FROM tbl_carrinho WHERE user_id = ?
        `;
        mysqConnection.query(transferirItensQuery, [pedidoId, userId], (err, result) => {
            if (err) {
                console.error(err);
                reject("Erro ao transferir os itens do carrinho para o pedido.");
                return;
            }
            resolve("Itens transferidos com sucesso.");
        });
    });
}



function deletarLinhasPorUserId(userId) {
    return new Promise((resolve, reject) => {
        const deleteQuery = "DELETE FROM tbl_carrinho WHERE user_id = ?";
        mysqConnection.query(deleteQuery, [userId], (err, result) => {
            if (err) {
                console.error(err);
                reject("Erro ao deletar linhas do usuário.");
                return;
            }
            resolve("Linhas deletadas com sucesso.");
        });
    });
}


const insertPedido = (data, userId, user_type, res) => {
  return new Promise((resolve, reject) => {
    calcularValorTotalPedido(user_type, userId)
      .then((result) => {
        const valorTotal = result[0].valor_total;
        inserirPedido(valorTotal, data, userId).then((pedidoId) => {
          transferirItensDoCarrinhoParaPedido(pedidoId, userId)
            .then((message) => {
              console.log(message);
              deletarLinhasPorUserId(userId)
                .then((message) => {
                  console.log(message);
                  res
                    .status(201)
                    .json({ message: "Pedido realizado com sucesso" });
                })
                .catch((error) => {
                  console.error("Erro ao deletar linhas:", error);
                });
            })
            .catch((error) => {
              console.error(
                "Erro ao transferir itens do carrinho para o pedido:",
                error
              );
            });
        });
      })
      .catch((error) => {
        console.error("Erro ao inserir o pedido:", error);
      });
  }).catch((error) => {
    console.error("Erro:", error);
  });
};



module.exports = { insertPedido, insertCarrinho };