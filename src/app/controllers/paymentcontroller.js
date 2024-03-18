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
        notification_url:`https://6436-2804-14d-4283-41af-eda9-fe60-8016-d678.ngrok-free.app/payment/notificacao?source_news=webhooks`,
        back_urls: {
          success: "https://6436-2804-14d-4283-41af-eda9-fe60-8016-d678.ngrok-free.app/payment/success",
          failure: "https://6436-2804-14d-4283-41af-eda9-fe60-8016-d678.ngrok-free.app",
          pending: "https://6436-2804-14d-4283-41af-eda9-fe60-8016-d678.ngrok-free.app"
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
  res.status(200).json('salve')
})


router.post("/notificacao", async (req, res) => {
  const notification = req.body;
  console.log("Notification data:", notification); // Log the complete notification

  // Extract payment ID from request body
  const paymentId = notification.data.id;
  console.log("Extracted payment ID:", paymentId); // Log the extracted ID
  
  // Construct the Mercado Pago API URL
  const mercadoPagoUrl = `https://api.mercadopago.com/v1/payments/${paymentId}`;
  
  try {
    // Make a GET request to the Mercado Pago API using 'axios'
    
    const accessToken =  "Bearer TEST-1268092805959625-031108-afa196341c37eab32304a65a6cd9605c-259503750";
    console.log(accessToken)
    const axios = require('axios');
    const headers = {
        Authorization: accessToken,
      }
    
    const response = await axios.get(mercadoPagoUrl, {headers});

    // Handle successful API response (payment details)
    const paymentData = response.data;
    console.log(paymentData.id)

    // console.log("Payment details:", paymentData); // Log the retrieved payment data

    // ... (rest of your code to process payment details)

    res.status(200).json(paymentData);
  } catch (error) {
    console.error("Error fetching payment details:", error);
    console.error("API request URL:", mercadoPagoUrl); // Log the constructed URL
    res.status(500).json({ error: "Failed to retrieve payment details" });
  }
});





module.exports = router;
