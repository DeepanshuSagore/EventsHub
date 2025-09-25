import 'dotenv/config';
import http from 'http';
import app from './app.js';
import { connectDatabase } from './config/database.js';

const port = parseInt(process.env.PORT ?? '5000', 10);

async function startServer() {
  try {
    await connectDatabase();
    const server = http.createServer(app);

    server.listen(port, () => {
      console.log(`EventsHub API listening on port ${port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
