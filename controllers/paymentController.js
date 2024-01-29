const paypal = require("paypal-rest-sdk");
const nodemailer = require("nodemailer");
const axios = require("axios");

const {
  PAYPAL_MODE,
  PAYPAL_CLIENT_KEY,
  PAYPAL_SECRET_KEY,
  BASE_URL,
  SMTP_HOST,
  SMTP_PORT,
  SMTP_USER,
  SMTP_PASSWORD,
} = process.env;
var PayerData = {};

//For SMTP Mail Sending
let transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASSWORD,
  },
});

paypal.configure({
  mode: PAYPAL_MODE, //sandbox or live
  client_id: PAYPAL_CLIENT_KEY,
  client_secret: PAYPAL_SECRET_KEY,
});

const payProduct = async (req, res) => {
  try {
    const create_payment_json = {
      intent: "sale",
      payer: {
        payment_method: "paypal",
      },
      redirect_urls: {
        return_url: BASE_URL + "/paypal/success",
        cancel_url: BASE_URL + "/paypal/cancel",
      },
      transactions: [
        {
          item_list: {
            items: [
              {
                name: "Donationn",
                sku: "001",
                price: req.body.amount,
                currency: req.body.currency,
                quantity: 1,
              },
            ],
          },
          amount: {
            currency: req.body.currency,
            total: req.body.amount,
          },
          description: "Hat for the best team ever",
        },
      ],
    };

    paypal.payment.create(create_payment_json, function (error, payment) {
      if (error) {
        throw error;
      } else {
        for (let i = 0; i < payment.links.length; i++) {
          if (payment.links[i].rel === "approval_url") {
              PayerData[payment.id] = req.body;
            //   res.send(PayerData[payment.id])
            //   res.send(payment);
            res.redirect(payment.links[i].href);
          }
        }
      }
    });
  } catch (error) {
    console.log(error.message);
  }
};

const successPage = async (req, res) => {
  try {
    const payerId = req.query.PayerID;
    const paymentId = req.query.paymentId;
    paymentDetails = PayerData[paymentId];
    console.log(paymentDetails);
    
    const execute_payment_json = {
      payer_id: payerId,
      transactions: [
        {
          amount: {
            currency: paymentDetails.currency,
            total: paymentDetails.amount,
          },
        },
      ],
    };

    paypal.payment.execute(
      paymentId,
      execute_payment_json,
      async function (error, payment) {
        if (error) {
          console.log(error.response);
          throw error;
        } else {
          // Call the /donate API to save payment details
          try {
            const donateResponse = await axios.post("http://localhost:4000/api/donate", paymentDetails);
            // console.log(
            //   "Payment details saved successfully:",
            //   donateResponse.data
            // );
            res.json(donateResponse);
          } catch (apiError) {
            console.error("Error saving payment details:", apiError);
            res.status(500).send("Failed to save payment details");
          }
        //   console.log(JSON.stringify(payment));
        //   res.send("success");
        }
      }
    );
  } catch (error) {
    console.log(error.message);
  }
};

const cancelPage = async (req, res) => {
  try {
    res.send("Payment Unsuccesful");
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = {
  payProduct,
  successPage,
  cancelPage,
};
