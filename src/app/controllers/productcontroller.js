const express = require("express");
const mysqConnection = require("../../database");
// const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

const { verifyToken } = require("../middleware/jwtmiddleware")
const { insertproduto,checkNumserieExists, updatePatrimony, deletePatrimony } = require("../models/productModel");

const router = express.Router();

// Rota para cadastrar um patrimônio
router.post('/register',verifyToken, async (req, res) => {
    try {
        const { name, valor, custo, quantidade, descricao, categoria} = req.body;
        
        insertproduto(name, valor, custo, quantidade, descricao, categoria, res);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro interno do servidor." });
    }
});

// Rota para obter patrimônios de um usuário específico
router.get('/list', async (req, res) => {
    try {
        const  user_id  = req.userId;

        // Consultar o banco de dados para obter os patrimônios do usuário
        const getproductsQuery = "SELECT p.prod_name, p.prod_valor, p.prod_quantidade, p.prod_descricao, c.cat_name, c.cat_descricao FROM tbl_produto p JOIN tbl_categoria c ON p.cat_id = c.cat_id";

        mysqConnection.query(getproductsQuery, [user_id], (err, results) => {
            if (err) {
                console.error(err);
                return res.status(400).json({ message: "Erro ao buscar os produtos no banco de dados." });
            }

            if (results.length > 0) {
                res.status(200).json({ produtos: results });
            } else {
                res.status(404).json({ message: "Nenhum patrimônio encontrado para o usuário especificado." });
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro interno do servidor." });
    }
});


// Rota para atualizar um patrimônio
router.put('/update/:patr_id', verifyToken, async (req, res) => {
    try {
        const patr_id = req.params.patr_id;
        const user_id  = req.userId;
        
        const {
            valor,
            tamanho,
            quantidade,
            dt_compra,
            passativ,
            garantia,
            numserie,
            notafiscal,
            local,
            imei,
            ativoinativo,
            descricao,
            responsavel,
            documentacao,
            depreciacao
        } = req.body;

        const updateValues = {
            patr_valor: valor,
            patr_tamanho: tamanho,
            patr_quantidade: quantidade,
            patr_dt_compra: dt_compra,
            patr_passativ: passativ,
            patr_garantia: garantia,
            patr_numserie: numserie,
            patr_notafiscal: notafiscal,
            patr_local: local,
            patr_imei: imei,
            patr_ativoinativo: ativoinativo,
            patr_descricao: descricao,
            patr_responsavel: responsavel,
            patr_documentacao: documentacao,
            patr_depreciacao: depreciacao
        };

        updatePatrimony(updateValues, patr_id, user_id)
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error: " + error.message });
    }
});

// Rota para deletar um patrimônio
router.delete('/delete/:patrid', verifyToken, async (req, res) => {
    try {
        const patr_id = req.params.patrid;
        const  user_id  = req.userId;

        // Deletar o patrimônio no banco de dados
        deletePatrimony(patr_id, user_id, res);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro interno do servidor." });
    }
});

// // Função para verificar o token
// Função para verificar o token
// function verifyToken(req, res, next) {
//     const bearerHeader = req.headers['authorization'];

//     if (typeof bearerHeader !== 'undefined') {
//         const bearer = bearerHeader.split(' ');
//         const bearerToken = bearer[1];
//         req.token = bearerToken;
//         next();
//     } else {
//         res.status(401).json({ message: 'Unauthorized: Token not provided' });
//     }
// }



module.exports = router;
