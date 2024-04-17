

const mysqConnection = require("../../database/index");



const userinfo = (userId, res) =>{
const getuserinfo = "SELECT * FROM tbl_user WHERE user_id = ?";
        mysqConnection.query(getuserinfo, [userId], (err, results) => {
            if (err) {
                console.error(err);
                return res.status(400).json({ status: "error",message: "Erro ao buscar informações no banco de dados." });
            }

            if (results.length > 0) {
                res.status(200).json({ status: "success",patrimonios: results });
            } else {
                res.status(404).json({status: "error", message: "Nenhum usuário especificado." });
            }
        });
    }

    const updateUser = (name, email, password, telefone, sexo, lastLoginIp, type, cpfcnpj, isAdmin, userId) => {
        const updateUserQuery = "UPDATE tbl_user SET user_name=?, user_email=?, user_telefone=?, user_sexo=?, user_type=?, user_cpfcnpj=? WHERE user_id=?";
        mysqConnection.query(updateUserQuery, [name, email, password, telefone, sexo, lastLoginIp, type, cpfcnpj, isAdmin, userId], (err, results) => {
            if (err) {
                console.error(err);
                return response.status(500).json({ message: "Erro interno do servidor durante a atualização do usuário." });
            }
    
            if (results.affectedRows > 0) {
                response.status(200).json({ message: "Informações do usuário atualizadas com sucesso!" });
            } else {
                response.status(400).json({ message: "Nenhuma informação foi atualizada. Verifique os dados fornecidos." });
            }
        });
    }
    


// Function to check if the provided password is correct
async function checkPassword(userId, password) {
    const getPasswordQuery = "SELECT user_password FROM tbl_user WHERE user_id=?";
    return new Promise((resolve, reject) => {
        mysqConnection.query(getPasswordQuery, [userId], (err, results) => {
            if (err) {
                reject(err);
            } else {
                if (results.length > 0) {
                    const hashedPassword = results[0].user_password;

                    bcrypt.compare(password, hashedPassword, (err, isMatch) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(isMatch);
                        }
                    });
                } else {
                    resolve(false);
                }
            }
        });
    });
}


async function checkIfUserExists(userId) {
    const checkUserQuery = "SELECT * FROM tbl_user WHERE user_id = ?";
    return new Promise((resolve, reject) => {
        mysqConnection.query(checkUserQuery, [userId], (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results.length > 0);
            }
        });
    });
}

module.exports={userinfo,updateUser,checkPassword,checkIfUserExists};