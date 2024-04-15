
const mysqConnection = require("../../database/index");

const getUserByEmail = (email, callback) => {
    const sql = "SELECT * FROM tbl_user WHERE user_email = ?";
    mysqConnection.query(sql, [email], (error, results) => {
        callback(error, results);
    });
};


const updateUserLastLoginIp = (clientIp, userId, callback) => {
    // Ensure clientIp is a string
    
        const sql = 'UPDATE tbl_user SET user_last_login_ip = ? WHERE user_id = ?';
        mysqConnection.query(sql, [clientIp, userId], (updateError, updateResults, updateFields) => {
            callback(updateError, updateResults, updateFields);
        });
};

module.exports = { getUserByEmail, updateUserLastLoginIp };
