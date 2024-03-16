const express = require("express");
const router = express.Router();
const { MercadoPagoConfig, Payment, Preference } = require("mercadopago");
const { verifyToken } = require("../middleware/jwtmiddleware");
const crypto = require('crypto');

const client = new MercadoPagoConfig({
  accessToken:
    "TEST-1268092805959625-031108-afa196341c37eab32304a65a6cd9605c-259503750",
  
}); 

const preferences = new Preference(client);

async function createPayment(id, title, amount, quantity) {
    try{
       const paymentRequest = await preferences.create({
          body:{
        items:[
          {
            id,
            title,
            quantity,
            unit_price: amount
          }
        ],
        notification_url:`https://c9b4-2804-14d-4283-41af-7970-75d1-732b-6d21.ngrok-free.app/payment/notificacao/`,
        back_urls: {
          success: "https://c9b4-2804-14d-4283-41af-7970-75d1-732b-6d21.ngrok-free.app/success",
          failure: "https://c9b4-2804-14d-4283-41af-7970-75d1-732b-6d21.ngrok-free.app",
          pending: "https://c9b4-2804-14d-4283-41af-7970-75d1-732b-6d21.ngrok-free.app"
      },
      auto_return: "approved",
      }})
    console.log(paymentRequest.notification_url)
    return paymentRequest.sandbox_init_point
  }catch(error){
    console.log('error', error);
  }
}



router.post("/pagamento", verifyToken, async (req, res) => {
  try {
    console.log('dbasjl')
    const {id, title, amount, quantity } = req.body;
    console.log(id, title, amount, quantity)
    const paymentlink = await createPayment(id, title, amount, quantity)
    console.log(paymentlink);
    res.status(200).json({ message: "Pagamento criado com sucesso" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao processar o pagamento." });
  }
});

router.get('/success', (req, res) => {
  res.send('salve')
})

router.post("/notificacao", async (req, res) => {
  const notification = req.body;
  console.log(notification)

})



module.exports = router;
