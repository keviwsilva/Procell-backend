const mysqConnection = require("../../database/index");



const insertCarrinho = (usuarioId, produtos, res) => {
    produtos.forEach(produto => {
        const { id_produto, quantidade } = produto;

        // Verificar se o produto já existe no carrinho
        const checkIfExistsQuery = "SELECT * FROM tbl_carrinho WHERE user_id = ? AND prod_id = ?";
        mysqConnection.query(checkIfExistsQuery, [usuarioId, id_produto], (err, rows) => {
            if (err) {
                console.error(err);
                return res.status(400).json({ message: "Erro ao verificar o produto no carrinho." });
            }

            if (rows.length > 0) {
                // Se o produto já existe, atualize a quantidade
                const updateQuantityQuery = "UPDATE tbl_carrinho SET quantidade = quantidade + ? WHERE user_id = ? AND prod_id = ?";
                mysqConnection.query(updateQuantityQuery, [quantidade, usuarioId, id_produto], (err, result) => {
                    if (err) {
                        console.error(err);
                        return res.status(400).json({ message: "Erro ao atualizar a quantidade do produto no carrinho." });
                    }
                });
            } else {
                // Se o produto não existe, insira-o no carrinho
                const insertCarrinhoQuery = "INSERT INTO tbl_carrinho (user_id, prod_id, quantidade) VALUES (?, ?, ?)";
                mysqConnection.query(insertCarrinhoQuery, [usuarioId, id_produto, quantidade], (err, result) => {
                    if (err) {
                        console.error(err);
                        return res.status(400).json({ message: "Erro ao inserir o produto no carrinho." });
                    }
                });
            }
        });
    });

    res.status(201).json({ message: "Produtos adicionados ao carrinho com sucesso." });
}




function getCartData(userId, user_type) {
    return new Promise((resolve, reject) => {
        let cartDataQuery;
        
        // Verifique o tipo de usuário para determinar a consulta SQL apropriada
        if (user_type === 'CPF') {
            cartDataQuery = `
                SELECT 
                    cp.prod_id,
                    p.prod_name,
                    p.prod_valorCPF AS prod_valor,
                    p.prod_descricao,
                    cp.quantidade
                FROM 
                    tbl_carrinho cp
                INNER JOIN 
                    tbl_produto p ON cp.prod_id = p.prod_id
                WHERE 
                    cp.user_id = ?;
            `;
        } else if (user_type === 'CNPJ') {
            cartDataQuery = `
                SELECT 
                    cp.prod_id,
                    p.prod_name,
                    p.prod_valorCNPJ AS prod_valor,
                    p.prod_descricao,
                    cp.quantidade
                FROM 
                    tbl_carrinho cp
                INNER JOIN 
                    tbl_produto p ON cp.prod_id = p.prod_id
                WHERE 
                    cp.user_id = ?;
            `;
        } else {
            reject("Tipo de usuário inválido.");
            return;
        }

        // Execute a consulta SQL
        mysqConnection.query(cartDataQuery, [userId], (err, rows) => {
            if (err) {
                console.error("Erro ao obter os dados do carrinho:", err);
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
}


function formatCartDataForPayment(cartData) {
    let totalAmount = 0;
    const formattedCart = [];

    // Loop através dos dados do carrinho
    cartData.forEach(item => {
        const { prod_id, prod_name, prod_valor, quantidade } = item;

        // Calcular o preço total para este item (preço * quantidade)
        const itemTotal = prod_valor * quantidade;

        // Adicionar o preço total ao preço total geral
        totalAmount += itemTotal;

        // Adicionar o item formatado à lista de itens formatados
        formattedCart.push({
            id: prod_id,
            title: prod_name,
            quantity: quantidade,
            amount: prod_valor // Supondo que 'amount' seja o preço unitário do produto
        });
    });

    // Retorna um objeto com os dados formatados e o preço total
    return {
        items: formattedCart,
        totalAmount: totalAmount
    };
}


// function calcularValorTotalPedido(user_type, userId) {
//     return new Promise((resolve, reject) => {
//         let calcularValorTotalQuery;

//         if (user_type === 'CPF') {
//             calcularValorTotalQuery = `
//                 SELECT SUM(p.prod_valorCPF * c.quantidade) AS valor_total
//                 FROM tbl_produto p
//                 JOIN tbl_carrinho c ON p.prod_id = c.prod_id
//                 WHERE c.user_id = ?;
//             `;
//         } else if (user_type === 'CNPJ') {
//             calcularValorTotalQuery = `
//                 SELECT SUM(p.prod_valorCNPJ * c.quantidade) AS valor_total
//                 FROM tbl_produto p
//                 JOIN tbl_carrinho c ON p.prod_id = c.prod_id
//                 WHERE c.user_id = ?;
//             `;
//         } else {
//             reject("Tipo de usuário inválido.");
//             return;
//         }

//         mysqConnection.query(calcularValorTotalQuery, [userId], (err, result) => {
//             if (err) {
//                 console.error(err);
//                 reject("Erro ao calcular o valor total do pedido.");
//                 return;
//             }
//             resolve(result);
//         });
//     });
// }

function inserirPedido(valorTotal, data, userId) {
    return new Promise((resolve, reject) => {
        const insertPedidoQuery = "INSERT INTO tbl_pedido (ped_valor, ped_data, user_id, ped_pago) VALUES (?, ?, ?, ?)";
        mysqConnection.query(insertPedidoQuery, [valorTotal, data, userId, 'nao pago'], (err, result) => {
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
            console.log('linhas deletadas')
            resolve("Linhas deletadas com sucesso.");
        });
    });
}


// const insertPedido = (valorTotal, data, userId, user_type, res) => {
//     return new Promise((resolve, reject) => {
//         inserirPedido(valorTotal, data, userId, res).then((pedidoId) => {
//             transferirItensDoCarrinhoParaPedido(pedidoId, userId, res)
//                 .then((message) => {
//                     console.log(message);
//                     return message
//                 })
//                 .catch((error) => {
//                     console.error("Erro ao transferir itens do carrinho para o pedido:", error);
//                     res.json({ message: "Erro interno do servidor ao transferir itens do carrinho para o pedido." });
//                 });
//         })
//         .catch((error) => {
//             console.error("Erro ao inserir o pedido:", error);
//             res.status(500).json({ message: "Erro interno do servidor ao inserir o pedido." });
//         });
//     });
// };

async function insertPedido(valorTotal, data, userId) {
    const pedidoId = await inserirPedido(valorTotal, data, userId);
    await transferirItensDoCarrinhoParaPedido(pedidoId, userId);
    return pedidoId;
  }

async function insertLink(ped_id, user_id, paymentLink, paymentid, paymentdate, res){
    return new Promise((resolve, reject) => {

        const updateLinkQuery = 'UPDATE tbl_pedido SET link_pagamento = ?, ped_data = ? , pag_id = ?  WHERE ped_id = ? AND user_id = ?';
        mysqConnection.query(updateLinkQuery, [paymentLink, paymentdate, paymentid, ped_id, user_id], (err, result) => {
            if (err) {
                console.error(err);
                reject("Erro ao atualizar o link de pagamento no banco de dados.");
                return;
            }
            resolve(result);
        });
    });
}
  


module.exports = { insertPedido, insertCarrinho, getCartData, formatCartDataForPayment, deletarLinhasPorUserId, insertLink };