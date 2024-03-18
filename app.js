const express= require('express');
const authRouter= require('./router/authRoute');
const databaseConnect = require('./config/databaseconfig');
const app = express();
const cookieParser= require('cookie-parser')
const cors= require('cors');

databaseConnect();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: [process.env.CLIENT_URL],
    credentials: true
}))

app.use('/api/auth/', authRouter);

app.use('/', (req, res)=>{
    res.status(200).json({data: 'JWT auth server'});
})


module.exports = app;