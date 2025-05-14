import mongoose from 'mongoose';

await mongoose.connect('mongodb://localhost:27017/chat-app');

const messageSchema = new mongoose.Schema({
  room: String,
  user: String,
  message: String,
  timestamp: { type: Date, default: Date.now }
});

const roomSchema = new mongoose.Schema({
  name: { type: String, unique: true }
});

export const Message = mongoose.model('Message', messageSchema);
export const Room = mongoose.model('Room', roomSchema);
