// https://observablehq.com/d/d882675b8d8f015a@44
export default function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([["data-sc.csv",new URL("./files/9e537c3557b44b20ba73753b78ab75c047795925a104bf50954364d8777d65b2f2dc32dc4ebe0899db28d1215a158d687aedcd148a8e6edfd3616043ecbed872",import.meta.url)]]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], function(md){return(
md`# Zoomable & Sorted bar chart`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`Loading D3.js package into the Observable environment:`
)});
  main.variable(observer("d3")).define("d3", ["require"], function(require){return(
require("d3@5")
)});
  main.variable(observer()).define(["md"], function(md){return(
md`Defining color, size, and margin attributes of the bar chart:`
)});
  main.variable(observer("color")).define("color", function(){return(
"green"
)});
  main.variable(observer("height")).define("height", function(){return(
1000
)});
  main.variable(observer("margin")).define("margin", function(){return(
{top: 40, right: 0, bottom: 40, left: 40}
)});
  main.variable(observer()).define(["md"], function(md){return(
md`Loading data:`
)});
  main.variable(observer("data")).define("data", ["d3","FileAttachment"], async function(d3,FileAttachment){return(
d3.csvParse(await FileAttachment("data-sc.csv").text(), d3.autoType)
)});
  main.variable(observer("sortedData")).define("sortedData", ["data","d3"], function(data,d3){return(
data.slice().sort((a, b) => d3.descending(a.Cases, b.Cases))
)});
  main.variable(observer()).define(["md"], function(md){return(
md`Defining scales and axes:`
)});
  main.variable(observer("x")).define("x", ["d3","sortedData","margin","width"], function(d3,sortedData,margin,width){return(
d3.scaleBand()
    .domain(sortedData.map(d => d.County))
    .range([margin.left, width - margin.right])
    .padding(0.1)
)});
  main.variable(observer("y")).define("y", ["d3","sortedData","height","margin"], function(d3,sortedData,height,margin){return(
d3.scaleLinear()
    .domain([0, d3.max(sortedData, d => d.Cases)]).nice()
    .range([height - margin.bottom, margin.top])
)});
  main.variable(observer("xAxis")).define("xAxis", ["height","margin","d3","x"], function(height,margin,d3,x){return(
g => g
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x).tickSizeOuter(0))
)});
  main.variable(observer("yAxis")).define("yAxis", ["margin","d3","y"], function(margin,d3,y){return(
g => g
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(y))
    .call(g => g.select(".domain").remove())
)});
  main.variable(observer()).define(["md"], function(md){return(
md`#Creating zoom interaction function:`
)});
  main.variable(observer("zoom")).define("zoom", ["margin","width","height","d3","x","xAxis"], function(margin,width,height,d3,x,xAxis){return(
function zoom(svg) {
  const extent = [[margin.left, margin.top], [width - margin.right, height - margin.top]];

  svg.call(d3.zoom()
      .scaleExtent([1, 8])
      .translateExtent(extent)
      .extent(extent)
      .on("zoom", zoomed));

  function zoomed() {
    x.range([margin.left, width - margin.right].map(d => d3.event.transform.applyX(d)));
    svg.selectAll(".bars rect").attr("x", d => x(d.County)).attr("width", x.bandwidth());
    svg.selectAll(".x-axis").call(xAxis);
  }
}
)});
  main.variable(observer()).define(["md"], function(md){return(
md`Creating bar chart:`
)});
  main.variable(observer("chart")).define("chart", ["d3","width","height","zoom","sortedData","x","y","xAxis","yAxis"], function(d3,width,height,zoom,sortedData,x,y,xAxis,yAxis)
{
  const svg = d3.create("svg")
      .attr("viewBox", [0, 0, width, height])
      .call(zoom);

  svg.append("g")
      .attr("class", "bars")
      .attr("fill", "green")
    .selectAll("rect")
    .data(sortedData)
    .join("rect")
      .attr("x", d => x(d.County))
      .attr("y", d => y(d.Cases))
      .attr("height", d => y(0) - y(d.Cases))
      .attr("width", x.bandwidth());

  svg.append("g")
      .attr("class", "x-axis")
      .call(xAxis);

  svg.append("g")
      .attr("class", "y-axis")
      .call(yAxis);

  return svg.node();
}
);
  return main;
}
