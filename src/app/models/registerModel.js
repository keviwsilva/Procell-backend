const mysqConnection = require("../../database/index");
const { cpf: cpfValidator, cnpj: cnpjValidator } = require('cpf-cnpj-validator');


const insertUser = (name, email, hashedPassword, telefone, sexo, endereco, tipoDocumento, documento, response) => {
    const insertUserQuery = "INSERT INTO tbl_user(user_name, user_email, user_password, user_telefone, user_sexo, user_end, user_type, user_cpfcnpj) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    console.log(1)
    mysqConnection.query(insertUserQuery, [name, email, hashedPassword, telefone, sexo, endereco, tipoDocumento, documento], (err, results) => {
        if (err) {
            console.error(err);
            return response.status(400).json({ message: "Erro ao tentar realizar cadastro no banco de dados. Revise as informações." });
        }

        if (results.affectedRows > 0) {
            console.log(3)
            response.status(200).json({ message: "Cadastro realizado com sucesso. Faça login para acessar a plataforma!" });
        } else {
            response.status(400).json({ message: "Erro ao tentar realizar cadastro no banco de dados. Revise as informações." });
        }
    });
}

function validarCPF(cpf) {
    return cpfValidator.isValid(cpf);
}

function validarCNPJ(cnpj) {
    return cnpjValidator.isValid(cnpj);
}

const detectarTipoDocumento = (documento) =>{
        // Remove caracteres não numéricos do documento
        const cleanedDocumento = documento.replace(/\D/g, '');
    
        // Verifica o tamanho do documento para determinar se é um CPF ou CNPJ
        if (cleanedDocumento.length === 11) {
            return 'CPF';
        } else if (cleanedDocumento.length === 14) {
            return 'CNPJ';
        } else {
            return null; // Retorna null se o tamanho não corresponder a nenhum dos formatos
        }
    }
    


// Function to check if the email already exists

async function checkIfEmailExists(email, documento) {
    return new Promise((resolve, reject) => {
        const emailCheckQuery = "SELECT COUNT(*) AS num_rows FROM tbl_user WHERE user_email = ? AND user_cpfcnpj = ?";
        mysqConnection.query(emailCheckQuery, [email, documento], (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results[0].num_rows > 0);
            }
        });
    });
}

module.exports = {  insertUser,checkIfEmailExists, detectarTipoDocumento, validarCPF, validarCNPJ };
