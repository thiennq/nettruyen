const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');

app.use(express.static('public'));
app.use(express.static('chapters'));

let home = __dirname;

if (global.isCli) {
  console.log('running in a cli');
  home = process.cwd();

  app.use(express.static(path.join(__dirname, 'public')));
  app.use(express.static(path.join(home, 'chapters')));
}

app.get('/chapters', (req, res) => {
  let result = fs.readdirSync(
    path.join(home, 'chapters')
  );
  result = result.filter(item => item[0] != '.'); // remove hidden files, ex: .gitkeep
  res.send(result);
});

app.get('/chapters/:id', (req, res) => {
  let {id} = req.params;
  let result = fs.readdirSync(
    path.join(home, `chapters/${id}`)
  );
  result = result.filter(item => item[0] != '.'); // remove hidden files, ex: .gitkeep
  res.send(result);
});

let port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Your comic server is running on port ${port}`));
