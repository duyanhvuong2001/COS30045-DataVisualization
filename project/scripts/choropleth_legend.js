function init() {
    // set the dimensions and margins of the graph
    var margin = { top: 10, right: 10, bottom: 10, left: 10 },
    w = 600 - margin.left - margin.right,
    h = 100 - margin.top - margin.bottom;
    var paddingInner = 0.05;
    var BAR_HEIGHT = 50;
    //svg for interaction
    var svg = d3
      .select("#choropleth_legend") //create the svg
      .append("svg")
      .attr("width", w + margin.left + margin.right)
      .attr("height", h + margin.top + margin.bottom)
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
   
   var dependencyKeys = [//dependency keys to show in the legend
       "0%",
       "10%",
       "20%",
       "30%",
       "40%",
       "50%",
       "60%",
       "70%",
       "80%",
       "90%",
       "100%"
   ]

   var colorKey = dependencyKeys.slice()//copy new array

   colorKey.pop(); //remove the last element

   console.log(colorKey);

   var color = d3
           .scaleOrdinal()
           .domain(colorKey)
           .range(
               [//color scale
               "#003c30",
               "#01665e",
               "#35978f",
               "#80cdc1",
               "#c7eae5",
               "#f6e8c3",
               "#dfc27d",
               "#bf812d",
               "#8c510a",
               "#543005"
               ]
           )
           ;
   var xScale = d3.scaleBand()
               .domain(dependencyKeys)
               .range([0,w])
               ;
   
   
   svg.selectAll("text")
       .data(dependencyKeys)
       .enter()
       .append("text")
           .attr("y",20)
           .attr("x",function(d,i) {
               return 5+(xScale.bandwidth())*i;
           })
           .text(function (d) {
               return d;
           })
       ;


   svg.selectAll("rect")//create a rect for each field
       .data(colorKey)
       .enter()
       .append("rect")
           .attr("y",25)
           .attr("x",function(d,i) {
               return 10+(xScale.bandwidth())*i;
           })
           .attr("width",function(d,i) {
               return xScale.bandwidth();
           })
           .attr("height",function(d,i) {
               return BAR_HEIGHT;
           })
           .attr("fill", function(d,i) {
               return color(i);
           })
           .attr("opacity",0.8)
           ;
       
}
window.addEventListener("load",init);