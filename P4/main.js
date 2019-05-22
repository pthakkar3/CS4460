var width =500;
var height= 500;

d3.csv("calvinCollegeSeniorScores.csv", function(csv) {
    for (var i=0; i<csv.length; ++i) {
		csv[i].GPA = Number(csv[i].GPA);
		csv[i].SATM = Number(csv[i].SATM);
		csv[i].SATV = Number(csv[i].SATV);
		csv[i].ACT = Number(csv[i].ACT);
    }
    var satmExtent = d3.extent(csv, function(row) { return row.SATM; });
    var satvExtent = d3.extent(csv, function(row) { return row.SATV; });
    var actExtent = d3.extent(csv,  function(row) { return row.ACT;  });
    var gpaExtent = d3.extent(csv,  function(row) {return row.GPA;   });


    var satExtents = {
	"SATM": satmExtent,
	"SATV": satvExtent
    };


    // Axis setup
    var xScale = d3.scaleLinear().domain(satmExtent).range([50, 470]);
    var yScale = d3.scaleLinear().domain(satvExtent).range([470, 30]);

    var xScale2 = d3.scaleLinear().domain(actExtent).range([50, 470]);
    var yScale2 = d3.scaleLinear().domain(gpaExtent).range([470, 30]);

    var xAxis = d3.axisBottom().scale(xScale);
    var yAxis = d3.axisLeft().scale(yScale);

    var xAxis2 = d3.axisBottom().scale(xScale2);
    var yAxis2 = d3.axisLeft().scale(yScale2);

    //Create SVGs for charts
    var chart1 = d3.select("#chart1")
	                .append("svg:svg")
	                .attr("width",width)
	                .attr("height",height);


    var chart2 = d3.select("#chart2")
	                .append("svg:svg")
	                .attr("width",width)
	                .attr("height",height);


	 /******************************************

		ADD BRUSHING CODE HERE

	 ******************************************/

    var brushContainer1 = chart1.append('g')
                                .attr('id', 'brushContainer1');

    var brushContainer2 = chart2.append('g')
                                .attr('id', 'brushContainer2');

    var brush1 = d3.brush()
                   .extent([[0, 0], [width, height]]);
    var brush2 = d3.brush()
                   .extent([[0, 0], [width, height]]);

    brush1.on('start', handleBrush1Start)
          .on('brush', handleBrush1Move)
          .on('end', handleBrush1End);

    brush2.on('start', handleBrush2Start)
          .on('brush', handleBrush2Move)
          .on('end', handleBrush2End);

    brushContainer1.call(brush1);
    brushContainer2.call(brush2);


	 //add scatterplot points
     var temp1= chart1.selectAll("circle")
	   .data(csv)
	   .enter()
	   .append("circle")
	   .attr("id",function(d,i) {return i;} )
	   .attr("stroke", "black")
	   .attr("cx", function(d) { return xScale(d.SATM); })
	   .attr("cy", function(d) { return yScale(d.SATV); })
	   .attr("r", 5)
	   .on("click", function(d,i){
          chart1.selectAll("circle").classed("clickSelect", false);
          chart2.selectAll("circle").classed("clickSelect", function(p) {
            return d.SATM == p.SATM && d.SATV == p.SATV && d.ACT == p.ACT && d.GPA == p.GPA;
          });
          d3.select("#chart3")
            .select("#satm")
            .text(d.SATM);
          d3.select("#chart3")
            .select("#satv")
            .text(d.SATV);
          d3.select("#chart3")
            .select("#act")
            .text(d.ACT);
          d3.select("#chart3")
            .select("#gpa")
            .text(d.GPA);
       });

    var temp2= chart2.selectAll("circle")
	   .data(csv)
	   .enter()
	   .append("circle")
	   .attr("id",function(d,i) {return i;} )
	   .attr("stroke", "black")
	   .attr("cx", function(d) { return xScale2(d.ACT); })
	   .attr("cy", function(d) { return yScale2(d.GPA); })
	   .attr("r", 5)
	   .on("click", function(d,i){
        chart2.selectAll("circle").classed("clickSelect", false);
        chart1.selectAll("circle").classed("clickSelect", function(p) {
          return d.SATM == p.SATM && d.SATV == p.SATV && d.ACT == p.ACT && d.GPA == p.GPA;
        });
        d3.select("#chart3")
          .select("#satm")
          .text(d.SATM);
        d3.select("#chart3")
          .select("#satv")
          .text(d.SATV);
        d3.select("#chart3")
          .select("#act")
          .text(d.ACT);
        d3.select("#chart3")
          .select("#gpa")
          .text(d.GPA);
       });



    chart1 // or something else that selects the SVG element in your visualizations
		.append("g") // create a group node
		.attr("transform", "translate(0,"+ (width -30)+ ")")
		.call(xAxis) // call the axis generator
		.append("text")
		.attr("class", "label")
		.attr("x", width-16)
		.attr("y", -6)
		.style("text-anchor", "end")
    .style("fill", "black")
		.text("SATM");

    chart1 // or something else that selects the SVG element in your visualizations
		.append("g") // create a group node
		.attr("transform", "translate(50, 0)")
		.call(yAxis)
		.append("text")
		.attr("class", "label")
		.attr("transform", "rotate(-90)")
		.attr("y", 6)
		.attr("dy", ".71em")
		.style("text-anchor", "end")
    .style("fill", "black")
		.text("SATV");

    chart2 // or something else that selects the SVG element in your visualizations
		.append("g") // create a group node
		.attr("transform", "translate(0,"+ (width -30)+ ")")
		.call(xAxis2)
		.append("text")
		.attr("class", "label")
		.attr("x", width-16)
		.attr("y", -6)
		.style("text-anchor", "end")
    .style("fill", "black")
		.text("ACT");

    chart2 // or something else that selects the SVG element in your visualizations
		.append("g") // create a group node
		.attr("transform", "translate(50, 0)")
		.call(yAxis2)
		.append("text")
		.attr("class", "label")
		.attr("transform", "rotate(-90)")
		.attr("y", 6)
		.attr("dy", ".71em")
		.style("text-anchor", "end")
    .style("fill", "black")
		.text("GPA");

    function handleBrush1Start() {
      brush2.move(brushContainer2, null);
    }

    function handleBrush1Move() {
      var selection = d3.event.selection;
      if (!selection) {
        return;
      }

      var [[left, top], [right, bottom]] = selection;
      chart1.selectAll("circle").classed("brushSelect", function(d) {
        var cx = xScale(d.SATM);
        var cy = yScale(d.SATV);
        return left <= cx && cx <= right && top <= cy && cy <= bottom;
      });

      brushed = chart1.selectAll("circle.brushSelect").data();
      chart2.selectAll("circle").classed("selected2", function(d) {
        return brushed.includes(d);
      });
    }

    function handleBrush1End() {
      if (!d3.event.selection) {
        chart1.selectAll("circle").classed("brushSelect", false);
        chart2.selectAll("circle").classed("selected2", false);
      }
    }

    function handleBrush2Start() {
      brush1.move(brushContainer1, null);
    }

    function handleBrush2Move() {
      var selection = d3.event.selection;
      if (!selection) {
        return;
      }

      var [[left, top], [right, bottom]] = selection;
      chart2.selectAll("circle").classed("brushSelect", function(d) {
        var cx = xScale2(d.ACT);
        var cy = yScale2(d.GPA);
        return left <= cx && cx <= right && top <= cy && cy <= bottom;
      });

      brushed = chart2.selectAll("circle.brushSelect").data();
      chart1.selectAll("circle").classed("selected", function(d) {
        return brushed.includes(d);
      });
    }

    function handleBrush2End() {
      if (!d3.event.selection) {
        chart2.selectAll("circle").classed("brushSelect", false);
        chart1.selectAll("circle").classed("selected", false);
      }
    }

	});
