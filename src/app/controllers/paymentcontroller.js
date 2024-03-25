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
              notification_url: `https://8091-2804-14d-4283-41af-ddb-680c-a74c-b007.ngrok-free.app/payment/notificacao?source_news=webhooks`,
              back_urls: {
                  success: "https://8091-2804-14d-4283-41af-ddb-680c-a74c-b007.ngrok-free.app/payment/success",
                  failure: "https://8091-2804-14d-4283-41af-ddb-680c-a74c-b007.ngrok-free.app",
                  pending: "https://8091-2804-14d-4283-41af-ddb-680c-a74c-b007.ngrok-free.app"
              },
              auto_return: "approved",
          }
      });

      console.log(paymentRequest.notification_url);
      return {
        sandbox_init_point: paymentRequest.sandbox_init_point,
        paymentId: paymentRequest// Assuming the API response includes an ID property
      };
  } catch (error) {
      console.log('error', error);
  }
}



router.post("/pagamento", verifyToken, async (req, res) => {
  try {
    const items = req.body.items;
    console.log(items)
    const pedido_id = req.body.pedido_id;
    console.log(pedido_id)
    const paymentlink = await createPayment(items)
    console.log(paymentlink);
    res.status(200).json({ paymentlink: paymentlink.sandbox_init_point , id: paymentlink.paymentId});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao processar o pagamento." });
  }
});




router.post("/notificacao", async (req, res) => {
  const notification = req.body;
  console.log("Notification data:", notification); // Log the complete notification
  const user_id = notification.user_id
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
    console.log(paymentData.status)
    console.log(paymentData.id)

    const paid = paymentData.status;

    const getPedidosQuery = `UPDATE tbl_pedido SET ped_pago= ? WHERE pag_id= ?`;

  mysqConnection.query(getPedidosQuery, [paid , user_id], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(400).json({ message: "Erro ao buscar os pedidos no banco de dados." });
    }

    if (results.length > 0) {
      const pedidos = results.map(row => ({
        pedido_id: row.ped_id,
        produtos: row.produtos.split(',').map(p => {
          const [produto_id, quantidade, nome, valor, descricao] = p.split(':');
          return { produto_id: produto_id, quantidade: quantidade, nome: nome, valor: valor, descricao: descricao };
        })
      }));

      res.status(200).json({ message: "Pedido atualizado com sucesso!" });
    } else {
      res.status(404).json({ message: "Nenhum pedido encontrado para o usuário especificado." });
    }
  });



    // ... (rest of your code to process payment details)

    res.status(200).json({paymentData});
  } catch (error) {
    console.error("Error fetching payment details:", error);
    console.error("API request URL:", mercadoPagoUrl); // Log the constructed URL
    res.status(500).json({ error: "Failed to retrieve payment details" });
  }
});





module.exports = router;
