import * as express from 'express';
import * as socketIo from 'socket.io';
import { AddressInfo } from 'net';
import { EventType, NextSlidePayload, PrevSlidePayload } from './AnimoTypes';

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
  // 疎通確認用
  socket.emit('ping', { response: 'pong' });

  // モバイルの命令をトリガーに*次のスライドへ進む*イベントを発火
  socket.on(EventType.Mobile_Send_NextSlide_Action, (payload: NextSlidePayload) => {
    io.sockets.emit(EventType.Web_Go_To_NextSlide, payload);
  });

  // モバイルの命令をトリガーに*前のスライドへ戻る*イベントを発火
  socket.on(EventType.Mobile_Send_PrevSlide_Action, (payload: PrevSlidePayload) => {
    io.sockets.emit(EventType.Web_Return_To_PrevSlide, payload);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

router.get('/', (req, res) => {
  res.json({ message: 'AniMo server is runnning. 👾' }).status(200);
});
