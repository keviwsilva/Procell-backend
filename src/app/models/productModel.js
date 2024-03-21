
const mysqConnection = require("../../database/index");

async function checkNumserieExists(numserie) {
    return new Promise((resolve, reject) => {
        const numserieCheckQuery = "SELECT COUNT(*) AS num_rows FROM tbl_produto WHERE prod_numserie = ?";
        mysqConnection.query(numserieCheckQuery, [numserie], (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results[0].num_rows > 0);
            }
        });
    });
}


const insertproduto = (name,  valorcpf, valorcnpj,custo, quantidade, descricao, categoria, res) => {
const insertprodutoQuery = "INSERT INTO tbl_produto(prod_name, prod_valorCPF, prod_valorCNPJ, prod_custo, prod_quantidade, prod_descricao, cat_id) VALUES (?, ?, ?, ?, ?, ?, ?)";
        mysqConnection.query(insertprodutoQuery, [name,  valorcpf, valorcnpj, custo, quantidade, descricao, categoria], (err, results) => {
            if (err) {
                console.error(err);
                return res.status(400).json({ message: "Erro ao tentar realizar o cadastro no banco de dados. Revise as informações." });
            }

            if (results) {
                res.status(200).json({ message: "Cadastro realizado com sucesso." });
            }
});
}


async function updateProduto(produto_id, name, valorCPF, valorCNPJ, custo, quantidade, descricao, categoria, res) {
    return new Promise((resolve, reject) => {
        const updateProdutoQuery = 'UPDATE tbl_produto SET prod_name = ?, prod_valorCPF = ?, prod_valorCNPJ = ?, prod_custo = ?, prod_quantidade = ?, prod_descricao = ?, cat_id = ? WHERE prod_id = ?';
        mysqConnection.query(updateProdutoQuery, [name, valorCPF, valorCNPJ, custo, quantidade, descricao, categoria, produto_id], (err, result) => {
            if (err) {
                console.error(err);
                reject("Erro ao atualizar o produto no banco de dados.");
                return;
            }
            resolve(result);
        });
    });
}


const deleteproduto = (prod_id,  res) => {

    const deleteprodutoQuery = "DELETE FROM tbl_prodimonio WHERE prod_id = ?";
        mysqConnection.query(deleteprodutoQuery, [prod_id, user_id], (err, results) => {
            if (err) {
                console.error(err);
                return res.status(400).json({ message: "Erro ao tentar realizar a exclusão no banco de dados." });
            }
            if (results.affectedRows > 0) {
                res.status(200).json({ message: "produto excluído com sucesso." });
            } else {
                res.status(404).json({ message: "produto não encontrado." });
            }
        });
    }


module.exports = { insertproduto,checkNumserieExists, updateProduto, deleteproduto };