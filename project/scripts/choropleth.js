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
    
    d3.json("json/auGeoJson.json").then(function(json){//load in geo-json data 

        svg.selectAll("path") 
            .data(json.features)//create one path element for each features
            .enter()
            .append("path")
            .attr("d",path);
    });
}

window.onload =init;