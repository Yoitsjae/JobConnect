import cors from 'cors';
import express from 'express';
import router from './routes/index';

const cookieParser = require('cookie-parser');

const server = express();

// parses incoming requests with JSON payloads
server.use(cors());
server.use(express.json());
server.use(cookieParser());
server.use(express.urlencoded({ extended: true }));

server.use('/', router);

// not found
server.use((request, response) => response.status(404).json({ error: 'Not found' }));

const port = process.env.POST || 5000;

server.listen(port, () => {
  console.log(`Server is running on port ${port}\n...`);
});
