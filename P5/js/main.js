//Kevin Lieu and Pranshav Thakkar

var collegeNames = [];
var raceInfoDict = {};

//Read in csv file for data
    d3.csv("/data/colleges.csv", function (data) {

        //Pie Chart Variables
        var white = 0;
        var black = 0;
        var hispanic = 0;
        var asian = 0;
        var americanIndian = 0;
        var pacificIslander = 0;
        var biracial = 0;
        var other = 0;

        // reformat percentages for use
        data.forEach(function (d) {
            d.White = +d.White.slice(0, -1);
            d.Black = +d.Black.slice(0, -1);
            d.Hispanic = +d.Hispanic.slice(0, -1);
            d.Asian = +d.Asian.slice(0, -1);
            d.American_Indian = +d.American_Indian.slice(0, -1);
            d.Pacific_Islander = +d.Pacific_Islander.slice(0, -1);
            d.Biracial = +d.Biracial.slice(0, -1);
            var other = 1 - d.White - d.Black - d.Hispanic - d.Asian - d.American_Indian - d.Pacific_Islander - d.Biracial;
            var raceDataList = [d.White, d.Black, d.Hispanic, d.Asian, d.American_Indian, d.Pacific_Islander, d.Biracial, other];
            raceInfoDict[d.Name] = raceDataList;
            d["Median Debt"] = +d["Median_Debt"];
            d["Median Debt on Graduation"] = +d["Median_Debt_on_Graduation"];
            d["Median Debt on Withdrawal"] = +d["Median_Debt_on_Withdrawal"];
            d["Average Cost"] = +d["Average_Cost"]
        });

        // traverse through all data elements for college names
        for (var i = 0; i < data.length; i++) {
            if (!(collegeNames.includes(data[i].Name))) {
                collegeNames.push(data[i].Name);
            }
        }



        initialData = data[0];
        console.log(initialData);

        initialWhite = initialData.White;
        initialBlack = initialData.Black;
        initialHispanic = initialData.Hispanic;
        initialAsian = initialData.Asian;
        initialAmericanIndian = initialData.American_Indian;
        initialPacificIslander = initialData.Pacific_Islander;
        initialBiracial = initialData.Biracial;
        initialOther = 1 - initialWhite - initialBlack - initialHispanic - initialAsian - initialAmericanIndian - initialPacificIslander - initialBiracial;

        var raceData = [
          {race: "White", value: initialWhite},
          {race: "Black", value: initialBlack},
          {race: "Hispanic", value: initialHispanic},
          {race: "Asian", value: initialAsian},
          {race: "American Indian", value: initialAmericanIndian},
          {race: "Pacific Islander", value: initialPacificIslander},
          {race: "Biracial", value: initialBiracial},
          {race: "Other", value: initialOther},
        ];

        document.getElementById("admRate").innerHTML = initialData.Admission_Rate*100 + "%";
        document.getElementById("avgCost").innerHTML =  "$" + initialData.Average_Cost;
        document.getElementById("undergradPop").innerHTML = initialData.Undergrad_Population;
        document.getElementById("act").innerHTML = initialData.ACT_Median;
        document.getElementById("sat").innerHTML = initialData.SAT_Average;


        //Populates drop down with array of unique college names
        selector = document.getElementById('collegeSelect');
        for (var i = 0; i < collegeNames.length; i++) {
            selector.options.add(new Option(collegeNames[i], collegeNames[i]));
        }

        //dot chart code
        var dotGraphWidth = 500;
        var dotGraphHeight = 500;

        var arExtent = d3.extent(data, function(row) { return row.Admission_Rate;});
        var rrExtent = d3.extent(data, function(row) {return row.Retention_Rate;})
        // var sorted = data.sort(function(x,y) {
        //   return d3.ascending(x.Admission_Rate, y.Admission_Rate);
        // });

        //console.log(sorted);

        // var sortedExtent = d3.extent(sorted);

        var xScale = d3.scaleLinear().domain(rrExtent).range([50,470]);
        var yScale = d3.scaleLinear().domain(arExtent).range([470,30]);

        var xAxis = d3.axisBottom().scale(xScale);
        var yAxis = d3.axisLeft().scale(yScale);

        var dotGraph = d3.select("#dotGraph")
                         .append("svg:svg")
                         .attr("width", dotGraphWidth)
                         .attr("height", dotGraphHeight);

        var temp1= dotGraph.selectAll("circle")
     	   .data(data)
     	   .enter()
     	   .append("circle")
     	   .attr("id",function(d,i) {return i;} )
     	   .attr("stroke", "black")
     	   .attr("cx", function(d) { return xScale(d.Retention_Rate); })
     	   .attr("cy", function(d) { return yScale(d.Admission_Rate); })
     	   .attr("r", 4);



        dotGraph // or something else that selects the SVG element in your visualizations
       	 .append("g") // create a group node
       	 .attr("transform", "translate(0,"+ (dotGraphWidth -30)+ ")")
       	 .call(xAxis) // call the axis generator
       	 .append("text")
       	 .attr("class", "label")
       	 .attr("x", dotGraphWidth-50)
       	 .attr("y", -5)
       	 .style("text-anchor", "end")
         .style("fill", "black")
       	 .text("Retention Rate");

        dotGraph // or something else that selects the SVG element in your visualizations
 		     .append("g") // create a group node
 		     .attr("transform", "translate(50, 0)")
 		     .call(yAxis)
 		     .append("text")
 		     .attr("class", "label")
 		     .attr("transform", "rotate(-90)")
         .attr("x", -35)
 		     .attr("y", 6)
 		     .attr("dy", ".71em")
 		     .style("text-anchor", "end")
         .style("fill", "black")
 		     .text("Admission Rate");

        //Pie chart code
        var text = "";

        var width = 200;
        var height = 200;
        var padding = 10;
        var opacity = .8;
        var opacityHover = 1;
        var otherOpacityOnHover = .8;
        var tooltipMargin = 13;

        var radius = Math.min(width - padding, height - padding) / 2;
        var color = d3.scaleOrdinal(d3.schemeCategory10);

        var svg = d3.select("#pieChart")
            .append('svg')
            .attr('class', 'pie')
            .attr('id', "svgPie")
            .attr('width', width)
            .attr('height', 300);


        var g = svg.append('g')
            .attr('transform', 'translate(' + (width / 2) + ',' + (height / 2) + ')');

        var arc = d3.arc()
            .innerRadius(0)
            .outerRadius(radius);

        var pie = d3.pie()
            .value(function (d) {
                return d.value;
            })
            .sort(null);

        var path = g.selectAll('path')
            .data(pie(raceData))
            .enter()
            .append("g")
            .append('path')
            .attr('d', arc)
            .attr('fill', (d, i) => color(i))
            .style('opacity', opacity)
            .style('stroke', 'white')
            .on("mouseover", function (d) {
                d3.selectAll('path')
                    .style("opacity", otherOpacityOnHover);
                d3.select(this)
                    .style("opacity", opacityHover);

                let g = d3.select("#svgPie")
                    .style("cursor", "pointer")
                    .append("g")
                    .attr("class", "tooltip")
                    .style("opacity", 0);

                g.append("text")
                    .attr("class", "name-text")
                    .text(`${d.data.race} (${d.data.value})`)
                    .attr('text-anchor', 'middle');

                let text = g.select("text");
                let bbox = text.node().getBBox();
                let padding = 2;
                g.insert("rect", "text")
                    .attr("x", bbox.x - padding)
                    .attr("y", bbox.y - padding)
                    .attr("width", bbox.width + (padding * 2))
                    .attr("height", bbox.height + (padding * 2))
                    .style("fill", "white")
                    .style("opacity", 0.75);
            })
            .on("mousemove", function (d) {
                let mousePosition = d3.mouse(this);
                let x = mousePosition[0] + width / 2;
                let y = mousePosition[1] + height / 2 - tooltipMargin;

                let text = d3.select('.tooltip text');
                let bbox = text.node().getBBox();
                if (x - bbox.width / 2 < 0) {
                    x = bbox.width / 2;
                }
                else if (width - x - bbox.width / 2 < 0) {
                    x = width - bbox.width / 2;
                }

                if (y - bbox.height / 2 < 0) {
                    y = bbox.height + tooltipMargin * 2;
                }
                else if (height - y - bbox.height / 2 < 0) {
                    y = height - bbox.height / 2;
                }

                d3.select('.tooltip')
                    .style("opacity", 1)
                    .attr('transform', `translate(${x}, ${y})`);
            })
            .on("mouseout", function (d) {
                d3.select("#svgPie")
                    .style("cursor", "none")
                    .select(".tooltip").remove();
                d3.selectAll('path')
                    .style("opacity", opacity);
            })
            .on("touchstart", function (d) {
                d3.select("#svgPie")
                    .style("cursor", "none");
            })
            .each(function (d, i) {
                this._current = i;
            });

        let legend = d3.select("#pieChart").append('div')
            .attr('class', 'legend')
            .style('margin-top', '30px');

        let keys = legend.selectAll('.key')
            .data(raceData)
            .enter().append('div')
            .attr('class', 'key')
            .style('display', 'flex')
            .style('align-items', 'center')
            .style('margin-right', '20px');

        keys.append('div')
            .attr('class', 'symbol')
            .style('height', '10px')
            .style('width', '10px')
            .style('margin', '5px 5px')
            .style('background-color', (d, i) => color(i));

        keys.append('div')
            .attr('class', 'name')
            .text(d => `${d.race}`);

        keys.exit().remove();

        //add title
        svg.append("text")
            .attr("x", (width / 2))
            .attr("y", 215)
            .attr("text-anchor", "middle")
            .style("font-size", "16px")
            .text("Ethnicity per College");

        // Bar graph code - to display initial graph data of Abilene Christian University
        // set the dimensions and margins of the graph
        var margin = {top: 10, right: 20, bottom: 60, left: 70};
        barChartWidth = 500 - margin.right - margin.left;
        barChartHeight = 500 - margin.top - margin.bottom;

        // set the ranges
        var x = d3.scaleBand()
            .range([0, barChartWidth])
            .padding(0.1);

        var y = d3.scaleLinear()
            .range([barChartHeight, 0]);

        // append the svg object to the body of the page
        // append a 'group' element to 'svg'
        // moves the 'group' element to the top left margin
        var barChart = d3.select("#barChart")
            .append('svg')
            .attr("id", "barChart")
            .attr('width', barChartWidth + margin.left + margin.right)
            .attr('height', barChartHeight + margin.top + margin.bottom)
            .append('g')
            .attr("transform", "translate(" + margin.left + ',' + margin.right + ')');

        var medianDebt = ["Median Debt", "Median Debt on Graduation", "Median Debt on Withdrawal"];
        var count = [Number(initialData.Median_Debt), Number(initialData.Median_Debt_on_Graduation), Number(initialData.Median_Debt_on_Withdrawal)];

        // Scale the range of the data in the domains
        x.domain(medianDebt);
        y.domain([0, Math.max.apply(Math, count)]);

        var xScale = d3.scaleBand()
            .domain(d3.range(count.length))
            .rangeRound([0, barChartWidth])
            .paddingInner(0.05);

        var yScale = d3.scaleLinear()
            .domain([0, d3.max(count)])
            .range([0, barChartHeight]);

        barChart.selectAll("rect")
            .data(count)
            .enter()
            .append("rect")
            .attr("x", function (d, i) {
                return xScale(i);
            })
            .attr("y", function (d) {
                return barChartHeight - yScale(d);
            })
            .attr("width", xScale.bandwidth())
            .attr("height", function (d) {
                return yScale(d);
            })
            .attr("fill", function (d) {
                return "rgb(255, 0, 0)";
            });

         // add the x Axis
        barChart.append("g")
            .attr("transform", "translate(0," + barChartHeight + ")")
            .call(d3.axisBottom(x));


        // text label for the y axis
        barChart.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left)
            .attr("x", 0 - (barChartHeight / 2))
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text("Dollars");

        // add the y Axis
        barChart.append("g")
            .call(d3.axisLeft(y));

        //add title
        barChart.append("text")
            .attr("x", (barChartWidth / 2))
            .attr("y", 0 - (margin.top / 2))
            .attr("text-anchor", "middle")
            .style("font-size", "16px")
            .style("text-decoration", "underline")
            .text("Median Debt of a Student");

});

function generateGraphs() {
    document.getElementById("pieChart").innerHTML = "";
    document.getElementById("barChart").innerHTML = "";
    var e = document.getElementById("collegeSelect");
    var collegeName = e.options[e.selectedIndex].text;

    d3.csv("/data/colleges.csv", function (data) {
        // Bar graph code - to display initial graph data of Abilene Christian University
        var initialData;

        for (var i = 0; i < data.length; i++) {
            if (data[i].Name == collegeName) {
                initialData = data[i];
                break;
            }
        }


        d3.selectAll("circle").classed('selected', function(m) {
            if (m.Name == collegeName){
                return true;
            };
            return false;
        });

        document.getElementById("admRate").innerHTML = initialData.Admission_Rate*100 + "%";
        document.getElementById("avgCost").innerHTML =  "$" + initialData.Average_Cost;
        document.getElementById("undergradPop").innerHTML = initialData.Undergrad_Population;
        document.getElementById("act").innerHTML = initialData.ACT_Median;
        document.getElementById("sat").innerHTML = initialData.SAT_Average;

        var raceData = [
          {race: "White", value: raceInfoDict[collegeName][0]},
          {race: "Black", value: raceInfoDict[collegeName][1]},
          {race: "Hispanic", value: raceInfoDict[collegeName][2]},
          {race: "Asian", value: raceInfoDict[collegeName][3]},
          {race: "American Indian", value: raceInfoDict[collegeName][4]},
          {race: "Pacific Islander", value: raceInfoDict[collegeName][5]},
          {race: "Biracial", value: raceInfoDict[collegeName][6]},
          {race: "Other", value: raceInfoDict[collegeName][7]},
        ];


        var text = "";

        var width = 200;
        var height = 200;
        var padding = 10;
        var opacity = .8;
        var opacityHover = 1;
        var otherOpacityOnHover = .8;
        var tooltipMargin = 13;

        var radius = Math.min(width - padding, height - padding) / 2;
        var color = d3.scaleOrdinal(d3.schemeCategory10);

        var svg = d3.select("#pieChart")
            .append('svg')
            .attr('class', 'pie')
            .attr('id', "svgPie")
            .attr('width', width)
            .attr('height', 300);


        var g = svg.append('g')
            .attr('transform', 'translate(' + (width / 2) + ',' + (height / 2) + ')');

        var arc = d3.arc()
            .innerRadius(0)
            .outerRadius(radius);

        var pie = d3.pie()
            .value(function (d) {
                return d.value;
            })
            .sort(null);

        var path = g.selectAll('path')
            .data(pie(raceData))
            .enter()
            .append("g")
            .append('path')
            .attr('d', arc)
            .attr('fill', (d, i) => color(i))
            .style('opacity', opacity)
            .style('stroke', 'white')
            .on("mouseover", function (d) {
                d3.selectAll('path')
                    .style("opacity", otherOpacityOnHover);
                d3.select(this)
                    .style("opacity", opacityHover);

                let g = d3.select("#svgPie")
                    .style("cursor", "pointer")
                    .append("g")
                    .attr("class", "tooltip")
                    .style("opacity", 0);

                g.append("text")
                    .attr("class", "name-text")
                    .text(`${d.data.race} (${d.data.value})`)
                    .attr('text-anchor', 'middle');

                let text = g.select("text");
                let bbox = text.node().getBBox();
                let padding = 2;
                g.insert("rect", "text")
                    .attr("x", bbox.x - padding)
                    .attr("y", bbox.y - padding)
                    .attr("width", bbox.width + (padding * 2))
                    .attr("height", bbox.height + (padding * 2))
                    .style("fill", "white")
                    .style("opacity", 0.75);
            })
            .on("mousemove", function (d) {
                let mousePosition = d3.mouse(this);
                let x = mousePosition[0] + width / 2;
                let y = mousePosition[1] + height / 2 - tooltipMargin;

                let text = d3.select('.tooltip text');
                let bbox = text.node().getBBox();
                if (x - bbox.width / 2 < 0) {
                    x = bbox.width / 2;
                }
                else if (width - x - bbox.width / 2 < 0) {
                    x = width - bbox.width / 2;
                }

                if (y - bbox.height / 2 < 0) {
                    y = bbox.height + tooltipMargin * 2;
                }
                else if (height - y - bbox.height / 2 < 0) {
                    y = height - bbox.height / 2;
                }

                d3.select('.tooltip')
                    .style("opacity", 1)
                    .attr('transform', `translate(${x}, ${y})`);
            })
            .on("mouseout", function (d) {
                d3.select("#svgPie")
                    .style("cursor", "none")
                    .select(".tooltip").remove();
                d3.selectAll('path')
                    .style("opacity", opacity);
            })
            .on("touchstart", function (d) {
                d3.select("#svgPie")
                    .style("cursor", "none");
            })
            .each(function (d, i) {
                this._current = i;
            });

        let legend = d3.select("#pieChart").append('div')
            .attr('class', 'legend')
            .style('margin-top', '30px');

        let keys = legend.selectAll('.key')
            .data(raceData)
            .enter().append('div')
            .attr('class', 'key')
            .style('display', 'flex')
            .style('align-items', 'center')
            .style('margin-right', '20px');

        keys.append('div')
            .attr('class', 'symbol')
            .style('height', '10px')
            .style('width', '10px')
            .style('margin', '5px 5px')
            .style('background-color', (d, i) => color(i));

        keys.append('div')
            .attr('class', 'name')
            .text(d => `${d.race}`);

        keys.exit().remove();

        //add title
        svg.append("text")
            .attr("x", (width / 2))
            .attr("y", 215)
            .attr("text-anchor", "middle")
            .style("font-size", "16px")
            .text("Ethnicity per College");


        // set the dimensions and margins of the graph
        var margin = {top: 10, right: 20, bottom: 60, left: 70};
        barChartWidth = 500 - margin.right - margin.left;
        barChartHeight = 500 - margin.top - margin.bottom;

        // set the ranges
        var x = d3.scaleBand()
            .range([0, barChartWidth])
            .padding(0.1);

        var y = d3.scaleLinear()
            .range([barChartHeight, 0]);

        // append the svg object to the body of the page
        // append a 'group' element to 'svg'
        // moves the 'group' element to the top left margin
        var barChart = d3.select("#barChart")
            .append('svg')
            .attr("id", "barChart")
            .attr('width', barChartWidth + margin.left + margin.right)
            .attr('height', barChartHeight + margin.top + margin.bottom)
            .append('g')
            .attr("transform", "translate(" + margin.left + ',' + margin.right + ')');

        var medianDebt = ["Median Debt", "Median Debt on Graduation", "Median Debt on Withdrawal"];
        var count = [Number(initialData.Median_Debt), Number(initialData.Median_Debt_on_Graduation), Number(initialData.Median_Debt_on_Withdrawal)];

        // Scale the range of the data in the domains
        x.domain(medianDebt);
        y.domain([0, Math.max.apply(Math, count)]);

        var xScale = d3.scaleBand()
            .domain(d3.range(count.length))
            .rangeRound([0, barChartWidth])
            .paddingInner(0.05);

        var yScale = d3.scaleLinear()
            .domain([0, d3.max(count)])
            .range([0, barChartHeight]);

        barChart.selectAll("rect")
            .data(count)
            .enter()
            .append("rect")
            .attr("x", function (d, i) {
                return xScale(i);
            })
            .attr("y", function (d) {
                return barChartHeight - yScale(d);
            })
            .attr("width", xScale.bandwidth())
            .attr("height", function (d) {
                return yScale(d);
            })
            .attr("fill", function (d) {
                return "rgb(255, 0, 0)";
            });


         // add the x Axis
        barChart.append("g")
            .attr("transform", "translate(0," + barChartHeight + ")")
            .call(d3.axisBottom(x));


        // text label for the y axis
        barChart.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left)
            .attr("x", 0 - (barChartHeight / 2))
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text("Dollars");

        // add the y Axis
        barChart.append("g")
            .call(d3.axisLeft(y));

        //add title
        barChart.append("text")
            .attr("x", (barChartWidth / 2))
            .attr("y", 0 - (margin.top / 2))
            .attr("text-anchor", "middle")
            .style("font-size", "16px")
            .style("text-decoration", "underline")
            .text("Median Debt of a Student");

    });


}
