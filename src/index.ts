import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import { pub, sub } from './redis.js';
import { Message, Room } from './db.js';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Listar salas existentes
app.get('/rooms', async (_req, res) => {
  const rooms = await Room.find().select('name -_id');
  res.json(rooms);
});

io.on('connection', (socket) => {
  console.log('Cliente conectado');

  socket.on('joinRoom', async (room, username) => {
    socket.join(room);
    // Enviar historial al nuevo usuario
    const history = await Message.find({ room }).sort({ timestamp: 1 }).lean();
    socket.emit('chat-history', history);

    // Crear sala si no existe
    const exists = await Room.findOne({ name: room });
    if (!exists) {
      await new Room({ name: room }).save();
    }

    socket.to(room).emit('notification', `${username} se unió al chat`);
  });

  socket.on('chatMessage', async (data) => {
    const { room, user, message } = data;
    const chatMessage = { room, user, message };

    await pub.publish('chat', JSON.stringify(chatMessage));
    await new Message(chatMessage).save();
  });
});

await sub.subscribe('chat', (msg) => {
  const parsed = JSON.parse(msg);
  io.to(parsed.room).emit('chatMessage', parsed);
});

server.listen(3000,'0.0.0.0', () => {
  console.log('Servidor en http://localhost:3000');
});
