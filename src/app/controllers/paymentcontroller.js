const express = require("express");
const router = express.Router();
const { MercadoPagoConfig, Payment, Preference } = require("mercadopago");
const { verifyToken } = require("../middleware/jwtmiddleware");
const crypto = require('crypto');
const client = new MercadoPagoConfig({
  accessToken:
    "TEST-4977082790428610-071016-26254974bcaccf8055eb3cfa372355ab-259503750",
  
}); 


const preferences = new Preference(client);

async function createPayment(items) {
  try {
      const itemList = items.map(item => ({
          id: item.id,
          title: item.title,
          quantity: item.quantity,
          unit_price: item.amount
      }));

      const paymentRequest = await preferences.create({
          body: {
              items: itemList,
              notification_url: `https://09f4-2804-14d-4283-41af-a4db-dc90-c5b3-cfe6.ngrok-free.app/payment/notificacao?source_news=webhooks`,
              back_urls: {
                  success: "https://09f4-2804-14d-4283-41af-a4db-dc90-c5b3-cfe6.ngrok-free.app/payment/success",
                  failure: "https://09f4-2804-14d-4283-41af-a4db-dc90-c5b3-cfe6.ngrok-free.app",
                  pending: "https://09f4-2804-14d-4283-41af-a4db-dc90-c5b3-cfe6.ngrok-free.app"
              },
              auto_return: "approved",
          }
      });

      console.log(paymentRequest.notification_url);
      return paymentRequest.sandbox_init_point;
  } catch (error) {
      console.log('error', error);
  }
}



router.post("/pagamento", verifyToken, async (req, res) => {
  try {
    const items = req.body.items;
    console.log(items)
    const paymentlink = await createPayment(items)
    console.log(paymentlink);
    res.status(200).json({ paymentlink: paymentlink});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao processar o pagamento." });
  }
});




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
    
    const accessToken =  "Bearer TEST-4977082790428610-071016-26254974bcaccf8055eb3cfa372355ab-259503750";
    console.log(accessToken)
    const axios = require('axios');
    const headers = {
        Authorization: accessToken,
      }
    
    const response = await axios.get(mercadoPagoUrl, {headers});

    // Handle successful API response (payment details)
    const paymentData = response.data;
    console.log(paymentData)

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
