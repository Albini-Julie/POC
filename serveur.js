const express = require('express')
const server = express()

const host = '127.0.0.1';
const port = 3000;

server.get('/', (req, res) => {
  res.send('Bienvenue sur le dashboard')
})

server.get('/dashboard1', (req, res) => {
  res.send('Premier tableau de bord de notre analyse !')
})

server.get('/dashboard2', (req, res) => {
  res.send('Second tableau de bord de notre analyse !')
})

server.listen(port, host, () => {
  console.log(`Server running at http://${host}:${port}/`);
});