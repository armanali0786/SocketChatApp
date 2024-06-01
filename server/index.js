const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const bodyParser = require('body-parser');
const socket = require('./socket')
const db = require('./models/index');
const authRoute = require('./router/auth');
const messageRoute = require('./router/message');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/auth', authRoute);
app.use('/api', messageRoute);


const server = createServer(app);

db.sync().then(() => {
  console.log('Database synchronized');
}).catch((error) => {
  console.error('Failed to synchronize database:', error);
});

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
  },
});

server.listen(5000, () => {
  socket(server);
  console.log('listening on 5000');
});
