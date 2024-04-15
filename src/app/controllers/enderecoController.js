const express = require('express');
const router = express.Router();
const mysqConnection = require("../../database/index");
const { verifyToken } = require("../middleware/jwtmiddleware")

const axios = require('axios');

const { cepBrasil } = require('correios-brasil');


// Defina uma rota para adicionar um novo endereço
router.post('/novo', verifyToken, (req, res) => {
    const userId = req.userId;
    const { enderecocep, endereconumber} = req.body; // Supondo que você esteja enviando esses dados no corpo da requisição
    const verifyEnd = "SELECT * FROM tbl_endereco WHERE end_cep = ? AND end_numero = ? AND user_id = ?";
    mysqConnection.query(verifyEnd, [enderecocep, endereconumber, userId], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(400).json({ message: "Erro ao tentar adicionar endereço. Revise as informações." });
        }
        if (results.length === 0) {
            const insertEndQuery = "INSERT INTO tbl_endereco(end_cep, end_numero, user_id) VALUES (?, ?, ?)";
            mysqConnection.query(insertEndQuery, [enderecocep, endereconumber, userId], (err, results) => {
                if (err) {
                    console.error(err);
                    return res.status(400).json({ message: "Erro ao tentar adicionar endereço. Revise as informações." });
                }
                if (results.affectedRows > 0) {
                    return res.status(200).json({ message: "Endereço adicionado com sucesso!" });
                } else {
                    return res.status(400).json({ message: "Erro ao tentar adicionar endereço. Revise as informações." });
                }
            });
        } else {
            return res.status(400).json({ message: "Erro ao tentar adicionar endereço. endereco ja existente." });
        }
    });
   
});

// Rota para mostrar todos os endereços relacionados a um usuário e obter informações de CEP
router.get('/enderecos', verifyToken, async (req, res) => {
    try {
        const userId = req.userId;
        const getUserEndQuery = "SELECT * FROM tbl_endereco WHERE user_id = ?";
        mysqConnection.query(getUserEndQuery, [userId], async (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: "Erro interno do servidor." });
            }

            if (results.length === 0) {
                return res.status(404).json({ message: "Nenhum endereço encontrado para este usuário." });
            }

            const enderecos = results.map(endereco => ({
                cep: endereco.end_cep,
                numero: endereco.end_numero
            }));

            // Consultar informações de CEP para cada endereço usando a API ViaCEP
            const promises = enderecos.map(async endereco => {
                try {
                    const response = await axios.get(`https://viacep.com.br/ws/${endereco.cep}/json/`);
                    endereco.infoCep = response.data;
                } catch (error) {
                    endereco.infoCep = null;
                    console.error(`Erro ao consultar CEP ${endereco.cep}:`, error.message);
                }
            });

            await Promise.all(promises);
            
            return res.status(200).json({ enderecos });
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Erro interno do servidor." });
    }
});



module.exports = router;
