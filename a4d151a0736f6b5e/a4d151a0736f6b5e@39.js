// https://observablehq.com/d/a4d151a0736f6b5e@39
export default function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([["data-sc.csv",new URL("./files/9e537c3557b44b20ba73753b78ab75c047795925a104bf50954364d8777d65b2f2dc32dc4ebe0899db28d1215a158d687aedcd148a8e6edfd3616043ecbed872",import.meta.url)]]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], function(md){return(
md`# First Try`
)});
  main.variable(observer("d3")).define("d3", ["require"], function(require){return(
require("d3@5")
)});
  main.variable(observer()).define(["md"], function(md){return(
md`Defining color,size, and margin attributes of the bar chart:`
)});
  main.variable(observer("color")).define("color", function(){return(
"steelblue"
)});
  main.variable(observer("height")).define("height", function(){return(
800
)});
  main.variable(observer("margin")).define("margin", function(){return(
{top:30,right:0,bottom:30,left:40}
)});
  main.variable(observer()).define(["md"], function(md){return(
md`Loading Data`
)});
  main.variable(observer("data")).define("data", ["d3","FileAttachment"], async function(d3,FileAttachment){return(
d3.csvParse(await FileAttachment("data-sc.csv").text(),d3.autoType)
)});
  main.variable(observer()).define(["md"], function(md){return(
md`Defining Sclaes & Axes`
)});
  main.variable(observer("x")).define("x", ["d3","data","margin","width"], function(d3,data,margin,width){return(
d3.scaleBand()
  .domain(d3.range(data.length))
  .range([margin.left,3.0*width-margin.right])
  .padding(0.1)
)});
  main.variable(observer("y")).define("y", ["d3","data","height","margin"], function(d3,data,height,margin){return(
d3.scaleLinear()
    .domain([0,d3.max(data,d=>d.Cases)]).nice()
    .range([height-margin.bottom,margin.top])
)});
  main.variable(observer("xAxis")).define("xAxis", ["height","margin","d3","x","data"], function(height,margin,d3,x,data){return(
g=>g
    .attr("transform",`translate(0,${height-margin.bottom})`)
    .call(d3.axisBottom(x).tickFormat(i=>data[i].County).tickSizeOuter(0))
)});
  main.variable(observer("yAxis")).define("yAxis", ["margin","d3","y","data"], function(margin,d3,y,data){return(
g=>g
     .attr("transform",`translate(${margin.left},0)`)
     .call(d3.axisLeft(y).ticks(null,data.format))
     .call(g=>g.select(".domain").remove())
     .call(g=>g.append("text")
           .attr("x",-margin.left)
           .attr("y",10)
           .attr("fill","currentColor")
           .attr("text-anchor","start")
           .text(data.Cases))
)});
  main.variable(observer("chart")).define("chart", ["d3","width","height","color","data","x","y","xAxis","yAxis"], function(d3,width,height,color,data,x,y,xAxis,yAxis)
{
  const svg = d3.create("svg")
  .attr("viewBox",[0,0,width,height]);
  
  svg.append("g")
      .attr("fill",color)
    .selectAll("rect")
    .data(data)
    .join("rect")
      .attr("x",(d,i)=>x(i))
      .attr("y",d=>y(d.Cases))
      .attr("height",d=>y(0)-y(d.Cases))
      .attr("width",x.bandwidth());
  
  svg.append("g")
    .call(xAxis);
  
  svg.append("g")
    .call(yAxis);
  
  return svg.node();
}
);
  return main;
}
