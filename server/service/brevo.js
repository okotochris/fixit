const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async (email, html) => {
    try {
        const response = await resend.emails.send({
            from: 'serviceHub.space <info@login.edosubebvoucher.org>',
            to: email,
            subject: 'Notification',
            html: html,
        });

        console.log("Email sent:", response);
        return response;

    } catch (error) {
        console.log("Resend error:", error);
        throw error;
    }
};

module.exports = sendEmail;