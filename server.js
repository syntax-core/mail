const express = require('express');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send(`
        <style>body { font-family: sans-serif; padding: 20px; }</style>
        <h2>Skicka ett mejl</h2>
        <form action="/send" method="POST">
            <input type="email" name="to" placeholder="Mottagarens mejl" required style="padding:10px; width:100%; max-width:300px;"><br><br>
            <textarea name="message" placeholder="Ditt meddelande" style="padding:10px; width:100%; max-width:300px; height:100px;"></textarea><br><br>
            <button type="submit" style="background:#007bff; color:white; border:none; padding:10px 20px; border-radius:5px;">Skicka mejl</button>
        </form>
    `);
});

app.post('/send', async (req, res) => {
    const { to, message } = req.body;

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    try {
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: to,
            subject: 'Test-mejl från min Node-app',
            text: message
        });
        res.send('<h1>✅ Succé! Mejlet har skickats.</h1><a href="/">Skicka ett till</a>');
    } catch (error) {
        // Detta skriver ut det EXAKTA felet så vi kan se vad som är fel
        res.status(500).send(`<h1>❌ Det gick inte!</h1><p>Felmeddelande: ${error.message}</p><a href="/">Försök igen</a>`);
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server körs på port ${PORT}`));