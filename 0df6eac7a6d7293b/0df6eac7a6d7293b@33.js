// https://observablehq.com/d/0df6eac7a6d7293b@33
import define1 from "./a33468b95d0b15b0@692.js";

export default function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([["counties-albers-10m-1.json",new URL("./files/50848f0dd4d2d9c84821adba90ca625cb2815694117bbb7b6ae393e788aae9d85f19a6c73d60d642bb04e2f95b87993e8c7312d4d4da6a1431c58460f5ad6c63",import.meta.url)],["us-covid-19.csv",new URL("./files/bd3e17025614faaf8f52c42c30797a7ac5b58d8bcb7b269b19d00742d6ef7188f244988333316a47b05fb154a9a622f4aaed81739225fc9d02517b78f919b15d",import.meta.url)]]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], function(md){return(
md`# Map Data using D3.js

In this visualization we use map covid data on US Map state-wise.`
)});
  const child1 = runtime.module(define1);
  main.import("legend", child1);
  main.variable(observer("d3")).define("d3", ["require"], function(require){return(
require("d3@5")
)});
  main.variable(observer("topojson")).define("topojson", ["require"], function(require){return(
require("topojson-client@3")
)});
  main.variable(observer("us")).define("us", ["FileAttachment"], function(FileAttachment){return(
FileAttachment("counties-albers-10m-1.json").json()
)});
  main.variable(observer("states")).define("states", ["us"], function(us){return(
new Map(us.objects.states.geometries.map(d => [d.id, d.properties]))
)});
  main.variable(observer("format")).define("format", function(){return(
d => `${d}`
)});
  main.variable(observer("path")).define("path", ["d3"], function(d3){return(
d3.geoPath()
)});
  main.variable(observer("color")).define("color", ["d3"], function(d3){return(
d3.scaleSequential([0, 1000], d3.interpolateTurbo)
)});
  main.variable(observer("data")).define("data", ["d3","FileAttachment"], async function(d3,FileAttachment){return(
Object.assign(new Map(d3.csvParse(await FileAttachment("us-covid-19.csv").text(), ({fips, cases}) => [fips, +cases])), {title: "COVID-19 in the US, 06/24/2020"})
)});
  main.variable(observer("chart")).define("chart", ["d3","legend","color","data","topojson","us","path","states","format"], function(d3,legend,color,data,topojson,us,path,states,format)
{
  const svg = d3.create("svg")
      .attr("viewBox", [0, 0, 975, 610]);

  svg.append("g")
      .attr("transform", "translate(610,20)")
      .append(() => legend({color, title: data.title, width: 250}));

  svg.append("g")
    .selectAll("path")
    .data(topojson.feature(us, us.objects.counties).features)
    .join("path")
      .attr("fill", d => color(data.get(d.id)))
      .attr("d", path)
    .append("title")
      .text(d => `${d.properties.name}, ${states.get(d.id.slice(0, 2)).name}
${format(data.get(d.id))}`);

  svg.append("path")
      .datum(topojson.mesh(us, us.objects.states, (a, b) => a !== b))
      .attr("fill", "none")
      .attr("stroke", "white")
      .attr("stroke-linejoin", "round")
      .attr("d", path);

  return svg.node();
}
);
  return main;
}
