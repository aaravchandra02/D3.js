// https://observablehq.com/d/78d6ee113386b0aa@36
import define1 from "./a33468b95d0b15b0@692.js";

export default function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([["Breast-Cancer-Data.csv",new URL("./files/8bae8fa112a02b8f749955f1cb2c8dae530517cfd2b592a151a31f8cc07647228ec836e95aa9afce2d3e19668547796871bdaf2643e9369564e2f23806047009",import.meta.url)]]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], function(md){return(
md`# Brushable Scatterplots`
)});
  const child1 = runtime.module(define1);
  main.import("swatches", child1);
  main.variable(observer("d3")).define("d3", ["require"], function(require){return(
require("d3@5")
)});
  main.variable(observer("padding")).define("padding", function(){return(
30
)});
  main.variable(observer("columns")).define("columns", function(){return(
['mean radius','mean perimeter','mean smoothness','mean concavity']
)});
  main.variable(observer("size")).define("size", ["width","columns","padding"], function(width,columns,padding){return(
(width - (columns.length + 1) * padding) / columns.length + padding
)});
  main.variable(observer("width")).define("width", function(){return(
954
)});
  main.variable(observer("data")).define("data", ["d3","FileAttachment"], async function(d3,FileAttachment){return(
d3.csvParse(await FileAttachment("Breast-Cancer-Data.csv").text(), d3.autoType)
)});
  main.variable(observer("x")).define("x", ["columns","d3","data","padding","size"], function(columns,d3,data,padding,size){return(
columns.map(c => d3.scaleLinear()
    .domain(d3.extent(data, d => d[c]))
    .rangeRound([padding / 2, size - padding / 2]))
)});
  main.variable(observer("y")).define("y", ["x","size","padding"], function(x,size,padding){return(
x.map(x => x.copy().range([size - padding / 2, padding / 2]))
)});
  main.variable(observer("z")).define("z", ["d3","data"], function(d3,data){return(
d3.scaleOrdinal()
    .domain(data.map(d => d.Class))
    .range(d3.schemeCategory10)
)});
  main.variable(observer("xAxis")).define("xAxis", ["d3","size","columns","x"], function(d3,size,columns,x)
{
  const axis = d3.axisBottom()
      .ticks(6)
      .tickSize(size * columns.length);
  return g => g.selectAll("g").data(x).join("g")
      .attr("transform", (d, i) => `translate(${i * size},0)`)
      .each(function(d) { return d3.select(this).call(axis.scale(d)); })
      .call(g => g.select(".domain").remove())
      .call(g => g.selectAll(".tick line").attr("stroke", "#ddd"));
}
);
  main.variable(observer("yAxis")).define("yAxis", ["d3","size","columns","y"], function(d3,size,columns,y)
{
  const axis = d3.axisLeft()
      .ticks(6)
      .tickSize(-size * columns.length);
  return g => g.selectAll("g").data(y).join("g")
      .attr("transform", (d, i) => `translate(0,${i * size})`)
      .each(function(d) { return d3.select(this).call(axis.scale(d)); })
      .call(g => g.select(".domain").remove())
      .call(g => g.selectAll(".tick line").attr("stroke", "#ddd"));
}
);
  main.variable(observer("brush")).define("brush", ["d3","padding","size","x","columns","y"], function(d3,padding,size,x,columns,y){return(
function brush(cell, circle) {
  const brush = d3.brush()
      .extent([[padding / 2, padding / 2], [size - padding / 2, size - padding / 2]])
      .on("start", brushstarted)
      .on("brush", brushed)
      .on("end", brushended);

  cell.call(brush);

  let brushCell;

  // Clear the previously-active brush, if any.
  function brushstarted() {
    if (brushCell !== this) {
      d3.select(brushCell).call(brush.move, null);
      brushCell = this;
    }
  }

  // Highlight the selected circles.
  function brushed([i, j]) {
    if (d3.event.selection === null) return;
    const [[x0, y0], [x1, y1]] = d3.event.selection; 
    circle.classed("hidden", d => {
      return x0 > x[i](d[columns[i]])
          || x1 < x[i](d[columns[i]])
          || y0 > y[j](d[columns[j]])
          || y1 < y[j](d[columns[j]]);
    });
  }

  // If the brush is empty, select all circles.
  function brushended() {
    if (d3.event.selection !== null) return;
    circle.classed("hidden", false);
  }
}
)});
  main.variable(observer("chart")).define("chart", ["d3","padding","width","xAxis","yAxis","columns","size","data","x","y","z","brush"], function(d3,padding,width,xAxis,yAxis,columns,size,data,x,y,z,brush)
{
  const svg = d3.create("svg")
      .attr("viewBox", [-padding, 0, width, width]);

  svg.append("style")
      .text(`circle.hidden { fill: #000; fill-opacity: 1; r: 1px; }`);

  svg.append("g")
      .call(xAxis);

  svg.append("g")
      .call(yAxis);

  const cell = svg.append("g")
    .selectAll("g")
    .data(d3.cross(d3.range(columns.length), d3.range(columns.length)))
    .join("g")
      .attr("transform", ([i, j]) => `translate(${i * size},${j * size})`);

  cell.append("rect")
      .attr("fill", "none")
      .attr("stroke", "#aaa")
      .attr("x", padding / 2 + 0.5)
      .attr("y", padding / 2 + 0.5)
      .attr("width", size - padding)
      .attr("height", size - padding);

  cell.each(function([i, j]) {
    d3.select(this).selectAll("circle")
      .data(data.filter(d => !isNaN(d[columns[i]]) && !isNaN(d[columns[j]])))
      .join("circle")
        .attr("cx", d => x[i](d[columns[i]]))
        .attr("cy", d => y[j](d[columns[j]]));
  });

  const circle = cell.selectAll("circle")
      .attr("r", 3.5)
      .attr("fill-opacity", 0.7)
      .attr("fill", d => z(d.Class));

  cell.call(brush, circle);

  svg.append("g")
      .style("font", "bold 10px sans-serif")
      .style("pointer-events", "none")
    .selectAll("text")
    .data(columns)
    .join("text")
      .attr("transform", (d, i) => `translate(${i * size},${i * size})`)
      .attr("x", padding)
      .attr("y", padding)
      .attr("dy", ".71em")
      .text(d => d);

  return svg.node();
}
);
  return main;
}
