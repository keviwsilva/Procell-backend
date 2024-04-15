const express = require("express");
const mysqConnection = require("../../database");
// const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const path = require('path');
const multer = require('multer');
const fs = require('fs'); // Optional, for error handling
const { verifyToken } = require("../middleware/jwtmiddleware")
const { insertproduto, checkNumserieExists, updateProdutoWithImages, deleteproduto } = require("../models/productModel");
const { isAdmin } = require("../models/adminModel");
const { compareSync } = require("bcrypt");

const router = express.Router();


// Rota para cadastrar um patrimônio
router.post('/register', verifyToken, async (req, res) => {
    try {
        const user_id = req.userId;

        const userIsAdmin = await isAdmin(user_id);

        if (!userIsAdmin) {
            return res.status(403).json({ message: "Você não tem permissão para realizar esta ação" });
        }

        const { name, valorcpf, valorcnpj, custo, quantidade, descricao, categoria, base64Images } = req.body;

        if (!base64Images || !Array.isArray(base64Images) || base64Images.length === 0) {
            return res.status(400).send('Nenhuma imagem enviada');
        }

        // Chamar a função de inserção de produto com as imagens em base64
        await insertproduto(name, valorcpf, valorcnpj, custo, quantidade, descricao, categoria, base64Images, res);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro interno do servidor." });
    }
});


router.get('/list', async (req, res) => {
    try {
        const bearerHeader = req.headers['authorization'];
        let user_type = '1';

        // Verificar se o cabeçalho de autorização está presente
        if (typeof bearerHeader !== 'undefined') {
            // Extrair o token do cabeçalho
            // Verificar o token
            jwt.verify(bearerHeader, '2^=+uqW)?E7wVD^&U45qRgDj8aS@ZgB!', (err, authData) => {
                if (err) {
                    console.error(err);
                    // Token inválido
                    // Definir userType como CPF ou qualquer outra lógica desejada quando o token for inválido
                    user_type = 'CPF';
                } else {
                    // Token válido
                    user_type = authData.usertype;
                }
            });
        } else {
            // Token não está presente
            // Definir userType como CPF ou qualquer outra lógica desejada quando o token não for fornecido
            user_type = 'CPF';
        }

        // Parâmetros de paginação
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        // Construa a consulta SQL com base no tipo de usuário e aplicar a paginação
        let getproductsQuery = `
            SELECT p.prod_name,
                ${user_type === 'CPF' ? 'p.prod_valorCPF' : 'p.prod_valorCNPJ'} AS valor,
                p.prod_quantidade,
                p.prod_descricao,
                c.cat_name,
                c.cat_descricao,
                i.imagem_base64
            FROM tbl_produto p
            JOIN tbl_categoria c ON p.cat_id = c.cat_id
            LEFT JOIN tbl_imagem_produto i ON p.prod_id = i.produto_id
            ORDER BY p.prod_id ASC
            LIMIT ?, ?
        `;

        // Consultar o banco de dados para obter os produtos do usuário com a paginação aplicada
        mysqConnection.query(getproductsQuery, [offset, limit], (err, products_results) => {
            if (err) {
                console.error(err);
                return res.status(400).json({ message: "Erro ao buscar os produtos no banco de dados." });
            }

            if (products_results.length > 0) {
                res.status(200).json({ produtos: products_results });
            } else {
                res.status(404).json({ message: "Nenhum produto encontrado para o usuário especificado." });
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro interno do servidor." });
    }
});

router.get('/product/:produto_id', async (req, res) => {
    try {
        const produto_id = req.params.produto_id;

        // Consultar informações do produto
        const getProductQuery = "SELECT * FROM tbl_produto WHERE prod_id = ?";
        mysqConnection.query(getProductQuery, [produto_id], async (err, productResults) => {
            if (err) {
                console.error(err);
                return res.status(400).json({ message: "Erro ao buscar informações do produto." });
            }

            if (productResults.length === 0) {
                return res.status(404).json({ message: "Produto não encontrado." });
            }

            const productInfo = productResults[0];

            // Consultar imagens do produto
            const getImagesQuery = "SELECT imagem_base64 FROM tbl_imagem_produto WHERE produto_id = ?";
            mysqConnection.query(getImagesQuery, [produto_id], (err, imageResults) => {
                if (err) {
                    console.error(err);
                    return res.status(400).json({ message: "Erro ao buscar imagens do produto." });
                }

                const images = imageResults.map(result => result.imagem_base64);

                // Retornar informações do produto e imagens
                res.status(200).json({ produto: productInfo, imagens: images });
            });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro interno do servidor." });
    }
});



// Rota para atualizar um patrimônio
router.put('/update/:produto_id', verifyToken, async (req, res) => {
    try {
        const produto_id = req.params.produto_id; // Obtém o ID do produto da URL
        const user_id = req.userId;

        const userIsAdmin = await isAdmin(user_id);

        if (!userIsAdmin) {
            // Se o usuário não for um administrador, retorna um erro
            return res.status(403).json({ message: "Você não tem permissão para realizar esta ação. Apenas administradores podem registrar produtos." });
        }

        const { name, valor, custo, quantidade, descricao, categoria, base64Images } = req.body;

        // Atualizar o produto com o nome e as imagens fornecidas
        updateProdutoWithImages(produto_id, name, base64Images, valor, custo, quantidade, descricao, categoria, res);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro interno do servidor: " + error.message });
    }
});


// Rota para deletar um patrimônio
router.delete('/delete/:prodid', verifyToken, async (req, res) => {
    try {
        const patr_id = req.params.prodid;
        const user_id = req.userId;

        const userIsAdmin = await isAdmin(user_id);

        if (!userIsAdmin) {
            // Se o usuário não for um administrador, retorne um erro
            return res.status(403).json({ message: "Você não tem permissão para realizar esta ação. Apenas administradores podem registrar produtos." });
        }

        // Deletar o patrimônio no banco de dados
        deleteproduto(patr_id, user_id, res);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro interno do servidor." });
    }
});


module.exports = router;
