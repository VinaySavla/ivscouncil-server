const express = require("express");
const router = express.Router();
const { Op } = require("sequelize");
const { Donation } = require("../models");
// const { Users } = require("../models");
const nodemailer = require("nodemailer");

const https = require("https");
const qs = require("querystring");
const checksum_lib = require("./paytm/checksum");
const config = require("./paytm/config");
const parseUrl = express.urlencoded({ extended: false });
const parseJson = express.json({ extended: false });

// const dotenv = require("dotenv");
const { PAYPAL_MODE, PAYPAL_CLIENT_KEY, PAYPAL_SECRET_KEY, BASE_URL, SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD } = process.env;

//For SMTP Mail Sending
let transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASSWORD,
  },
});

// Creates a new Donation request on database
router.post("/donate", async (req, res) => {
  const bodyData = req.body;

  message1 = {
    from: "savlavinay022@gmail.com",
    to: "savlavinay022@gmail.com",
    subject: `Thank you ${bodyData.FirstName} for you donation to IVS Education Council`,
    html: `<p>Dear ${bodyData.FirstName}, \nWe are greateful to you for your Donation to IVS Education Council of Amount ${bodyData.amount}. you have also opted for Recurring donation on ${bodyData.DonationFrequency} for ${bodyData.DonationDuration}. We will send you a reminder a day before your next donation date.</p>`,
  };
  message2 = {
    from: "savlavinay022@gmail.com",
    to: "savlavinay022@gmail.com",
    subject: `Thank you ${bodyData.FirstName} for you donation to IVS Education Council`,
    html: `<p>Dear ${bodyData.FirstName}, \nWe are greateful to you for your Donation to IVS Education Council of Amount ${bodyData.amount}.</p>`,
  };
  if (bodyData.isRecurringDonation) {
    transporter.sendMail(message1, function (err, info) {
      if (err) {
        console.log(err);
      } else {
        // console.log(info);
      }
    });
  } else {
    transporter.sendMail(message2, function (err, info) {
      if (err) {
        console.log(err);
      } else {
        // console.log(info);
      }
    });
  }

  const createResponse = await Donation.create(bodyData);
  res.header({
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
    "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token",
  });
  res.json(createResponse);
});


//TODO Paytm
router.post("/paytm", [parseUrl, parseJson], (req, res) => {
  // Route for making payment

  var paymentDetails = {
    amount: req.body.amount,
    customerId: req.body.name.replace(/\s/g,''),
    customerEmail: req.body.email,
    customerPhone: req.body.phone
}
if(!paymentDetails.amount || !paymentDetails.customerId || !paymentDetails.customerEmail || !paymentDetails.customerPhone) {
    res.status(400).send('Payment failed')
} else {
    var params = {};
    params['MID'] = config.mid;
    params['WEBSITE'] = config.website;
    params['CHANNEL_ID'] = 'WEB';
    params['INDUSTRY_TYPE_ID'] = 'Retail';
    params['ORDER_ID'] = 'TEST_'  + new Date().getTime();
    params['CUST_ID'] = paymentDetails.customerId;
    params['TXN_AMOUNT'] = paymentDetails.amount;
    params['CALLBACK_URL'] = config.callback;
    params['EMAIL'] = paymentDetails.customerEmail;
    params['MOBILE_NO'] = paymentDetails.customerPhone;


    checksum_lib.genchecksum(params, config.key, function (err, checksum) {
        var txn_url = "https://securegw-stage.paytm.in/theia/processTransaction"; // for staging
        // var txn_url = "https://securegw.paytm.in/theia/processTransaction"; // for production

        var form_fields = "";
        for (var x in params) {
            form_fields += "<input type='hidden' name='" + x + "' value='" + params[x] + "' >";
        }
        form_fields += "<input type='hidden' name='CHECKSUMHASH' value='" + checksum + "' >";

        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write('<html><head><title>Merchant Checkout Page</title></head><body><center><h1>Please do not refresh this page...</h1></center><form method="post" action="' + txn_url + '" name="f1">' + form_fields + '</form><script type="text/javascript">document.f1.submit();</script></body></html>');
        res.end();
    });
}
});
router.post("/callback", (req, res) => {
  // Route for verifiying payment

  var body = '';

  req.on('data', function (data) {
     body += data;
  });

   req.on('end', function () {
     var html = "";
     var post_data = qs.parse(body);

     // received params in callback
     console.log('Callback Response: ', post_data, "\n");


     // verify the checksum
     var checksumhash = post_data.CHECKSUMHASH;
     // delete post_data.CHECKSUMHASH;
     var result = checksum_lib.verifychecksum(post_data, config.key, checksumhash);
     console.log("Checksum Result => ", result, "\n");


     // Send Server-to-Server request to verify Order Status
     var params = {"MID": config.mid, "ORDERID": post_data.ORDERID};

     checksum_lib.genchecksum(params, config.key, function (err, checksum) {

       params.CHECKSUMHASH = checksum;
       post_data = 'JsonData='+JSON.stringify(params);

       var options = {
         hostname: 'securegw-stage.paytm.in', // for staging
         // hostname: 'securegw.paytm.in', // for production
         port: 443,
         path: '/merchant-status/getTxnStatus',
         method: 'POST',
         headers: {
           'Content-Type': 'application/x-www-form-urlencoded',
           'Content-Length': post_data.length
         }
       };


       // Set up the request
       var response = "";
       var post_req = https.request(options, function(post_res) {
         post_res.on('data', function (chunk) {
           response += chunk;
         });

         post_res.on('end', function(){
           console.log('S2S Response: ', response, "\n");

           var _result = JSON.parse(response);
             if(_result.STATUS == 'TXN_SUCCESS') {
                 res.send('payment sucess')
             }else {
                 res.send('payment failed')
             }
           });
       });

       // post the data
       post_req.write(post_data);
       post_req.end();
      });
     });
});

//TODO Paytm END

// // Creates a new User on database
// router.post("/signup", async (req, res) => {
//   const bodyData = req.body;
//   const createResponse = await Users.create(bodyData);
//   res.header({
//     "Content-Type": "application/json",
//     "Access-Control-Allow-Origin": "*",
//     "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
//     "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token",
//   });
//   res.json(createResponse);
// });

// // Verify User on database
// router.post("/signin", async (req, res) => {
//   const bodyData = req.body;
//   const createResponse = await Users.findOne({
//     where: {
//       Email: bodyData.Email,
//       Password: bodyData.Password,
//     },
//   });
//   res.header({
//     "Content-Type": "application/json",
//     "Access-Control-Allow-Origin": "*",
//     "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
//     "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token",
//   });
//   res.json(createResponse);
// });

// Gets the Donation by id
router.get("/getdonation/:id", async (req, res) => {
  const donationID = req.params.id;
  // console.log(donationID);
  const donationData = await Donation.findByPk(donationID, {
    // include: [
    //   {
    //     model: User,
    //     as: "user",
    //   },
    //   {
    //     model: Status,
    //     as: "status",
    //   },
    // ],
  });
  res.header({
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
    "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token",
  });
  res.json(donationData);
});
// Delete the Donation by id
router.delete("/deletedonation/:id", async (req, res) => {
  const Id = req.params.id;
  const donationData = await Donation.destroy({
    where: {
      Id: Id
    },
    // include: [
    //   {
    //     model: User,
    //     as: "user",
    //   },
    //   {
    //     model: Status,
    //     as: "status",
    //   },
    // ],
  });
  res.header({
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
    "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token",
  });
  res.json(donationData);
});

// Gets all the Donations
router.get("/getalldonations", async (req, res) => {
  const donationData = await Donation.findAll({
    //order condition
    order: [["TimeStamp", "DESC"]],
  });
  res.header({
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
    "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token",
  });
  res.json(donationData);
});

// Updates Donation value
// router.put("/updatedonation/:id", async (req, res) => {
//   const donationID = req.params.id;
//   const donationData = await Donation.update(
//     // { isContacted: true },
//     {
//       where: {
//         Id: donationID,
//       },
//     }
//   );
//   res.header({
//     "Content-Type": "application/json",
//     "Access-Control-Allow-Origin": "*",
//     "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
//     "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token",
//   });
//   res.json(donationData);
// });

module.exports = router;
