const { Client,MessageMedia,LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const fs = require('fs');

const client = new Client({
    puppeteer: {
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    },
    authStrategy: new LocalAuth(),
    
});

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

    if (msg.body === '!viado') {
        try {
            // Mensagem veio de um grupo.
            if (msg.from.includes('@g.us')) { 
                const senderId = msg.author;
                const profilePicUrl = await client.getProfilePicUrl(senderId);
                if (profilePicUrl) {
                    const media = await MessageMedia.fromUrl(profilePicUrl);
                    await client.sendMessage(msg.from, media);
                }
            } else {

                // Mensagem veio de um chat privado.
                const profilePicUrl = await client.getProfilePicUrl(msg.from);
                if (profilePicUrl) {
                    const media = await MessageMedia.fromUrl(profilePicUrl);
                    await client.sendMessage(msg.from, media);
                }
            }

        } catch (error) {
            console.log('Erro método !viado:', error);
        }
    }
});

client.on('message', async (msg) => {
    if (msg.body === '!gatinho') {
        try {
            const dir = './images/gatinhos/';
            const files = fs.readdirSync(dir);
            const randomFile = files[Math.floor(Math.random() * files.length)];
            const media = MessageMedia.fromFilePath(`./images/gatinhos/${randomFile}`);
            await client.sendMessage(msg.from, media);
        } catch (error) {
            console.log('Erro método !gatinho:', error);
        }
    }
});

client.initialize();
