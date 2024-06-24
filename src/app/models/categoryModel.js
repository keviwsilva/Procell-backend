
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


const insertcategory = (name, descricao, res) => {
const insertcategoriaQuery = "INSERT INTO tbl_categoria(cat_name, cat_descricao) VALUES (?, ?)";
        mysqConnection.query(insertcategoriaQuery, [name, descricao], (err, results) => {
            if (err) {
                console.error(err);
                return res.status(400).json({ message: "Erro ao tentar realizar o cadastro no banco de dados. Revise as informações." });
            }

            if (results) {
                res.status(200).json({ message: "Cadastro realizado com sucesso." });
            }
});
}

const updateproduto = (updateValues, prod_id, user_id) => {
const updatequery = "UPDATE tbl_produto SET ? WHERE prod_id = ? and user_id = ?";
        mysqConnection.query(updatequery, [updateValues, prod_id, user_id], (err, results) => {
            if (err) {
                console.error('Error updating data:', err);
                return res.status(500).json({ message: "Error updating data: " + err.message });
            }
            if (results.affectedRows > 0) {
                res.status(200).json({ message: "prodimônio atualizado com sucesso." });
            } else {
                res.status(404).json({ message: "prodimônio não encontrado." });
            }
        });
    }


const deleteproduto = (prod_id, user_id, res) => {

    const deleteprodimonyQuery = "DELETE FROM tbl_produto WHERE prod_id = ? AND user_id = ?";
        mysqConnection.query(deleteprodimonyQuery, [prod_id, user_id], (err, results) => {
            if (err) {
                console.error(err);
                return res.status(400).json({ message: "Erro ao tentar realizar a exclusão no banco de dados." });
            }
            if (results.affectedRows > 0) {
                res.status(200).json({ message: "prodimônio excluído com sucesso." });
            } else {
                res.status(404).json({ message: "prodimônio não encontrado." });
            }
        });
    }
module.exports = { insertcategory,checkNumserieExists, updateproduto, deleteproduto };