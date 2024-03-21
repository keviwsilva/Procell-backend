const express = require("express");
const { isAdmin } = require("../models/adminModel");

const router = express.Router();

router.post('/register-admin', verifyToken, async (req, res) => {
    try {
        const user_id = req.userId;

        // Verifica se o usuário atual é um administrador
        const userIsAdmin = await isAdmin(user_id);

        if (!userIsAdmin) {
            return res.status(403).json({ message: "Você não tem permissão para realizar esta ação. Apenas administradores podem registrar novos administradores." });
        }

        // Extrai os dados do corpo da requisição
        const { name, email, password, telefone, sexo, endereço, type, cpfcnpj } = req.body;

        // Define o novo usuário como administrador
        const is_admin = true;

        // Insere o novo administrador no banco de dados
        await insertAdmin(name, email, password, telefone, sexo, endereço, type, cpfcnpj, is_admin);

        // Retorna uma resposta de sucesso
        res.status(200).json({ message: "Novo administrador registrado com sucesso." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro interno do servidor." });
    }
});


