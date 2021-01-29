import 'module-alias/register';
import express, { Request, Response } from 'express';
import 'express-async-errors';
import bodyParser from 'body-parser';

import { indexRouter } from './controllers';

const app = express();

app.use(bodyParser.json());
app.use('/api/v1/', indexRouter);

app.use((err: any, req: Request, res: Response, next: Function) => {
    console.error(err.stack);
    res.status(500).json({ message: err.message });
});

app.listen(1488, () => console.log('listening'));
