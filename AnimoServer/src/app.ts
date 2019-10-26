import * as express from 'express';
import * as socketIo from 'socket.io';
import { AddressInfo } from 'net';

const app = express();
const router = express.Router();

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.use(router);
const port = process.env.PORT || 8080;
const server = app.listen(port, () => {
  console.log(`Node.js is listening to PORT: ${(server.address() as AddressInfo).port}`);
});

const io = socketIo(server);

io.on('connection', socket => {
  socket.emit('ping', { response: 'pong' });
  socket.on('onreq', data => {
    socket.emit('onres', { response: 'on response' });
    io.sockets.emit('onres', { response: 'io.sockets.emit response' });
  });
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

router.get('/', (req, res) => {
  res.json({ message: 'AniMo server is runnning. 👾' }).status(200);
});
