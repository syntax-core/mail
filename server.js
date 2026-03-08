const express = require('express');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();

// Gör att vi kan läsa texten som skickas från HTML-formuläret
app.use(express.urlencoded({ extended: true }));

// 1. Webbplatsens utseende (HTML)
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <style>
                body { font-family: sans-serif; padding: 20px; text-align: center; background-color: #f0f2f5; }
                .card { background: white; padding: 25px; border-radius: 15px; box-shadow: 0 4px 10px rgba(0,0,0,0.1); display: inline-block; width: 90%; max-width: 400px; }
                input, textarea { width: 100%; padding: 12px; margin: 10px 0; border: 1px solid #ccc; border-radius: 8px; box-sizing: border-box; font-size: 16px; }
                button { width: 100%; background-color: #28a745; color: white; border: none; padding: 15px; border-radius: 8px; font-size: 18px; cursor: pointer; }
                button:active { background-color: #218838; }
            </style>
        </head>
        <body>
            <div class="card">
                <h2>Mejl-appen ✉️</h2>
                <form action="/send" method="POST">
                    <input type="email" name="to" placeholder="Mottagarens mejl" required>
                    <textarea name="message" placeholder="Vad vill du skriva?" required></textarea>
                    <button type="submit">Skicka mejl nu!</button>
                </form>
            </div>
        </body>
        </html>
    `);
});

// 2. Logiken som skickar mejlet
app.post('/send', async (req, res) => {
    const { to, message } = req.body;

    // Logga i terminalen så vi ser vad som händer
    console.log("Försöker skicka mejl till:", to);

    // Inställningar för att ansluta till Gmail
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // false för port 587
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        },
        tls: {
            rejectUnauthorized: false // Hjälper till att undvika timeout på servrar som Render
        }
    });

    try {
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: to,
            subject: 'Hälsning från min Node-app!',
            text: message
        });

        console.log("✅ Framgång! Mejlet skickades.");
        res.send(`
            <div style="text-align:center; font-family:sans-serif; padding:50px;">
                <h1>✅ Succé!</h1>
                <p>Mejlet har skickats till <b>${to}</b></p>
                <a href="/">Skicka ett till</a>
            </div>
        `);
    } catch (error) {
        console.error("❌ FEL VID UTSKICK:", error.message);
        res.status(500).send(`
            <div style="text-align:center; font-family:sans-serif; padding:50px; color:red;">
                <h1>❌ Det gick inte!</h1>
                <p>Felet är: ${error.message}</p>
                <a href="/" style="color:blue;">Försök igen</a>
            </div>
        `);
    }
});

// 3. Starta servern på rätt port (viktigt för Render!)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servern är igång på port ${PORT}`);
});