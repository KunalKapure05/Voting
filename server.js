
const express = require('express');

const app = express();

const db = require('./db')

const bodyParser = require('body-parser');
app.use(bodyParser.json())

const port = process.env.PORT;

const UserRoutes = require('./routes/UserRoutes');
app.use('/user',UserRoutes)

app.listen(port,()=>{
    console.log("Listening on port no: ",port);
})