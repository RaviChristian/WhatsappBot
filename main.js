const { Client,MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const fs = require('fs');

const client = new Client();

client.on('ready', () => {
    console.log('Client is ready!');
});

client.on('qr', qr => {
    qrcode.generate(qr, {small: true});
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

client.initialize();
