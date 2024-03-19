const bodyParser = require('body-parser');
const express = require('express');

const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.json())

const port = process.env.PORT;

app.listen(port,()=>{
    console.log("Listening on port no: ",port);
})