var smtpTransport = require('nodemailer-smtp-transport');
const nodemailer = require('nodemailer')


const senderEmail=process.env.SENDEREMAIL
const password=process.env.Password
const service=process.env.SERVICE
const host=process.env.HOST
var transporter = nodemailer.createTransport(smtpTransport({
    service: service,
    host: host,
    secure: true,
    auth: {
        user: senderEmail,
        pass: password
    }
}));



module.exports =transporter