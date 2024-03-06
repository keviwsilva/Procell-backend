const mysqConnection = require("../../database/index");

const insertUser = (name,  email,  hashedPassword, telefone, sexo, endereco) =>{
    const insertuserquery = "INSERT INTO tbl_user(user_name, user_email, user_password, user_telefone, user_sexo, user_end  ) VALUES (?, ?, ?, ?, ?, ?)";
    mysqConnection.query(insertuserquery, [name,  email,hashedPassword,telefone, sexo, endereco  ], (err, results) => {
        if (err) {
            console.error(err);
            return response.status(400).json({ message: "Erro ao tentar realizar cadastro no banco de dados. Revise as informações." });
        }

        if (results) {
            response.status(200).json({ message: "Cadastro realizado com sucesso. Faça login para acessar a plataforma!" });
        }
    });
}


// Function to check if the email already exists
async function checkIfEmailExists(email) {
    return new Promise((resolve, reject) => {
        const emailCheckQuery = "SELECT COUNT(*) AS num_rows FROM tbl_user WHERE user_email = ?";
        mysqConnection.query(emailCheckQuery, [email], (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results[0].num_rows > 0);
            }
        });
    });
}
module.exports = {  insertUser,checkIfEmailExists };
