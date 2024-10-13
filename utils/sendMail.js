const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
    },
});

const sendVerificationEmail = async (recipientEmail, verificationCode) => {
    const mailOptions = {
        from: process.env.EMAIL,
        to: recipientEmail,
        subject: 'Your Verification Code',
        text: `Your verification code is: ${verificationCode}`,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Verification email sent successfully!');
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Error sending verification email.');
    }
};

module.exports = sendVerificationEmail;
