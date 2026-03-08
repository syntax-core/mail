const express = require('express');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
app.use(express.urlencoded({ extended: true }));

// HTML-sidan
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <style>
                body { font-family: sans-serif; padding: 20px; text-align: center; background-color: #f0f2f5; }
                .card { background: white; padding: 25px; border-radius: 15px; box-shadow: 0 4px 10px rgba(0,0,0,0.1); display: inline-block; width: 95%; max-width: 400px; }
                input, textarea { width: 100%; padding: 12px; margin: 10px 0; border: 1px solid #ccc; border-radius: 8px; box-sizing: border-box; font-size: 16px; }
                button { width: 100%; background-color: #28a745; color: white; border: none; padding: 15px; border-radius: 8px; font-size: 18px; cursor: pointer; }
            </style>
        </head>
        <body>
            <div class="card">
                <h2>Mejl-appen ✉️</h2>
                <form action="/send" method="POST">
                    <input type="email" name="to" placeholder="Mottagarens mejl" required>
                    <textarea name="message" placeholder="Skriv något roligt..." required></textarea>
                    <button type="submit">Skicka mejl på riktigt!</button>
                </form>
            </div>
        </body>
        </html>
    `);
});

// Logiken för utskicket
app.post('/send', async (req, res) => {
    const { to, message } = req.body;

    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // Viktigt för port 587
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        },
        tls: {
            // Denna rad gör att anslutningen inte nekas av Render
            rejectUnauthorized: false
        }
    });

    try {
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: to,
            subject: 'Hälsning från min Node-app!',
            text: message
        });
        res.send('<div style="text-align:center; padding:50px; font-family:sans-serif;"><h1>✅ MEJLET SKICKAT!</h1><a href="/">Skicka ett till</a></div>');
    } catch (error) {
        console.error("Felmeddelande:", error.message);
        res.status(500).send(`<div style="text-align:center; padding:50px; font-family:sans-serif; color:red;"><h1>❌ Det gick inte!</h1><p>Fel: ${error.message}</p><a href="/">Försök igen</a></div>`);
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servern körs!`));