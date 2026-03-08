const express = require('express');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
app.use(express.urlencoded({ extended: true }));

// 1. HTML-gränssnittet
app.get('/', (req, res) => {
    res.send(`
        <h2>Skicka ett mejl</h2>
        <form action="/send" method="POST">
            <input type="email" name="to" placeholder="Mottagarens mejl" required><br><br>
            <textarea name="message" placeholder="Ditt meddelande"></textarea><br><br>
            <button type="submit">Skicka mejl</button>
        </form>
    `);
});

// 2. Logiken för att skicka mejl
app.post('/send', async (req, res) => {
    const { to, message } = req.body;

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS // Ditt App-lösenord
        }
    });

    try {
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: to,
            subject: 'Hälsning från min Node.js-app',
            text: message
        });
        res.send('Mejlet har skickats! <a href="/">Tillbaka</a>');
    } catch (error) {
        res.status(500).send('Något gick fel: ' + error.message);
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servern körs på port ${PORT}`));