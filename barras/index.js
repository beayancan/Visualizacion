var margin = {top: 20, right: 0, bottom: 30, left: 60}, // dimensiones
    chartWidth = 960,
    chartHeight = 500,
    width = chartWidth - margin.left - margin.right,
    height = chartHeight - margin.top - margin.bottom;


var svg = d3.select("#chart") // seleccionamos html con id chart
            .append('svg') // svg para la visualizacion
            .attr('height', chartHeight)
            .attr('width', chartWidth)
            .append("g") // group
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var xScale = d3.scaleBand() // generamos escalas de las barras en v5
               .rangeRound([0, width])
               .padding(0.2); // separacion

var yScale = d3.scaleLinear() // escala linear en v5 para el eje y
               .rangeRound([height, 0]);

d3.csv("./data/carreras.csv").then(data => { // tomamos los datos del csv de forma asincrona

   xScale.domain(data.map(d => d.Run)); // les entregamos el dominio a las escalas según los datos
   yScale.domain([0, d3.max(data, d => +d.Speed)]).nice();

   svg.selectAll("rect") // añadimos los datos generamos
      .data(data)
      .enter().append("rect") // utilizaremos rectangulos
      .attr("class", "bar") // para el estilo
      .attr("x", d => xScale(d.Run)) // entregamos los valores
      .attr("y", d => yScale(+d.Speed))
      .attr("width", xScale.bandwidth()) // posicion
      .attr("height", d => height - yScale(+d.Speed));

   svg.append("g") // añadimos los ejes
      .attr("transform", "translate(0," + height + ")") // en la parte inferior
      .call(d3.axisBottom(xScale));

   svg.append("text") // label para el eje
       .attr("transform", "translate (" + width/2 +"," + (height + 30) + ")")
       .style("font-size", "14px")
       .text("Carrera");

   svg.append("g") // añadimos el eje y
      .call(d3.axisLeft(yScale))
      .append("text") // con su label
      .attr("fill", "#000")
      .attr("transform", "rotate(-90)") // lo rotamos
      .attr("x", -height/3)
      .attr("y", -margin.left*2/3)
      .style("font-size", "14px")
      .text("Velocidad");
});