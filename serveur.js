//Chargement express et instanciation du serveur
const express = require('express')
const server = express()

// moteur de template
const { engine } = require('express-handlebars');

const host = '127.0.0.1';
const port = 3000;

// Associer le moteur HandleBars à notre serveur
server.use(express.static('public'));
server.engine('handlebars', engine());
server.set('view engine', 'handlebars');
server.set('views', './views');

//Chargement des modules dont système de fichier et du parser
const Event = require('events');
const File = require('fs');
const csv = require('csv-parser');

//Declaration des constantes et variables
const fileName = "../POC/data/salaires_par_secteur.csv";
const separator = ",";
const skipLines = 1;

const csvOptions = {'separator': separator,
                    'skipLines': skipLines,
                    'headers': false};
                     
var df = [];

//Instanciation d'un evenement
const event = new Event();


function readData(res){
  //Generation du flux de chargement
File.createReadStream(fileName)
  .pipe(csv(csvOptions))
  .on('data', (data) => df.push({'Id' : Number(data[0]), 
                                 'Salaire': Number(data[1]),
                                 'Secteur'  : String(data[2]),
                                }))
  .on('end', () => {res.status(200).send(df);});
}

// Eviter le message CORS
server.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

// Routes

server.get('/', (req, res) => {
  res.render('dashboard', {layout: false});
})

server.get('/api/salaires', (req, res) => {
  readData(res)
})


// server.get('/dashboard', (req, res) => {
//   res.render('dashboard', {
//     vTitre: "Salaires par secteur d'activite",

//     helpers: {
//       nombreSalaires() {return 318+40;}
//     }
//   });
// })

server.listen(port, host, () => {
  console.log(`Server running at http://${host}:${port}/`);
});