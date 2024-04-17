const express = require("express");
const bcrypt = require("bcrypt");
const mysqConnection = require("../../database");
// const jwt = require('jsonwebtoken');


const { verifyToken } = require("../midleware/jwtmiddleware")
const { userinfo, updateUser,checkPassword,checkIfUserExists } = require("../models/userModel");

const router = express.Router();



// Update user information
// Get user information based on the token
router.get('/profile', verifyToken, async (req, res) => {
    try {
        const  userId  = req.userId;
        console.log(userId);
        // Consultar o banco de dados para obter os patrimônios do usuário
        userinfo(userId, res);
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "error",message: "Erro interno do servidor." });
    }
});


router.put('/update', verifyToken, async (request, response) => {
    try {
        const userId = request.userId;
        const { name, email, password, telefone, sexo,  type, cpfcnpj } = request.body;

        const userExists = await checkIfUserExists(userId);

        if (!userExists) {
            return response.status(404).json({ message: "Usuário não encontrado!" });
        }

        const isPasswordCorrect = await checkPassword(userId, password);

        if (!isPasswordCorrect) {
            return response.status(401).json({ message: "Senha incorreta. Acesso não autorizado!" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        updateUser(name, email, hashedPassword, telefone, sexo,  type, cpfcnpj, userId, response);

    } catch (error) {
        console.error(error);
        response.status(500).json({ message: "Erro interno do servidor." });
    }
});






module.exports = router;