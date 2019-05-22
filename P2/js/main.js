// **** Your JavaScript code goes here ****
//NOTE: this is the D3 v4 loading syntax. For more details, see https://piazza.com/class/jnzgy0ktwi34lk?cid=75.

var svg = d3.select("#svg");
var width = 750;
var height = 550;

d3.csv("./data/coffee_data.csv", function(data){
			data.forEach(function(d) {
				d['sales'] = +d['sales'];
			});

			var salesByRegion = d3.nest()
				.key(function(d) { return d['region']; })
				.rollup(function(v) { return d3.sum(v, function(d) { return d['sales'];}); })
				.entries(data);

			var salesByCategory = d3.nest()
				.key(function(d) { return d['category']; })
				.rollup(function(v) { return d3.sum(v, function(d) { return d['sales'];}); })
				.entries(data);

			var regionGraph = svg.append("svg")
			    .style("width", width - 70 + "px")
			    .style("height", height + "px")
			    .attr("width", width - 70)
			    .attr("height", (height + 40))
			    .attr("viewBox", "0 0 " + width + " " + (height + 15))
			    .append("g")
			    .attr("transform","translate(" + 70 + ","+ 0 + ")")
			    .attr("class", "svg");

			var maxRegion = d3.max(salesByRegion, function(d) { return d.value })
			var maxCategory = d3.max(salesByCategory, function(d) { return d.value })

      var regionXScale = d3.scaleBand().rangeRound([0, width / 2 - 70]).padding(0.1);
      var regionYScale = d3.scaleLinear().range([height , 0]);

      regionXScale.domain(salesByRegion.map(function(d) { return d.key }));
      regionYScale.domain([0, d3.max([maxRegion, maxCategory])]);

      regionGraph.append("g")
        .attr("transform", "translate(0," + height + ")")
        .attr("class", "x axis")
        .call(d3.axisBottom(regionXScale)
          .tickSize(0, 0)
          .tickSizeInner(0)
          .tickPadding(10));

      regionGraph.append("g")
        .attr("class", "y axis")
        .call(d3.axisLeft(regionYScale)
          .ticks(6)
          .tickSizeInner(0)
          .tickPadding(6)
          .tickSize(0, 0));

      regionGraph.append("g")
        .selectAll(".rect")
        .data(salesByRegion)
        .enter()
        .append("rect")
        .attr("fill", "red")
        .attr("x", function(d) { return regionXScale(d.key); })
        .attr("y", function(d) { return regionYScale(d.value); })
        .attr("height", function(d) { return height - regionYScale(d.value); })
        .attr("width", function(d) { return regionXScale.bandwidth(); });

			regionGraph.append("text")
				.attr("transform", "rotate(270)")
				.attr("y", - 70)
				.attr("x", - (height / 2))
				.attr("dy", "1em")
				.style("text-anchor", "middle")
				.text("Coffee Sales(USD)")

			regionGraph.append("text")
				.attr("y", -40 )
				.attr("x", width / 5)
				.attr("dy", "1em")
				.style("text-anchor", "middle")
				.text("Coffee Sales by Region(USD)")

			regionGraph.append("text")
				.attr("y", height + 20)
				.attr("x", width / 5)
				.attr("dy", "1em")
				.style("text-anchor", "middle")
				.text("Region")

			var categoryGraph = svg.append("svg")
				.style("width", width - 70 + "px")
				.style("height", height + "px")
				.attr("width", width - 70 )
				.attr("height", (height + 40) )
				.attr("viewBox", "0 0 " + width + " " + (height + 15))
				.append("g")
				.attr("transform","translate(" + (70 + width / 2) + "," + 0 + ")")
				.attr("class", "svg");

			var categoryXScale = d3.scaleBand().rangeRound([0, width / 2 - 70]).padding(0.1);
      var categoryYScale = d3.scaleLinear().range([height , 0]);

      categoryXScale.domain(salesByCategory.map(function(d) { return d.key }));
      categoryYScale.domain([0, d3.max([maxRegion, maxCategory])]);


      categoryGraph.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(categoryXScale)
	        .tickSize(0, 0)
	        .tickSizeInner(0)
	        .tickPadding(10));

      categoryGraph.append("g")
				.attr("class", "y axis")
        .call(d3.axisLeft(categoryYScale)
	        .ticks(6)
	        .tickSizeInner(0)
	        .tickPadding(6)
	        .tickSize(0, 0));

      categoryGraph.append("g")
        .selectAll(".rect")
        .data(salesByCategory)
        .enter()
        .append("rect")
        .attr("fill", "blue")
        .attr("x", function(d) { return categoryXScale(d.key); })
        .attr("y", function(d) { return categoryYScale(d.value); })
        .attr("height", function(d) { return height - categoryYScale(d.value); })
        .attr("width", function(d) { return categoryXScale.bandwidth(); });

	    categoryGraph.append("text")
        .attr("transform", "rotate(270)")
        .attr("y", -80)
        .attr("x", - (height / 2))
        .attr("dy", "2em")
        .style("text-anchor", "middle")
        .text("Coffee Sales(USD)")

	    categoryGraph.append("text")
        .attr("y", height + 20 )
        .attr("x", width / 5)
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Product")

	    categoryGraph.append("text")
        .attr("y", -40 )
        .attr("x", width / 5)
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Coffee Sales by Product(USD)")
    });
