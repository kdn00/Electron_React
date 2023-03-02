const express = require('express');
const path = require('path');
const app = express();

app.listen(3000, function () {
  console.log('listening on 3000')
}); 

app.use(express.static(path.join(__dirname, 'react_study/public')));

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '/react_study/public/index.html'));
  });