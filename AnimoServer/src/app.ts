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
const http = require("http").Server(app);
const server = http.listen(port, () => {
  console.log(`Node.js is listening to PORT: ${(server.address() as AddressInfo).port}`);
});

const io = socketIo(http);

io.on('connection', socket => {
  console.log(`user connected ${socket.id}`)
  // 疎通確認用
  socket.emit('ping', { response: 'pong' });

  socket.on(EventType.Web_Start_Presentation, () => {
    const sessionId = '#ABCDEF'
    socket.join(sessionId)
    io.to(sessionId).emit(EventType.Web_Start_Presentation, {sessionId})
  });

  socket.on(EventType.Mobile_Connect_Presentation, (sessionId: string) => {
    socket.join(sessionId)
    io.to(sessionId).emit(EventType.Mobile_Connect_Complete, {response: 'connect completed'})
  })

  // モバイルの命令をトリガーに*次のスライドへ進む*イベントを発火
  socket.on(EventType.Mobile_Send_NextSlide_Action, (payload: NextSlidePayload) => {
    // Use of Date.now() function
    const d = Date();
    // Converting the number of millisecond in date string
    const a = d.toString()
    console.log(`[${a}]receive ${EventType.Mobile_Send_NextSlide_Action} payload: ${JSON.stringify(payload)}`)
    io.to(payload.sessionId).emit(EventType.Web_Go_To_NextSlide, payload);
  });

  // モバイルの命令をトリガーに*前のスライドへ戻る*イベントを発火
  socket.on(EventType.Mobile_Send_PrevSlide_Action, (payload: PrevSlidePayload) => {
    console.log(`receive ${EventType.Mobile_Send_NextSlide_Action} payload: ${payload}`)
    io.to(payload.sessionId).emit(EventType.Web_Return_To_PrevSlide, payload);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

router.get('/', (req, res) => {
  res.json({ message: 'AniMo server is runnning. 👾' }).status(200);
});
