//Chargement des modules
const Event = require('events');
const File = require('fs');
const csv = require('csv-parser');
const pd = require("node-pandas")

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

//Generation du flux de chargement
File.createReadStream(fileName)
  .pipe(csv(csvOptions))
  .on('data', (data) => df.push({'Id' : Number(data[0]), 
                                 'Salaire': Number(data[1]),
                                 'Secteur'  : String(data[2]),
                                }))
  .on('end', () => event.emit('finished'));

  //Traitement de l'evenement emis en fin de lecture
event.on('finished', function () {
    const parsed_data = df.map((data) => [data.Id, 
                                          data.Salaire, 
                                          data.Secteur,]);
    console.log(parsed_data)
});


df = pd.readCsv("../POC/data/salaires_par_secteur.csv")
df.show
console.log(df['Secteur'])