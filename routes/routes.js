const express = require("express");
const router = express.Router();
const { Op } = require("sequelize");
const { Donation } = require("../models");
// const { Users } = require("../models");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const e = require("express");

//For SMTP Mail Sending
let transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: "587",
  auth: {
    user: "gamechanger00029@gmail.com",
    pass: "lwatqpjwhbpggmwr",
  },
});

// Creates a new Donation request on database
router.post("/donate", async (req, res) => {
  const bodyData = req.body;

  message1 = {
    from: "savlavinay022@gmail.com",
    to: "savlavinay022@gmail.com",
    subject: `Thank you ${bodyData.Name} for you donation to IVS Education Council`,
    html: `<p>Dear ${bodyData.Name}, \nWe are greateful to you for your Donation to IVS Education Council of Amount ${bodyData.DonationAmount}. you have also opted for Recurring donation on ${bodyData.DonationFrequency} for ${bodyData.DonationDuration}. We will send you a reminder a day before your next donation date.</p>`,
  };
  message2 = {
    from: "savlavinay022@gmail.com",
    to: "savlavinay022@gmail.com",
    subject: `Thank you ${bodyData.Name} for you donation to IVS Education Council`,
    html: `<p>Dear ${bodyData.Name}, \nWe are greateful to you for your Donation to IVS Education Council of Amount ${bodyData.DonationAmount}.</p>`,
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
