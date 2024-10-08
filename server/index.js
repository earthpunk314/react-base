const express = require('express');
const dotenv = require('dotenv');
dotenv.config();

//const https  = require('https');
const http   = require('http');
const fs     = require('fs');
const cors   = require('cors');
const path   = require('path');
const router = express.Router();
const app    = express();
const controller = require('./controller.js');

const dist = path.join(__dirname, '../client/dist');

app.get('*.js', function (req, res, next) {
  req.url = req.url + '.gz';
  res.set('Content-Encoding', 'gzip');
  next();
});

router.get('/:url', function(req, res) {
  res.sendFile(dist + '/index.html');
});

// var options = {
//   key:  fs.readFileSync(process.env.HTTPS_KEY),
//   cert: fs.readFileSync(process.env.HTTPS_CERT)
// };

const validateClient = function (req, res, next) {
  const authCheck = req.headers.auth;

  if (authCheck === process.env.SERVER_AUTH) {
    next();
  } else {
    return res.status(403).send('Request denied');
  }
};

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(dist));
app.use(router);
app.use(validateClient);

app.post('/api/users', controller.createUser);
app.get('/api/users/:uid', controller.getUser);

// app.get('/api/fix', controller.fix);

const PORT = 4001;

http.createServer(app).listen(PORT);
//https.createServer(options, app).listen(443);
console.log(`Server listening at http://localhost:${PORT}`);
