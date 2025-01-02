import express from 'express'
import cors from 'cors'
import userRouter from './routes/userRoutes.js';
import connectDB from './db/dbConnection.js';
import cookieParser from 'cookie-parser';


const PORT = process.env.PORT || 4000
const app = express();
await connectDB()

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(cors());

app.use('/api/user', userRouter);


app.get('/', (req,res) => res.send("API Working"))

app.listen(PORT, () => console.log('Server running on port ' + PORT));