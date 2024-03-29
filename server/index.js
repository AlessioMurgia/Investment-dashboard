import express from 'express';
import * as dotevn from 'dotenv';
import cors from 'cors';

import connectDB from './mongodb/connect.js';
import userRouter from './routes/user.routes.js'
import assetTypeRouter from './routes/asset-type.routes.js'
import assetRouter from './routes/asset.routes.js'
import sectorRouter from './routes/sector.routes.js'
import areaRouter from './routes/area.routes.js'

dotevn.config();

const app = express();
app.use(cors());
app.use(express.json({limit:'5mb'}));

app.get('/')

app.use('/api/v1/users', userRouter);
app.use('/api/v1/assets', assetRouter);
app.use('/api/v1/types', assetTypeRouter);
app.use('/api/v1/sectors', sectorRouter);
app.use('/api/v1/areas', areaRouter);

const startServer = async () => {
    try{
        connectDB(process.env.MONGODB_URL)

        app.listen(8080, ()=> console.log('listening on http://localhost:8080'));
    } catch(err){
        console.log(err)
    }
}

startServer();