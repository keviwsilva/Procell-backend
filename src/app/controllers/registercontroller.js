const express = require("express");
const bcrypt = require("bcrypt");
const mysqConnection = require("../../database");

const router = express.Router();

const { insertUser, checkIfEmailExists, detectarTipoDocumento, validarCNPJ,  validarCPF } = require("../models/registerModel")

//-----------------cadastro-----------------//
router.post('/user', async (req, res) => {
    try {
        const { name, telefone, email, enderecocep, endereconumber, sexo, password, documento } = req.body;

        // Check if the email already exists
        const emailExists = await checkIfEmailExists(email,documento);

        if (emailExists) {
            return res.status(400).json({ message: "Usúario já existente!" });
        }

        // Hash the password using bcrypt
        const tipoDocumento = detectarTipoDocumento(documento);
        
        if (tipoDocumento === 'CPF' && validarCPF(documento)) {
            // Hash the password using bcrypt
            const hashedPassword = await bcrypt.hash(password, 10);
            // console.log(123)
            // Insira o usuário no banco de dados
            insertUser(name, email, hashedPassword, telefone, sexo, enderecocep, endereconumber, tipoDocumento, documento, res);
        } else if (tipoDocumento === 'CNPJ' && validarCNPJ(documento)) {
            // Hash the password using bcrypt
            const hashedPassword = await bcrypt.hash(password, 10);

            // Insira o usuário no banco de dados
            insertUser(name, email, hashedPassword, telefone, sexo, enderecocep, endereconumber, tipoDocumento, documento, res);
        } else {
            return res.status(400).json({ message: "Documento inválido. Deve ser CPF ou CNPJ." });
        }
       
    } catch (error) {
        res.status(400).json({ message: "Erro interno do servidor." });
    }
});

module.exports = router;
