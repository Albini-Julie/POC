// Chargement express et instanciation du serveur
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const server = express();
const { engine } = require('express-handlebars');

// Création du serveur HTTP pour Socket.IO
const serverHttp = http.createServer(server);
const io = socketIo(serverHttp);

const host = '127.0.0.1';
const port = 3000;

// Associer le moteur HandleBars à notre serveur
server.use(express.static('public'));
server.engine('handlebars', engine());
server.set('view engine', 'handlebars');
server.set('views', './views');

// Chargement des modules dont système de fichier et du parser
const Event = require('events');
const File = require('fs');
const csv = require('csv-parser');

// Déclaration des constantes et variables
const fileName = "../POC/data/salaires_par_secteur.csv";
const separator = ",";
const skipLines = 1;

const csvOptions = {
  separator: separator,
  skipLines: skipLines,
  headers: false,
};

var df = [];

// Instanciation d'un événement
const event = new Event();

// Fonction pour lire les données et les émettre
function readData() {
  // Réinitialiser les données
  df = [];
  
  File.createReadStream(fileName)
    .pipe(csv(csvOptions))
    .on('data', (data) => {
      const record = {
        Id: Number(data[0]),
        Salaire: Number(data[1]),
        Secteur: String(data[2]),
      };
      df.push(record);
      io.emit('newData', record); // Émet chaque nouvelle ligne au client
    })
    .on('end', () => {
      console.log('Données chargées et diffusées');
    });
}

// Eviter le message CORS
server.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

// Routes

server.get('/', (req, res) => {
  res.render('dashboard', { layout: false });
});

server.get('/api/salaires', (req, res) => {
  res.status(200).send(df);
});

// Configuration de Socket.IO pour la diffusion en temps réel
io.on('connection', (socket) => {

  socket.emit('initialData', df);

  // Gérer la déconnexion
  socket.on('disconnect', () => {
  });
});


readData()

// Charger les données périodiquement
setInterval(readData, 5000); // Rafraîchit toutes les 5 secondes

// Démarrer le serveur
serverHttp.listen(port, host, () => {
  console.log(`Server running at http://${host}:${port}/`);
});