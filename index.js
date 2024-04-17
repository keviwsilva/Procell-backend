const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const app = express();
const mercadoPago = require('mercadopago');

const cors = require('cors');


// Middleware
app.use(cors());
app.use(bodyParser.json({limit: '100mb'}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: "your-secret-key", resave: true, saveUninitialized: true }));

// Routes
const authRoutes = require("./src/app/controllers/authcontroller");
const registerRoutes = require("./src/app/controllers/registercontroller");
const produtoRoutes = require("./src/app/controllers/productcontroller");
const categoryRoutes = require("./src/app/controllers/categoryController");
const pedidoRoutes = require("./src/app/controllers/pedidocontroller");
const paymentRoutes = require("./src/app/controllers/paymentcontroller");
const adminRoutes = require("./src/app/controllers/adminController");
const endRoutes = require("./src/app/controllers/enderecoController")


app.use('/auth', authRoutes);
app.use('/register', registerRoutes);
app.use('/product', produtoRoutes);
app.use('/category', categoryRoutes);
app.use('/pedido', pedidoRoutes);
app.use('/payment', paymentRoutes);
app.use('/admin', adminRoutes);
app.use('/endereco', endRoutes);


// Your other routes...

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    // console.log(`Server is running on port ${PORT}`);
});



module.exports = app;