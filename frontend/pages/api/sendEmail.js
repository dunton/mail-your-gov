// Fake users data
const nodemailer = require("nodemailer");

export default async (req, res) => {
  // Get data from your database
  const { body } = req;
  const { subject, content, name } = body;

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

  res.status(200);
  if (info) {
    res.send({ success: true });
  } else {
    res.send({ success: false });
  }
};
