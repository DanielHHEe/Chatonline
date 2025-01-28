const { WebSocketServer } = require('ws');
const dotenv = require('dotenv');

dotenv.config();

const wss = new WebSocketServer({ port: process.env.Port || 8080 });

wss.on('connection', (ws) => {
    ws.on("error", console.error);

    ws.on("message", (data) => {
        console.log(data.toString());

        // Envia a mensagem para todos os outros clientes conectados
        wss.clients.forEach((client) => {
            if (client !== ws && client.readyState === client.OPEN) {
                client.send(data.toString());
            }
        });
    });

    console.log("Cliente conectado");

    ws.on('close', () => {
        console.log("Cliente desconectado");
    });
});
