const express = require('express');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send(`
        <style>body { font-family: sans-serif; padding: 20px; text-align: center; }</style>
        <h2>Mejl-appen ✉️</h2>
        <form action="/send" method="POST">
            <input type="email" name="to" placeholder="Mottagarens mejl (t.ex. .com)" required style="padding:12px; width:80%; max-width:300px; border:1px solid #ccc; border-radius:5px;"><br><br>
            <textarea name="message" placeholder="Skriv ditt meddelande här..." style="padding:12px; width:80%; max-width:300px; height:100px; border:1px solid #ccc; border-radius:5px;"></textarea><br><br>
            <button type="submit" style="background:#28a745; color:white; border:none; padding:12px 25px; border-radius:5px; font-size:16px; cursor:pointer;">Skicka mejl nu!</button>
        </form>
    `);
});

app.post('/send', async (req, res) => {
    const { to, message } = req.body;
    console.log(`Försöker skicka mejl till: ${to}`); // Detta syns i loggarna!

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    try {
        const info = await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: to,
            subject: 'Hälsning från min iPad-app!',
            text: message
        });
        console.log('Mejl skickat ID:', info.messageId);
        res.send('<h1>✅ Det funkade! Kolla din inkorg.</h1><a href="/">Skicka ett till</a>');
    } catch (error) {
        console.error('FEL VID UTSKICK:', error.message);
        res.status(500).send(`<h1>❌ Något gick fel</h1><p>Felet är: ${error.message}</p><a href="/">Försök igen</a>`);
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servern är vaken på port ${PORT}`));