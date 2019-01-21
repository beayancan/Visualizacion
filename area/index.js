var margin = { top: 40, right: 40, bottom: 40, left: 40 }, // dimensiones
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom
    symbol = "IBM"; // tipo de dato a visualizar

var xScale = d3.time.scale().range([0, width]), // generamos las escalas de los ejes
    yScale = d3.scale.linear().range([height, 0]);

var xAxis = d3.svg.axis() // generamos los ejes
                .scale(xScale)
                .tickSize(-height);

var yAxis = d3.svg.axis()
                .scale(yScale)
                .ticks(5) // cantidad de numeros en el eje
                .orient("right");

var chart = d3.svg.area() // generamos el area bajo la curva del gráfico
                 .x(d => xScale(d.date))
                 .y0(height) // donde parte desde abajo
                 .y1(d => yScale(d.price)); // hasta donde debe llegar

var line = d3.svg.line() // generamos una linea que delimitará el area
                 .x(d => xScale(d.date))
                 .y(d => yScale(d.price));

var svg = d3.select("#chart") // seleccionamos el div por su id
            .append("svg") // agregamos el elemento svg
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")"); // lo movemos de acuerdo a los margenes

d3.csv("data/readme.csv", type, function (error, data) {
    if (error) throw error; // en caso de que falle el cargar los datos, nos dice del error

    xScale.domain([d3.min(data, d => d.date), d3.max(data, d => d.date)]); // dominio segun los datos
    yScale.domain([0, d3.max(data, d => d.price)]).nice();

    svg.datum(data)
       .on("click", click)

    svg.append("path") // para para generar el area
       .attr("class", "area")
       .attr("d", chart); // muestra el area del chart

    svg.append("g") // agregamos los ejes
       .attr("class", "x axis")
       .attr("transform", "translate(0," + height + ")")
       .call(xAxis);

    svg.append("g")
       .attr("class", "y axis")
       .attr("transform", "translate(" + width + ",0)")
       .call(yAxis);

    svg.append("path") // path que nos permite mostrar la linea que delimita el area
       .attr("class", "line") // se coloca después para que quede sobre las lineas de los ejes
       .attr("d", line);

    svg.append("text") // agregamos el nombre de los datos que se están leyendo
       .attr("x", width - 6)
       .attr("y", height - 6)
       .attr("transform", "translate(" + -margin.left + ",0)")
       .text(symbol);

    d3.select('#reset') // en caso de realiza un click sobre el boton reset
      .on('click', reset);

    // manejamos una la animación cuando se hace click
    // tal que se puede realiza un zoom interactivo que cambia los datos que se muestran

    function click() { // cuando se realiza click
        console.log("aqui");
        var coordinates = d3.mouse(this); // chequeamos en qué parte se realizó
        var m = Math.floor((coordinates[0] / (width + margin.right)) * data.length); // tomamos el dato más cercano
        switch (true) { // decidimos qué 'radio de meses' darle
            case (m - 6 < 0): // si es muy a la izquierda
                var i = 0,
                    j = 12;
                break;
            case (m + 6 > data.length - 1): // muy a la derecha
                var i = data.length - 1,
                    j = data.length - 13;
                break;
            case (true): // en cualquier otro caso
                var i = m - 6,
                    j = m + 6;
                break
        };

        xScale.domain([data[i].date, data[j].date]); // cambiamos el dominio por el nuevo definido

        var zoom = svg.transition() // realizamos la transición del cambio
                   .duration(1350);

        zoom.select(".x.axis") // seleccionamos el eje
            .call(xAxis); // y le pasamos el el eje con su nuevo dominio

        zoom.select(".area") // seleccionamos el area
            .attr("d", chart); // y realizamos el cambio

        zoom.select(".line") // de igual forma con la linea
            .attr("d", line);
    }

    function reset() {
        xScale.domain([data[0].date, data[data.length - 1].date]);
        var t = svg.transition().duration(1350);
        t.select(".x.axis").call(xAxis);
        t.select(".area").attr("d", chart);
        t.select(".line").attr("d", line);
    };
});

var parse = d3.time // para poder mostrar las fechas de los datos
              .format("%b %Y") // en formato adecuado
              .parse;

// sirve para filtar los datos de tal forma que entreguen
// solo los que se seleccionan en symbol
function type(d) {
    d.date = parse(d.date);
    d.price = +d.price;
    if (d.symbol == symbol) return d;
}