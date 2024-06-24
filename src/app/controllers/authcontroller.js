const express = require("express");
const rateLimit = require("express-rate-limit");
const bcrypt = require("bcrypt");
const requestIp = require('request-ip');
const fs = require('fs');
const path = require('path');
const moment = require('moment-timezone');
const mysqConnection = require("../../database/index");


const { jwt, verifyToken } = require('../middleware/jwtmiddleware');
const { getUserByEmail, updateUserLastLoginIp } = require('../models/authModel');

const router = express.Router();

const jwtSecret = '2^=+uqW)?E7wVD^&U45qRgDj8aS@ZgB!'; // Replace with your actual secret key


const loginLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 15 minutes
    max: 10, // Max 5 requests per windowMs
    message: 'Too many login attempts. Please try again later.'
});

//-----------------autenticação-----------------//

router.post('/login', loginLimiter, async (req, res) => {
    try {
        const clientIp = requestIp.getClientIp(req);
        // Faz a requisição dos campos inseridos no HTML
        let email = req.body?.email || null;
        let password = req.body?.password || null;

        // Tem certeza que o usuário colocou informações nos campos de login
        if (email && password) {
            // Faz a busca no banco de dados para ver se o usuário possui um cadastro feito
            getUserByEmail(email, async function (error, results, fields) {
                // Se tiver algum problema com a query, mostrar o erro
                if (error) {
                    res.status(400).json({ message: "Erro ao tentar realizar autenticação no banco de dados" });
                } else {
                    // Se a conta existe
                    if (results.length > 0) {
                        const userId = results[0].user_id;
                        const userType = results[0].user_type;
                        const userLastLoginIp = results[0].user_last_login_ip;
                        console.log(userType);
                        
                        const hashedPassword = results[0].user_password;

                        // Compara a senha fornecida com a senha armazenada no banco de dados
                        const passwordMatch = await bcrypt.compare(password, hashedPassword);

                        if (passwordMatch) {
                            // Generate a JWT token
                            // console.log(clientIp);
                           

                            // const fileName = `user_${userId}_login_logs.txt`;
                            // const filePath = path.join(__dirname, '../../logs', fileName); // Adjust the folder as needed

                            // // Append log entry to the user-specific file
                            // const logEntry = `${moment().tz('America/Sao_Paulo').format('YYYY-MM-DDTHH:mm:ss.SSSZ')} - User ${userId} logged in from IP ${clientIp}\n`;
                            // fs.appendFile(filePath, logEntry, (appendError) => {
                            //     if (appendError) {
                            //         console.error(appendError);
                            //     }
                            // });


                            const token = jwt.sign({ email: email, userId: userId, usertype: userType }, jwtSecret, { expiresIn: '1h' }); // Adjust expiration as needed

                            res.status(200).json({ token });
                        } else {
                            res.status(400).json({ message: "Verifique as informações, e tente novamente!" });
                        }
                    } else {
                        res.status(400).json({ message: "Verifique as informações, e tente novamente!" });
                    }
                }
            });
        }
    } catch (error) {
        res.status(400).json({ message: "Erro interno do servidor." });
    }
});

router.get('/signed', verifyToken, async (req, res) => {
    try {
        // console.log(req.decode);
        // Ensure that req.decode is available
        if (!req.decode || !req.decode.email) {
            return res.status(401).json({ message: 'Invalid token. Email not found.' });
        }

        // Log the decoded email for debugging
        const email = req.decode.email;

        getUserByEmail(email, (error, results) => {
            if (error) {
                return res.status(500).json({ message: 'Internal server error.' });
            }

            if (results.length > 0) {
                const usuario = results[0];
                res.status(200).json({ usuario });
            } else {
                res.status(404).json({ message: 'User not found.' });
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});



module.exports = router;
