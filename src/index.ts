import 'module-alias/register';
import dotenv from 'dotenv';
dotenv.config();
import express, { Request, Response } from 'express';
import 'express-async-errors';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import cors from 'cors';

import { indexRouter } from './controllers';

const app = express();

app.use(bodyParser.json({ limit: '10mb' }));
app.use(morgan('tiny'));
app.use(cors());
app.use('/api/v1/', indexRouter);

app.use((err: any, req: Request, res: Response, next: Function) => {
    console.error(err.stack);
    res.status(500).json({ message: err.message });
});

const port = Number(process.env.SERVER_PORT) || 1488;
const host = process.env.SERVER_HOST || '0.0.0.0';

app.listen(port, host, () => console.log(`listening on ${host}:${port}`));
