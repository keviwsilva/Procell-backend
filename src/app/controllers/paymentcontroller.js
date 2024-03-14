const express = require("express");
const router = express.Router();
const { MercadoPagoConfig, Payment, Preference } = require("mercadopago");
const { verifyToken } = require("../middleware/jwtmiddleware");

const client = new MercadoPagoConfig({
  accessToken:
    "TEST-7757769270547728-031309-03a74c4816326ec165f244f74b43bc9e-259503750",
  
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
    }})
    console.log(paymentRequest)
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



router.post('/notificacao', async (req, res) => {
  const notification = req.body;

  console.log(notification)
  // Verifique a autenticidade da notificação
  const isValid = await preference.verifyNotification(notification);
  if (isValid) {
    // Processe a notificação de acordo com o seu fluxo de negócios
    // (ex: atualizar o status do pedido, liberar o acesso a um serviço)

    res.status(200).send('OK');
  } else {
    res.status(400).send('Notificação inválida.');
  }
});

module.exports = router;
