
const jwt = require('jsonwebtoken');


const jwtSecret = '2^=+uqW)?E7wVD^&U45qRgDj8aS@ZgB!'; // Replace with your actual secret key


const verifyToken = (req, res, next) => {
    const token = req.header('Authorization');
    // console.log(token);
    if (!token) {
        // console.log('Token not provided.');
        return res.status(401).json({ message: 'Token não fornecido.' });
    }

    jwt.verify(token, jwtSecret, (err, decoded) => {
        if (err) {
            // console.error('Token verification error:', err);
            // console.log('Provided token:', token);
            return res.status(401).json({ message: 'Token inválido.' });
        }
        req.decode = decoded; 
        req.userId = decoded.userId;
        req.userType = decoded.usertype;

        // console.log('Decoded token:', decoded);
        // console.log('Decoded token:', decoded.userId);
       
        next();
    });
};

module.exports= { jwt, verifyToken };