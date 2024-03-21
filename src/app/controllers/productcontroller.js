const express = require("express");
const mysqConnection = require("../../database");
// const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

const { verifyToken } = require("../middleware/jwtmiddleware")
const { insertproduto,checkNumserieExists, updateProduto, deletePatrimony } = require("../models/productModel");
const { isAdmin } = require("../models/adminModel");
const { compareSync } = require("bcrypt");

const router = express.Router();

// Rota para cadastrar um patrimônio
router.post('/register',verifyToken, async (req, res) => {
    try {
        const user_id = req.userId;

        const userIsAdmin = await isAdmin(user_id);

        if(!userIsAdmin){
            return res.status(403).json({message: "Você nao tem permissão para realizar esta ação"})
        }

        const { name, valorcpf, valorcnpj, custo, quantidade, descricao, categoria} = req.body;
        
        insertproduto(name,  valorcpf, valorcnpj, custo, quantidade, descricao, categoria, res);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro interno do servidor." });
    }
});

router.get('/list', verifyToken, async (req, res) => {
    try {
        
        const user_type = req.userType;


        // Construa a consulta SQL com base no tipo de usuário
        let getproductsQuery = "";
        if (user_type === 'CPF' || user_type === '') {
            getproductsQuery = "SELECT p.prod_name, p.prod_valorCPF AS valor, p.prod_quantidade, p.prod_descricao, c.cat_name, c.cat_descricao FROM tbl_produto p JOIN tbl_categoria c ON p.cat_id = c.cat_id";
        } else if (user_type === 'pessoa_juridica') {
            getproductsQuery = "SELECT p.prod_name, p.prod_valorCNPJ AS valor, p.prod_quantidade, p.prod_descricao, c.cat_name, c.cat_descricao FROM tbl_produto p JOIN tbl_categoria c ON p.cat_id = c.cat_id";
        }

        // Consultar o banco de dados para obter os produtos do usuário
        mysqConnection.query(getproductsQuery, (err, products_results) => {
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



// Rota para atualizar um patrimônio
router.put('/update/:produto_id', verifyToken, async (req, res) => {
    try {
        const produto_id = req.params.produto_id; // Obtém o ID do produto da URL


        const userIsAdmin = await isAdmin(user_id);

        if (!userIsAdmin) {
            // Se o usuário não for um administrador, retorne um erro
            return res.status(403).json({ message: "Você não tem permissão para realizar esta ação. Apenas administradores podem registrar produtos." });
        }

        const { name, valor, custo, quantidade, descricao, categoria } = req.body;
        
        updateProduto(produto_id, name, valor, custo, quantidade, descricao, categoria, res);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error: " + error.message });
    }
});

// Rota para deletar um patrimônio
router.delete('/delete/:prodid', verifyToken, async (req, res) => {
    try {
        const patr_id = req.params.prodid;
        const  user_id  = req.userId;

        const userIsAdmin = await isAdmin(user_id);

        if (!userIsAdmin) {
            // Se o usuário não for um administrador, retorne um erro
            return res.status(403).json({ message: "Você não tem permissão para realizar esta ação. Apenas administradores podem registrar produtos." });
        }

        // Deletar o patrimônio no banco de dados
        deletePatrimony(patr_id, user_id, res);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro interno do servidor." });
    }
});


module.exports = router;
