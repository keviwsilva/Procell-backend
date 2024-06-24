const express = require("express");
const mysqConnection = require("../../database");
// const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

const { isAdmin } = require("../models/adminModel");
const { verifyToken } = require("../middleware/jwtmiddleware")
const { insertcategory,checkNumserieExists, deleteproduto , updateproduto } = require("../models/categoryModel");

const router = express.Router();

// Rota para cadastrar um patrimônio
router.post('/register',verifyToken, async (req, res) => {
    try {
        const { name, descricao } = req.body;
        const user_id = req.userId;
        const userIsAdmin = await isAdmin(user_id);

        if(!userIsAdmin){
            return res.status(403).json({message: "Você nao tem permissão para realizar esta ação"})
        }


        insertcategory(name,descricao, res);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro interno do servidor." });
    }
});

// Rota para obter patrimônios de um usuário específico
router.get('/list', verifyToken, async (req, res) => {
    try {

        // Consultar o banco de dados para obter os patrimônios do usuário
        const getPatrimoniosQuery = "SELECT * FROM tbl_categoria";
        mysqConnection.query(getPatrimoniosQuery, (err, results) => {
            if (err) {
                console.error(err);
                return res.status(400).json({ message: "Erro ao buscar os patrimônios no banco de dados." });
            }

            if (results.length > 0) {
                res.status(200).json({ patrimonios: results });
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
router.put('/update/:prod_id', verifyToken, async (req, res) => {
    try {
        const prod_id = req.params.prod_id;
        const user_id  = req.userId;
        

        const userIsAdmin = await isAdmin(user_id);

        if(!userIsAdmin){
            return res.status(403).json({message: "Você nao tem permissão para realizar esta ação"})
        }

        const {
        } = req.body;


        updateproduto(updateValues, patr_id, user_id)
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error: " + error.message });
    }
});

// Rota para deletar um patrimônio
router.delete('/delete/:prodid', verifyToken, async (req, res) => {
    try {
        const prod_id = req.params.prodid;
        const  user_id  = req.userId;

        
        const userIsAdmin = await isAdmin(user_id);

        if(!userIsAdmin){
            return res.status(403).json({message: "Você nao tem permissão para realizar esta ação"})
        }


        deleteproduto(prod_id, res);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro interno do servidor." });
    }
});



module.exports = router;
