const express = require("express");
const router = express.Router();
const { MercadoPagoConfig, Payment, Preference } = require("mercadopago");
const { verifyToken } = require("../middleware/jwtmiddleware");
const crypto = require('crypto');
const client = new MercadoPagoConfig({
  accessToken:
    "TEST-4977082790428610-071016-26254974bcaccf8055eb3cfa372355ab-259503750",
  
}); 
const mysqConnection = require("../../database/index");


const preferences = new Preference(client);

async function createPayment(items, pedido_id) {
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
              notification_url: `https://3b8c-2804-14d-4283-41af-8876-96c3-8966-147d.ngrok-free.app/payment/notificacao?source_news=webhooks`,
              back_urls: {
                  success: "https://3b8c-2804-14d-4283-41af-8876-96c3-8966-147d.ngrok-free.app/payment/success",
                  failure: "https://3b8c-2804-14d-4283-41af-8876-96c3-8966-147d.ngrok-free.app",
                  pending: "https://3b8c-2804-14d-4283-41af-8876-96c3-8966-147d.ngrok-free.app"
              },
              auto_return: "approved",
              external_reference: pedido_id 
          }
      });

      // console.log(paymentRequest.notification_url);
      return {
        sandbox_init_point: paymentRequest.sandbox_init_point,
        paymentId: paymentRequest.collector_id,
        paymentdate: paymentRequest.date_created
      };
  } catch (error) {
      console.log('error', error);
  }
}



router.post("/pagamento", verifyToken, async (req, res) => {
  try {
    const items = req.body.items;
    // console.log(items)
    const pedido_id = req.body.pedido_id;
    // console.log(pedido_id)
    const paymentlink = await createPayment(items, pedido_id)
    // console.log(paymentlink);
    res.status(200).json({ paymentlink: paymentlink.sandbox_init_point , id: paymentlink.paymentId, date_created: paymentlink.paymentdate});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao processar o pagamento." });
  }
});




router.post("/notificacao", async (req, res) => {
  const notification = req.body;
  // console.log("Notification data:", notification); // Log the complete notification
  const user_id = notification.user_id
  // Extract payment ID from request body
  const paymentId = notification.data.id;
  // console.log("Extracted payment ID:", paymentId); // Log the extracted ID
  
  // Construct the Mercado Pago API URL
  const mercadoPagoUrl = `https://api.mercadopago.com/v1/payments/${paymentId}`;
  
  try {
    // Make a GET request to the Mercado Pago API using 'axios'
    
    const accessToken =  "Bearer TEST-4977082790428610-071016-26254974bcaccf8055eb3cfa372355ab-259503750";
    // console.log(accessToken)
    const axios = require('axios');
    const headers = {
        Authorization: accessToken,
      }
    
    const response = await axios.get(mercadoPagoUrl, {headers});

    // Handle successful API response (payment details)
    const paymentData = response.data;
    // console.log(paymentData.status)
    
  // console.log('--------------------------')
  // console.log(paymentData.external_reference)
  // console.log('--------------------------')
    // console.log(paymentData)

    const paid = paymentData.status;
    const ped_id = paymentData.external_reference;

    const updatePedidosQuery = `UPDATE tbl_pedido SET ped_pago = ? WHERE ped_id = ?`;

    mysqConnection.query(updatePedidosQuery, [paid, ped_id], (err, results) => {
      if (err) {
        console.error(err);
        return res.status(400).json({ message: "Erro ao atualizar o pedido no banco de dados." });
      }
    
      if (results.affectedRows > 0) {
        res.status(200).json({ message: "Pedido atualizado com sucesso!" });
      } else {
        res.status(404).json({ message: "Nenhum pedido encontrado para o usuário especificado." });
      }
    });
    



    // ... (rest of your code to process payment details)

    // res.status(200).json({paymentData});
  } catch (error) {
    console.error("Error fetching payment details:", error);
    console.error("API request URL:", mercadoPagoUrl); // Log the constructed URL
    res.status(500).json({ error: "Failed to retrieve payment details" });
  }
});





module.exports = router;
