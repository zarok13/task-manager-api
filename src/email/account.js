const nodemailer = require("nodemailer");

// create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    //secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER_NAME,
        pass: process.env.SMTP_PASSWORD,
    },
});

const sendWelcomeEmail = async (email, name) => {
    await transporter.sendMail({
        from: '"Foo bar" <dreadnought@gmail.com>', // sender address
        to: email, // list of receivers
        subject: "Thanks for joining in!", // Subject line
        text: `Welcome to the app, ${name}. Let me know how you get along with the app.`, // plain text body
    });
}

const sendCancelationEmail = async (email, name) => {
    await transporter.sendMail({
        from: '"Foo bar" <dreadnought@gmail.com>', // sender address
        to: email, // list of receivers
        subject: "Sorry to see you go!", // Subject line
        text: `Goodbue, ${name}. I hope to see you back sometime soon.`, // plain text body
    });
}

module.exports = {
    sendWelcomeEmail,
    sendCancelationEmail
}