import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url'

import bodyParser from "body-parser";

import { authenticateJWT } from './middlewares/auth.js'
import router from "./routes/index.js";
import { corsOptions2, env } from './config.js';

import serveHandler from 'serve-handler';



import express from 'express'
import helmet from "helmet";
import morgan from 'morgan';
import authRoute from './routes/auth.route.js'
const { PORT } = env

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename);

const app = express();
app.use(helmet()); //generel security

app.use(cors(corsOptions2));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));
//app.use(morgan('combined'))


app.use('/auth', authRoute);
app.use('/api', authenticateJWT, router);
app.use('/logs', async (request, response) => {
  await serveHandler(request, response, {
    public: path.join(__dirname, 'logs/public'),
    
    cleanUrls: true,
    unlisted: [".*.json"],
    rewrites: [
      { source: '/:id', destination: '/logs/:id' }  // Single-page application support
    ],
    headers: [
      {
        source: '**/*.{log}',
        
        headers: [{
          key: 'Cache-Control',
          value: 'no-cache'
        }]
      }
    ],
    
  });
})

app.use('/:id', (req, res, next) => {
  const { id } = req.params;
  const url = req.url;
  if(url === '/') {
    const idLog = id.substring(id.length - 3, id.length) === "log"
    if(idLog) {
      res.redirect(`logs/${id}`)
    } else {
      next();
    }
  } else {
    next()
  }
})


app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})