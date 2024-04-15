
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
// Função para calcular a distância de Levenshtein entre duas strings
function levenshteinDistance(a, b) {
    if (a.length === 0) return b.length;
    if (b.length === 0) return a.length;

    const matrix = [];

    // Inicializar a matriz
    for (let i = 0; i <= b.length; i++) {
        matrix[i] = [i];
    }

    for (let j = 0; j <= a.length; j++) {
        matrix[0][j] = j;
    }

    // Calcular a distância de Levenshtein
    for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
            if (b.charAt(i - 1) === a.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1,
                    matrix[i][j - 1] + 1,
                    matrix[i - 1][j] + 1
                );
            }
        }
    }

    return matrix[b.length][a.length];
}

// Função para verificar a similaridade entre dois nomes de produtos
function isSimilar(name1, name2, threshold) {
    const distance = levenshteinDistance(name1, name2);
    return distance <= threshold;
}




const insertproduto = (name, valorcpf, valorcnpj, custo, quantidade, descricao, categoria, base64Images, res) => {
    // Verificar se já existe um produto com nome semelhante
    const checkProdutoQuery = "SELECT prod_name FROM tbl_produto";
    mysqConnection.query(checkProdutoQuery, (err, checkResults) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: "Erro interno do servidor." });
        }
        
        const threshold = 4;
        const similarProducts = checkResults.filter(result => isSimilar(result.prod_name, name, threshold));

        if (similarProducts.length > 0) {
            // Se existirem produtos com nomes semelhantes, retornar um erro
            return res.status(400).json({ message: "Já existe um produto com nome semelhante." });
        }

        // Se não existir um produto com nome semelhante, realizar a inserção
        const insertprodutoQuery = "INSERT INTO tbl_produto(prod_name, prod_valorCPF, prod_valorCNPJ, prod_custo, prod_quantidade, prod_descricao, cat_id) VALUES (?, ?, ?, ?, ?, ?, ?)";
        mysqConnection.query(insertprodutoQuery, [name, valorcpf, valorcnpj, custo, quantidade, descricao, categoria], (err, results) => {
            if (err) {
                console.error(err);
                return res.status(400).json({ message: "Erro ao tentar realizar o cadastro no banco de dados. Revise as informações." });
            }

            if (results && results.insertId) {
                const productId = results.insertId; // Obtendo o ID do produto inserido

                // Mapeando a matriz de imagens e criando um conjunto de consultas de inserção
                const insertImageQueries = base64Images.map(base64Image => {
                    return new Promise((resolve, reject) => {
                        const insertImageQuery = "INSERT INTO tbl_imagem_produto (produto_id, imagem_base64) VALUES (?, ?)";
                        mysqConnection.query(insertImageQuery, [productId, base64Image], (err, imageResults) => {
                            if (err) {
                                console.error(err);
                                reject(err);
                            } else {
                                resolve(imageResults);
                            }
                        });
                    });
                });

                // Executando todas as consultas de inserção de imagens em paralelo
                Promise.all(insertImageQueries)
                    .then(() => {
                        res.status(200).json({ message: "Cadastro realizado com sucesso." });
                    })
                    .catch(error => {
                        console.error(error);
                        return res.status(400).json({ message: "Erro ao tentar salvar as imagens no banco de dados." });
                    });
            } else {
                return res.status(400).json({ message: "Erro ao tentar realizar o cadastro no banco de dados." });
            }
        });
    });
};



const updateProdutoWithImages = (produto_id, name, valor, custo, quantidade, descricao, categoria, base64Images, res) => {
    // Verificar se há novos valores para atualizar o produto
    if (!name && !valor && !custo && !quantidade && !descricao && !categoria && (!base64Images || base64Images.length === 0)) {
        return res.status(400).json({ message: "Nenhum dado fornecido para atualizar o produto." });
    }

    // Atualizar os campos do produto, se fornecidos
    const updateProdutoQuery = `
        UPDATE tbl_produto 
        SET 
            ${name ? "prod_name = ?," : ""} 
            ${valor ? "prod_valorCPF = ?," : ""} 
            ${custo ? "prod_custo = ?," : ""} 
            ${quantidade ? "prod_quantidade = ?," : ""} 
            ${descricao ? "prod_descricao = ?," : ""} 
            ${categoria ? "cat_id = ?," : ""}
        WHERE prod_id = ?`;

    const updateValues = [name, valor, custo, quantidade, descricao, categoria, produto_id].filter(value => value !== undefined);

    mysqConnection.query(updateProdutoQuery, updateValues, (err, updateResult) => {
        if (err) {
            console.error(err);
            return res.status(400).json({ message: "Erro ao tentar atualizar o produto." });
        }

        // Se houver novas imagens, adicionar as imagens ao produto
        if (base64Images && base64Images.length > 0) {
            // Excluir as imagens antigas do produto
            const deleteImagesQuery = "DELETE FROM tbl_imagem_produto WHERE produto_id = ?";
            mysqConnection.query(deleteImagesQuery, [produto_id], (err, deleteResult) => {
                if (err) {
                    console.error(err);
                    return res.status(400).json({ message: "Erro ao tentar excluir as imagens antigas do produto." });
                }

                // Inserir as novas imagens do produto
                const insertImageQueries = base64Images.map(base64Image => {
                    return new Promise((resolve, reject) => {
                        const insertImageQuery = "INSERT INTO tbl_imagem_produto (produto_id, imagem_base64) VALUES (?, ?)";
                        mysqConnection.query(insertImageQuery, [produto_id, base64Image], (err, imageResults) => {
                            if (err) {
                                console.error(err);
                                reject(err);
                            } else {
                                resolve(imageResults);
                            }
                        });
                    });
                });

                // Executar todas as consultas de inserção de imagens em paralelo
                Promise.all(insertImageQueries)
                    .then(() => {
                        // Retornar uma resposta de sucesso
                        res.status(200).json({ message: "Produto atualizado com sucesso." });
                    })
                    .catch(error => {
                        console.error(error);
                        res.status(400).json({ message: "Erro ao tentar salvar as novas imagens do produto no banco de dados." });
                    });
            });
        } else {
            // Se não houver novas imagens, retornar uma resposta de sucesso apenas para a atualização dos campos do produto
            res.status(200).json({ message: "Produto atualizado com sucesso." });
        }
    });
};


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


module.exports = { insertproduto,checkNumserieExists, updateProdutoWithImages, deleteproduto };