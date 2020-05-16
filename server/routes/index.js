const nodemailer = require("nodemailer");
const mongoose = require("mongoose");
const Legislator = mongoose.model("legislators");

module.exports = (app) => {
  app.post("/api/sendEmail", async (req, res) => {
    // Get data from your database
    const { body } = req;
    const { subject, content, name, gov_email, gov_name, location } = body;

    // create reusable transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    let html = "";

    const splitContent = content.split("\n");
    splitContent.forEach((line) => {
      html += `<tr><td>${line}</td></tr>`;
    });

    // //send mail with defined transport object
    const info = await transporter
      .sendMail({
        from: `${name} <mailyourgov@gmail.com>`, // sender address
        to: "ryandunton1@gmail.com", // list of receivers
        subject, // Subject line
        html, // html body
      })
      .then((res) => true)
      .catch((err) => {
        console.log(err);
        return false;
      });

    const existingLegislator = await Legislator.findOne({
      name: gov_name,
    });

    if (existingLegislator) {
      existingLegislator.emailsReceived++;
      existingLegislator.save();
    } else {
      const legislator = await new Legislator({
        name: gov_name,
        email: gov_email,
        state: location,
        emailsReceived: 1,
      }).save();
    }

    res.status(200);
    if (info) {
      res.send({ success: true });
    } else {
      res.send({ success: false });
    }
  });

  // app.get("/api/save", async (req, res) => {
  //   console.log("save");
  // });
};
