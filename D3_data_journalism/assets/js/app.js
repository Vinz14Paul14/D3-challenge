// @TODO: YOUR CODE HERE!
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;


// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
// "LOOK LOOK - WE CHANGED .CHART -> .SCATTER"
var svg = d3.select("#scatter") 
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

d3.csv("data.csv").then(function(hwData){
  console.log(hwData);
  
  hwData.forEach(function(data) {
    data.poverty = +data.poverty;
    data.healthcare = +data.healthcare;
  });

   // Step 2: Create scale functions
    // ==============================
  var xLinearScale = d3.scaleLinear()
  // LOOK LOOK- "20" MIGHT BE AN ISSUE
  // issue here
    .domain([d3.min(hwData, d => d.poverty)*0.9, d3.max(hwData, d => d.poverty)*1.1])
    .range([0, width]);

  var yLinearScale = d3.scaleLinear()
    .domain([d3.min(hwData, d => d.healthcare)*0.9, d3.max(hwData, d => d.healthcare)*1.1])
    .range([height, 0]);
  
  // Step 3: Create axis functions
  // ==============================
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);
  
  // Step 4: Append Axes to the chart
  // ==============================
  chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  chartGroup.append("g")
    .call(leftAxis);

  // Step 5: Create Circles
  // ==============================
  var circlesGroup = chartGroup.selectAll("circle")
  .data(hwData)
  .enter()
  .append("circle")
  .attr("cx", d => xLinearScale(d.poverty))
  .attr("cy", d => yLinearScale(d.healthcare))
  .attr("r", "10")
  .attr("fill", "red")
  .attr("opacity", "0.5");

  var textsGroup = chartGroup.selectAll("text")
  .data(hwData)
  .enter()
  .append("text")
  .attr("x", d => xLinearScale(d.poverty)-10)
  .attr("y", d => yLinearScale(d.healthcare)+9)
  .text(d => d.abbr);


// // LOOK LOOK - WE PROBABLY DONT NEED THIS STEP 6-8
//  // Step 6: Initialize tool tip
//   // ==============================
//   var toolTip = d3.tip()
//     .attr("class", "tooltip")
//     .offset([80, -60])
//     .html(function(d) {
//       return (`${d.state}<br>poverty: ${d.poverty}<br>healthcare: ${d.healthcare}`);
//     });

// // Step 7: Create tooltip in the chart
// // ==============================
//   chartGroup.call(toolTip);

// // Step 8: Create event listeners to display and hide the tooltip
//   // ==============================
//   circlesGroup.on("click", function(data) {
//     toolTip.show(data, this);
//   })
//     // onmouseout event
//     .on("mouseout", function(data, index) {
//       toolTip.hide(data);
//     });

    // Create axes labels
  chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 40)
    .attr("x", 0 - (height / 1.5))
    .attr("dy", "1em")
    .attr("class", "axisText")
    .text("Lacks Healthcare (%)");

  chartGroup.append("text")
    .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
    .attr("class", "axisText")
    .text("In Poverty (%)");
}).catch(function(error) {
  console.log(error);

});