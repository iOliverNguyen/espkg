const express = require('express');
const path = require('path');

var app = express();
app.use(express.static(path.join(__dirname, 'static')));

app.use((req, res) => {
  res.status(404).end('hello!')
});

app.listen(3000);
console.log('Express started on port 3000');
