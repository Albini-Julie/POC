// Import des librairies d3 et axios
import * as d3 from "https://cdn.skypack.dev/d3@7";
import axios from "https://cdn.skypack.dev/axios@1.6.0";


// Declaration de l'appel asynchrone a l'API 
const apidata = async function getData() {
    return await axios.get('/api/salaires');
}

async function salairesDiagramme() {
    
    // Appel a l'API, recuperation des donnees
    const dataset = await apidata();

    // Formatage du canvas svg
    var svg = d3.select("svg"),
            margin = 200,
            width = svg.attr("width") - margin,
            height = svg.attr("height") - margin;

    // Titre du diagramme
       svg.append("text")
           .attr("transform", "translate(100,0)")
           .attr("x", 70)
           .attr("y", 50)
           .attr("font-size", "22px")
           .text("Salaires par secteur")
    
    // Mise a l'echelle des axes par rapport au canvas
    var xScale = d3.scaleBand().range ([0, width]).padding(0.4),
        yScale = d3.scaleLinear().range ([height, 0]);

    // Dimensionnement des axes en fonctions des donnees
    var g = svg.append("g")
               .attr("transform", "translate(" + 100 + "," + 100 + ")");
        xScale.domain(dataset.data.map(function(d) { return d.Secteur; }));
        yScale.domain([0, d3.max(dataset.data, function(d) { return d.Salaire; })]);
    
    // Edition des labels sur les axes
        g.append("g")
         .attr("transform", "translate(0," + height + ")")
         .call(d3.axisBottom(xScale));

        g.append("g")
         .call(d3.axisLeft(yScale).tickFormat(function(d){
             return d;
         }).ticks(10))
         .append("text")
         .attr("y", 6)
         .attr("dy", "0.70em")
         .attr("text-anchor", "end");
     
     // Tracage des barres
        g.selectAll(".barre")
         .data(dataset.data)
         .enter().append("rect")
         .attr("class", "barre")
         .attr("x", function(d) { return xScale(d.Secteur); })
         .attr("y", function(d) { return yScale(d.Salaire); })
         .attr("width", xScale.bandwidth())
         .attr("height", function(d) { return height - yScale(d.Salaire); });
}

// Appel de la fonction principale
salairesDiagramme();