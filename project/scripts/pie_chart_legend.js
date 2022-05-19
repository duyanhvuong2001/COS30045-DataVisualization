function init() {
  w = 450;
  h = 300;

  var svg = d3
    .select("#pie_1_legend")
    .append("svg")
    .attr("width", w)
    .attr("height", h);

  var keys = [
    "Liquids",
    "Coal",
    "Non-metered Fossil Fuels",
    "Renewables",
    "Gas",
  ];

  var color = d3
    .scaleOrdinal()
    .domain(keys)
    .range(["#66c2a5", "#fc8d62", "#8da0cb", "#e78ac3", "#a6d854"]);

  var size = 20;

  svg
    .selectAll("dots")
    .data(keys)
    .enter()
    .append("rect")
    .attr("x", 100)
    .attr("y", function (d, i) {
      return 100 + i * (size + 5);
    })
    .attr("width", size)
    .attr("height", size)
    .style("fill", function (d) {
      return color(d);
    });

  svg
    .selectAll("labels")
    .data(keys)
    .enter()
    .append("text")
    .attr("x", 100 + size * 1.2)
    .attr("y", function (d, i) {
      return 100 + i * (size + 5) + size / 2;
    })
    .style("fill", function (d) {
      return color(d);
    })
    .text(function (d) {
      return d;
    })
    .attr("text-anchor", "left")
    .style("alignment-baseline", "middle");
}
window.addEventListener("load", init);
