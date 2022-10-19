const transporter = require("../config/trasnportSMTP");
const helperFunction = require("../utils/helperFunction");
var hbs = require("nodemailer-express-handlebars");
const path = require('path');
const logger = require("../logger");
const senderEmail = process.env.SENDEREMAIL;
const sendMail = async (req, res, email, otp_Code) => {
  var transport = transporter;
  const handlebarOptions = {
    viewEngine: {
      extName: ".handlebars",
      partialsDir: path.resolve("./app/views"),
      defaultLayout: false,
    },
    viewPath: path.resolve("./app/views"),
    extName: ".handlebars",
  };

  transporter.use("compile", hbs(handlebarOptions));
  var mailOptions = {
    from: {
      name: "Photo Saving",
      address: senderEmail,
    },
    to: email,
    subject: "Reset Password",
    template: "email",
    context: {
      OTP: ` ${otp_Code}`,
    },
  };
  transport.sendMail(mailOptions, function (error, info) {
    if (error) {
      logger.error(
        `ip: ${req.ip},url: ${req.url},error:${error.stack}`,
        "error"
      );
      return helperFunction.serverError(res, "Some Error Is Occurred", error);
    } else {
      console.log("Email sent: " + info.response);
      return helperFunction.success(res, "OTP Has Been Sent To Your Email");
    }
  });
};

module.exports = sendMail;
