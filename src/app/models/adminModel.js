// Exemplo de função para verificar se um usuário é um administrador
const mysqConnection = require("../../database/index");


async function isAdmin(userId) {
    return new Promise((resolve, reject) => {
        const isAdminQuery = 'SELECT is_admin FROM tbl_user WHERE user_id = ?';
        mysqConnection.query(isAdminQuery, [userId], (err, results) => {
            if (err) {
                console.error(err);
                reject("Erro ao verificar as permissões do usuário no banco de dados.");
                return;
            }
            if (results.length > 0) {
                resolve(results[0].is_admin); // Retorna true se o usuário for um administrador, false caso contrário
            } else {
                reject("Usuário não encontrado.");
            }
        });
    });
}

// Função para inserir um novo usuário no banco de dados
async function insertAdmin(name, email, password, telefone, sexo, endereço, type, cpfcnpj, is_admin) {
    return new Promise((resolve, reject) => {
        const insertUserQuery = 'INSERT INTO tbl_user (user_name, user_email, user_password, user_telefone, user_sexo, user_end, user_type, user_cpfcnpj, is_admin) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
        mysqConnection.query(insertUserQuery, [name, email, password, telefone, sexo, endereço, type, cpfcnpj, is_admin], (err, result) => {
            if (err) {
                console.error(err);
                reject("Erro ao inserir o usuário no banco de dados.");
                return;
            }
            resolve(result);
        });
    });
}



module.exports = {isAdmin, insertAdmin}