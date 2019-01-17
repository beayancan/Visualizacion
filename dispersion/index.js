var margin = {top: 40, right: 0, bottom: 70, left: 100},
    majorWidth = 600,
    majorHeigth = 600, // dimensiones
    radio = 7; // radio de los circulos

var width = majorWidth - margin.left - margin.right,
    height = majorHeigth - margin.top - margin.bottom;

var svg = d3.select('#chart') // seleccionamos html con id chart
            .append('svg') // agregamos elemento svg
            .attr('width', majorWidth)
            .attr('height', majorHeigth)
            /*.call(d3.zoom().on("zoom", function () {
                svg.attr("transform", d3.event.transform)
            }))*/ // realizar zoom, necesita mejorarse
            .append('g') // group para almacenar
            .attr('transform', `translate(${margin.left},${margin.top})`)

d3.csv("./data/notas_arquitectura.csv").then(data => {
    // leemos el documento csv de forma asincrona

    var xscale = d3.scaleLinear() // generamos las escalas para la posicion en los ejes
                   .range([0, width])
                   .domain([0, d3.max(data, d => +d.NotaTareas) * 1.1]);

    var yscale = d3.scaleLinear()
                   .range([height, 0])
                   .domain([0, d3.max(data, d => +d.Examen) * 1.1]);

    var color = d3.scaleLinear() // generamos escala de colores según la nota
                  .domain([1, 7])
                  .range(["FireBrick", "RoyalBlue"]);

    var chart = svg.selectAll('circle').data(data) // agregamos el data al svg
                   .enter().append('circle') // por cada dato agregamos un circulo
                   .attr('cx', d => xscale(+d.NotaTareas)) // posicionamos de acuerdo a las notas
                   .attr('cy', d => yscale(+d.Examen))
                   .attr('r', radio) // y su radio
                   .style('fill', d => color((+d.NotaTareas + +d.Examen)/2)) // le damos un color
                   .style('stroke', 'black')
                   .style('stroke-width', '2px');

    var ejeX = d3.axisBottom(xscale), // agregamos las escalas a los ejes
        ejeY = d3.axisLeft(yscale);

    svg.append('g') // agregamos los ejes por medio de un group
       .attr('transform', `translate(0, ${height})`) // el eje x lo colocamos abajo
       .style('font-size', '13px')
       .call(ejeX);

    svg.append('g')
       .call(ejeY)
       .style('font-size', '13px');

    svg.append("text") // agregamos los labes de cada eje
       .attr("transform",
             "translate(" + (width/2) + " ," +
                            (height + margin.top + 20) + ")")
       .text("Notas Tareas");

    svg.append("text")
            .attr("transform", "rotate(-90)" +
            "translate(" + -(height/2) + " ," + -(50) + ")")
            .text("Notas Examen");
})
