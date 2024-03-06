const express = require("express");
const bcrypt = require("bcrypt");
const mysqConnection = require("../../database");

const router = express.Router();

const { insertUser, checkIfEmailExists} = require("../models/registerModel")

//-----------------cadastro-----------------//
router.post('/user', async (req, res) => {
    try {
        const { name, telefone, email, endereco, sexo, password } = req.body;

        // Check if the email already exists
        const emailExists = await checkIfEmailExists(email);

        if (emailExists) {
            return res.status(400).json({ message: "Usúario já existente!" });
        }

        // Hash the password using bcrypt
        const hashedPassword = await bcrypt.hash(password, 10);

        insertUser(name,  email,hashedPassword,telefone, sexo, endereco, res)

       
    } catch (error) {
        res.status(400).json({ message: "Erro interno do servidor." });
    }
});

module.exports = router;
