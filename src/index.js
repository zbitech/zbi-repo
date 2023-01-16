const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');

const app = express();

app.use(helmet());
app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send({message: "Hello World!"});
});

app.listen(3000, () => {
  console.log('listening on port 3000');
});
