function init() {
     // set the dimensions and margins of the graph
     var margin = { top: 10, right: 10, bottom: 10, left: 10 },
     w = 600 - margin.left - margin.right,
     h = 200 - margin.top - margin.bottom;
     var paddingInner = 0.05;
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
        "90%"
    ]

    var color = d3
            .scaleOrdinal()
            .domain(dependencyKeys)
            .range(
                [//color scale
                "#543005",
                "#8c510a",
                "#bf812d",
                "#dfc27d",
                "#f6e8c3",
                "#c7eae5",
                "#80cdc1",
                "#35978f",
                "#01665e",
                "#003c30",
                ]
            )
            ;
    var xScale = d3.scaleBand()
                .domain(dependencyKeys)
                .range([0,w]);
    
    
    svg.selectAll("text")
        .data(dependencyKeys)
        .enter()
        .append("text")
            .attr("y",20)
            .attr("x",function(d,i) {
                return 10+(xScale.bandwidth())*i;
            })
            .text(function (d) {
                return d;
            })
        ;


    svg.selectAll("rect")//create a rect for each field
        .data(dependencyKeys)
        .enter()
        .append("rect")
            .attr("y",60)
            .attr("x",function(d,i) {
                return 10+(xScale.bandwidth())*i;
            })
        
}
window.addEventListener("load",init);