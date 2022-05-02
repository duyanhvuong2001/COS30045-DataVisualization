function init() {
    var w = 700;
    var h = 500;
    
    var projection = d3.geoMercator() //projection of the map
                        .center([135, -26])
                        .translate([w/2,h/2])
                        .scale(600);//expand the map

    var path = d3.geoPath().projection(projection);

    var svg = d3.select("#australia_choropleth")
                .append("svg")
                .attr("width",w)
                .attr("height",h)
                .attr("fill","teal");
    d3.json("json/auGeoJson.json",function(json){//load in geo-json data 

        svg.selectAll("path") 
            .data(json.features)//create one path element for each features
            .enter()
            .append("path")
            .attr("d",path)
            .attr("class",function(d){//give each feature a class
                return "state";
            })

            .style("stroke","black")//stroke color
            .style("stroke-width",0.8)
            .style("opacity", 0.8)//opacity
            .on("mouseover", mouseOver)//mouse over trigger
            .on("mouseleave", mouseLeave)//mouse out trigger
            ;
    });


    //---------------------------FUNCTIONS------------------------

    //mouseOver function
    var mouseOver = function(d) {
        d3.selectAll(".state")
            .transition()
            .duration(200)
            .style("opacity", .5);//fade other states

        d3.select(this) //highlight this state
            .transition()
            .duration(200)
            .style("opacity", 1)
            .style("stroke", "red")
    }

    //mouseOut function
    var mouseLeave = function(d) {
        d3.selectAll(".state")
            .transition()
            .duration(200)
            .style("stroke","black")//stroke color
            .style("stroke-width",0.8)
            .style("opacity", 0.8)//opacity
    }

}

window.onload =init;