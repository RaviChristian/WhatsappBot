const { Client,MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const fs = require('fs');
const path = require('path');

const idLeila = '558194038470@c.us';

const client = new Client();

client.on('ready', () => {
    console.log('Client is ready!');
});

client.on('qr', qr => {
    qrcode.generate(qr, {small: true});
});


client.on('message', async (msg) => {
    if (msg.body === '!send-media') {
        const media = MessageMedia.fromFilePath('./images/esqueletosDoCoitoAsOito.jpg');
        await client.sendMessage(msg.from, media);
    }
});

client.on('message', async (msg) => {
    if (msg.body === '!gatinho') {
        const dir = './images/gatinhos/';
        const files = fs.readdirSync(dir);
        const randomFile = files[Math.floor(Math.random() * files.length)];
        const media = MessageMedia.fromFilePath(`./images/gatinhos/${randomFile}`);
        await client.sendMessage(msg.from, media);
    }
});

client.on('ready', () => {
    setInterval(async () => {
        const now = new Date();
        const targetHour = 20;

        if (now.getHours() === targetHour && now.getMinutes() === 0) {
            const media = MessageMedia.fromFilePath('./images/esqueletosDoCoitoAsOito.jpg');
            await client.sendMessage(idLeila, media);
            console.log('Mídia enviada!');
        }
    }, 60000);
});

client.initialize();
