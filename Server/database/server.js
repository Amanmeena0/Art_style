const express = require('express');
const app = express();
const port  = 3000;


app.get('/', (req, res) => {
    res.send('Fuck you bitch');
})

app.listen(port, () => {
    console.log(`server listening at port: ${port}`);
})