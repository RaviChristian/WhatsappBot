const { Client,MessageMedia,LocalAuth,Util } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const fs = require('fs');
const path = require('path');
const os = require('os');

const client = new Client({
    authStrategy: new LocalAuth(),
    webVersionCache: { type: 'remote', remotePath: 'https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2341.18.html', },
    puppeteer: {
      executablePath: process.env.CHROME_PATH,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
      headless: true,
    },
  });

client.on('ready', () => {
    console.log('Client is ready!');
});

client.on('qr', qr => {
    qrcode.generate(qr, {small: true});
});

function checkPhrase(inputMessage, DesiredMessage) {
    
    const normalizedMessage = inputMessage.toLowerCase();
    const normalizedDesiredMessage = DesiredMessage.toLowerCase();

    const stringArray = normalizedMessage.split(" ");

    return stringArray.includes(normalizedDesiredMessage);

  }

client.on('message', async (msg) => {
    if (checkPhrase(msg.body,'!send-media')) {
        const media = MessageMedia.fromFilePath('./images/esqueletosDoCoitoAsOito.jpg');
        await client.sendMessage(msg.from, media);
    }
});

client.on('message', async (msg) => {

    if (checkPhrase(msg.body,'!viado')) {
        try {
            if (msg.from.includes('@g.us')) { 
                const senderId = msg.author;
                const profilePicUrl = await client.getProfilePicUrl(senderId);
                if (profilePicUrl) {
                    const media = await MessageMedia.fromUrl(profilePicUrl);
                    await client.sendMessage(msg.from, media);
                }
            } else {

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

    if (checkPhrase(msg.body,'!viadodogrupo')) {
        try {
            if (msg.from.includes('@g.us')) { 
                groupId = await client.getChatById(msg.from);

                const randomParticipant = Math.floor(Math.random() * groupId.groupMetadata.participants.length);
                const participantId = groupId.groupMetadata.participants[randomParticipant].id;
                const profilePicUrl = await client.getProfilePicUrl(participantId._serialized);
                if (profilePicUrl) {
                    const media = await MessageMedia.fromUrl(profilePicUrl);
                    await client.sendMessage(msg.from, media, {caption: `O viado do grupo é: @${participantId.user}`, mentions: [participantId._serialized]});
                }
            } else {
                await client.sendMessage(msg.from, "Não tá num grupo, animal!");
                
            }

        } catch (error) {
            console.log('Erro método !viadodogrupo:', error);
        }
    }
});


client.on('message', async (msg) => {
    if (checkPhrase(msg.body,'!gatinho')) {
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

client.on('message', async (msg) => {

    if (checkPhrase(msg.body, '!caraoucoroa')) {
        try {
            const output = ['cara', 'coroa'];

            const randomOutput = () => output[Math.floor(Math.random() * output.length)];

            const results = [];
            for (let i = 0; i < 100; i++) {
                results.push(randomOutput());
            }

            const caraCount = results.filter(result => result === 'cara').length;
            const coroaCount = results.filter(result => result === 'coroa').length;

            let vencedor = '';
            if (caraCount > coroaCount) {
                vencedor = '🪙 Cara vence!';
            } else if (coroaCount > caraCount) {
                vencedor = '🪙 Coroa vence!';
            } else {
                vencedor = '🪙 Empate!';
            }
            
            const finalMessage = `Resultados após 100 giros:\nCara: ${caraCount}\nCoroa: ${coroaCount}\n${vencedor}`;

            
            const coinAnimation = [
                '🪙 Moeda girando... ',
                '🪙 /',
                '🪙 -',
                '🪙 \\',
                '🪙 |'
            ];

            let sentMessage = await client.sendMessage(msg.from, '🪙 Moeda girando... ');

            for (let i = 0; i < coinAnimation.length; i++) {
                await sentMessage.edit(coinAnimation[i]);
                if (i == 0) {
                    await new Promise(resolve => setTimeout(resolve, 750));
                }
                await new Promise(resolve => setTimeout(resolve, 250));
            }

            await sentMessage.edit(finalMessage);
        } catch (error) {
            console.log('Erro método !caraoucoroa:', error);
        }
    }
});

client.on('message', async (msg) => {
    if (checkPhrase(msg.body, '!sticker')) {
        if (msg.hasMedia) {
            try {
                const media = await msg.downloadMedia();
    
                const tempDir = os.tmpdir();
                const filePath = path.join(tempDir, `${msg.id.id}.png`);

                const buffer = Buffer.from(media.data, 'base64');
                fs.writeFileSync(filePath, buffer);
    
                const sticker = MessageMedia.fromFilePath(filePath);
                await msg.getChat().then(chat => {
                    chat.sendMessage(sticker, { sendMediaAsSticker: true });
                });
    
                fs.unlinkSync(filePath);
    
            } catch (error) {
                console.log('Erro no método !sticker:', error);
            }
        }
        else {
            await msg.getChat().then(chat => {
                chat.sendMessage("Faltou a imagem animal!");
            });
        }
        
    }
});


client.initialize();
