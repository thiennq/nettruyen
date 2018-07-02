const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');

app.use(express.static('public'))
app.use(express.static('chapters'))


app.get('/', (req, res) => res.send('Hello World!'));
app.get('/chapters', (req, res) => {
  let result = fs.readdirSync(
    path.join(__dirname, 'chapters')
  );
  result = result.filter(item => item[0] != '.'); // remove hidden files, ex: .gitkeep
  res.send(result);
});

app.get('/chapters/:id', (req, res) => {
  let {id} = req.params;
  let result = fs.readdirSync(
    path.join(__dirname, `chapters/${id}`)
  );
  result = result.filter(item => item[0] != '.'); // remove hidden files, ex: .gitkeep
  res.send(result);
});

app.listen(3000, () => console.log('Example app listening on port 3000!'));
