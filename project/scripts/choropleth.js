function init() {
    var w = 700;
    var h = 500;
    
    var projection = d3.geoMercator() //projection of the map
                        .center([135, -26])
                        .translate([w/2,h/2])
                        .scale(600);//expand the map

    var path = d3.geoPath().projection(projection);//map projection 

    var svg = d3.select("#australia_choropleth")//set up the svg
                .append("svg")
                .attr("width",w)
                .attr("height",h)
                .attr("fill","teal");
    //color scheme
    var color = d3.scaleQuantize()
                    .range(["#f2f0f7",
                            "#9e9ac8",
                            "#54278f"]);

    // d3.json("json/auGeoJson.json",function(json){//load in geo-json data 

    //     svg.selectAll("path") 
    //         .data(json.features)//create one path element for each features
    //         .enter()
    //         .append("path")
    //         .attr("d",path)
           

    //         .style("stroke","black")//stroke color
    //         .style("stroke-width",0.8)
    //         .style("opacity", 0.8)//opacity
    //         .on("mouseover", mouseOver)//mouse over trigger
    //         .on("mouseleave", mouseLeave)//mouse out trigger
    //         ;
    // });

    d3.csv("data/auConsumptionPerState19-20.csv", function(data){
        //map the color range based on loaded data
        color.domain(
            [
                d3.min(data,function(d){return d.PJ;}),
                d3.max(data,function(d){return d.PJ;})
            ]
        );
        
        d3.json("json/auGeoJson.json", function(json) {
            //merge unemployment data and GeoJSON
            //Loop through once for each unemployment value
            
            for(var i=0; i < data.length; i++){
                //town name
                var dataState = data[i].State;
                
                //data value, convert from string to float
                var dataVal = parseFloat(data[i].PJ);
                
                //find corresponding town inside GeoJSON
                for (var j = 0; j < json.features.length; j++){
                    var jsonState = json.features[j].properties.STATE_CODE;
                    
                    if(dataState == jsonState) {
                        //Copy the data value into the JSON
                        json.features[j].properties.value = dataVal;
                        
                        //stop looping through JSON;
                        break;
                    }
                }
            };
            //GeoJSON 
            
            svg.selectAll("path")
            .data(json.features)
            .enter()
            .append("path")
            .attr("d",path)
            .attr("class",function(d){//give each feature a class
                return "state";
            })
            .style("fill",function(d){
                //get data value
                var value = d.properties.value;
                if(value) {
                    //value exists?
                    return color(value);
                }
                else {
                    //if value is undefined, return
                    return "#ccc";
                }
            })

            .style("stroke","black")//stroke color
            .style("stroke-width",0.8)
            .style("opacity", 0.8)//opacity
            .on("mouseover", mouseOver)//mouse over trigger
            .on("mouseleave", mouseLeave)//mouse out trigger
            ;
        });
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