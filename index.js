const express = require('express');

const server = express();

server.use(express.json());

server.get('/users', (req, res) => {
  const name = req.query.name;

  return res.json({
    message: `Hello, ${name}!`
  })
})

server.listen(3000);