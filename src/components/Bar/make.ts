import * as d3 from "d3";
import Util from "lib/Util";

interface Config {
	id: string;
	width: number;
	height: number;
	series: number[]|number[][];
	xAxis: string[];
	label: string;
}

interface Group extends Config {
	series: number[][];
}

interface Single extends Config {
	series: number[];
}

const COLOR = [
	"#A31621", "#B4CEB3", "#EB7C05",
	"#1F7A8C", "#F433AB", "#F3A712",
	"#373D20", "#AFB3F7", "#C6F91F",
	"#C89B7B"
]

export default function make(config:Config) {
	// untie config
	const id = config.id;
	const width = config.width;
	const height = config.height;
	const label = (config.label === "null") ? null : config.label;

	(function clear() {
		d3.selectAll(`${config.id} *`).remove();
	})();

	if(Array.isArray(config.series[0])) {
		multipleBar(config.series as number[][], { id, width, height })
	}
	else {
		singleBar(config as Single);
	}
}

interface OptionsMultipleBar {
	id:string;
	width:number;
	height:number;
	yLabel?:string;
	// xDomain?:number[];
	// yDomain?:number[];
	// zDomain?:number[];
	// colors?:readonly string[];
}

/*
* 입력될 데이터
* [
*   [ 1, 2, 3, 4, 5, 6 ],
*   [ 1, 2, 3, 4, 5, 6 ],
*   [ 1, 2, 3, 4, 5, 6 ],
*   [ 1, 2, 3, 4, 5, 6 ],
* ]
*/

function multipleBar(data:number[][], {
	id, width, height, yLabel="Label"
}:OptionsMultipleBar) {
	const svg = d3.select(id)
	              .attr("width", width)
	              .attr("height", height)
	              .style("border", "1px solid #fff");

	const padding = 45;

	const X = d3.map(data[0], (d, i) => i);
	const Y = d3.map(data, d => d);
	const FY = Util.flat(data);
	const Z = d3.map(data, (d, i) => i)

	const xDomain = new d3.InternSet(X);
	const yDomain = [0, d3.max(FY)!];
	const zDomain = new d3.InternSet(Z);

	const colors = COLOR/*d3.schemeTableau10*/;
	const xRange = [padding, width - padding];
	const xPadding = 0.1;
	const yRange = [height - padding, padding];
	const zPadding = 0.05;
	const yFormat = undefined;

	const xScale = d3.scaleBand(xDomain, xRange).paddingInner(xPadding);
	const xzScale = d3.scaleBand(zDomain, [0, xScale.bandwidth()]).padding(zPadding);
	const yScale = d3.scaleLinear(yDomain, yRange);
	const zScale = d3.scaleOrdinal(zDomain, colors);
	const xAxis = d3.axisBottom(xScale).tickSizeOuter(0);
	const yAxis = d3.axisLeft(yScale).ticks(height/60, yFormat);

	svg.append("g")
		.attr("transform", `translate(${padding}, 0)`)
		.call(yAxis)
		.call(g => g.select(".domain").remove())
		.call(g => g.selectAll(".tick line").clone()
			.attr("x2", width - padding - padding)
			.attr("stroke-opacity", 0.1))
		// .call(g => g.append("text")
		// 	.attr("x", padding)
		// 	.attr("y", 10)
		// 	.attr("fill", "currentColor")
		// 	.text(yLabel));

	for (const x of X) {
		svg.append("g")
		   .selectAll("rect")
		   .data(Z)
		   .join("rect")
		   .attr("x", i => xScale(X[x])! + xzScale(Z[i])!)
		   .attr("y", i => yScale(0))
		   .attr("width", xzScale.bandwidth())
		   .attr("height", i => 0)
		   .attr('fill', i => zScale(Z[i]))
		   .transition()
		   .delay((d, i) => i * 200)
		   .duration(750)
		   .attr("y", i => yScale(Y[i][x]))
		   .attr("height", i => yScale(0) - yScale(Y[i][x]))
	}

	// SVG.selectAll('rect')
	//    .transition()
	//    .duration(750)
	//    .attr("y", (d) => yAxisScale(d as number))
	//    .attr("height", (d) => config.height - yAxisScale(d as number) - PADDING)
	//    .delay((d, i) => i*50);

	svg.append("g")
		.attr("transform", `translate(0, ${height - padding})`)
		.call(xAxis);
}

// function multipleBar_pivot(data:number[][], {
// 	id, width, height, yLabel="Label"
// }:OptionsMultipleBar) {
// 	const svg = d3.select(id)
// 	              .attr("width", width)
// 	              .attr("height", height)
// 	              .style("border", "1px solid #fff");
//
// 	const padding = 45;
//
// 	const X = d3.map(data, (d, i) => i);
// 	const Y = d3.map(data, d => d);
// 	const FY = Util.flat(data);
// 	const Z = d3.map(data[0], (d, i) => i)
//
// 	const xDomain = new d3.InternSet(X);
// 	const yDomain = [0, d3.max(FY)!];
// 	const zDomain = new d3.InternSet(Z);
//
// 	const I = d3.range(X.length).filter(i => xDomain.has(X[i]) && zDomain.has(Z[i]));
//
// 	const colors = d3.schemeTableau10;
// 	const xRange = [padding, width - padding];
// 	const xPadding = 0.1;
// 	const yRange = [height - padding, padding];
// 	const zPadding = 0.05;
// 	const yFormat = undefined;
//
// 	const xScale = d3.scaleBand(xDomain, xRange).paddingInner(xPadding);
// 	const xzScale = d3.scaleBand(zDomain, [0, xScale.bandwidth()]).padding(zPadding);
// 	const yScale = d3.scaleLinear(yDomain, yRange);
// 	const zScale = d3.scaleOrdinal(zDomain, colors);
// 	const xAxis = d3.axisBottom(xScale).tickSizeOuter(0);
// 	const yAxis = d3.axisLeft(yScale).ticks(height/60, yFormat);
//
// 	svg.append("g")
// 	   .attr("transform", `translate(${padding}, 0)`)
// 	   .call(yAxis)
// 	   .call(g => g.select(".domain").remove())
// 	   .call(g => g.selectAll(".tick line").clone()
// 	               .attr("x2", width - padding - padding)
// 	               .attr("stroke-opacity", 0.1))
// 	   .call(g => g.append("text")
// 	               .attr("x", padding)
// 	               .attr("y", 10)
// 	               .attr("fill", "currentColor")
// 	               .text(yLabel));
//
// 	for (const z of Z) {
// 		svg.append("g")
// 		   .selectAll("rect")
// 		   .data(X)
// 		   .join("rect")
// 		   .attr("x", i => xScale(X[i])! + xzScale(Z[z])!)
// 		   .attr("y", i => yScale(Y[i][z]))
// 		   .attr("width", xzScale.bandwidth())
// 		   .attr("height", i => yScale(0) - yScale(Y[i][z]))
// 		   .attr('fill', i => zScale(Z[z]));
// 	}
//
// 	svg.append("g")
// 	   .attr("transform", `translate(0, ${height - padding})`)
// 	   .call(xAxis);
// }

function singleBar(config:Single) {
	const SVG = d3.select(config.id)
	              .attr("width", config.width)
	              .attr("height", config.height)
	              .style("border", "1px solid #fff");

	const PADDING = 45;

	// make xAxis
	const xAxisScale = (function makeXAxis() {
		const xAxisScale = d3.scaleBand()
		                     .domain(config.xAxis)
		                     .range([PADDING, config.width - PADDING])
		                     .padding(0.2);

		const xAxis = d3.axisBottom(xAxisScale);

		SVG.append('g').call(xAxis)
		   .attr("class", 'Bar_xAxis')
		   .attr("transform", `translate(0, ${config.height - PADDING})`);

		return xAxisScale;
	})();

	// make yAxis
	const yAxisScale = (function makeYAxis() {
		const yAxisScale = d3.scaleLinear()
		                     .domain([0, Util.max(config.series)*1.1])
		                     .range([config.height - PADDING, PADDING]);

		const yAxis = d3.axisLeft(yAxisScale).tickFormat((v) => Util.k(v as number));

		SVG.append('g').call(yAxis)
		   .attr("class", 'Bar_yAxis')
		   .attr("transform", `translate(${PADDING}, 0)`);

		return yAxisScale;
	})();

	// match the data
	(function matchToData() {
		SVG.selectAll('rect')
		   .data(config.series)
		   .enter()
		   .append("rect")
			// .attr("class", "")
           .attr("height", 0)
           .attr("width", xAxisScale.bandwidth())
           .attr("x", (d, i) => xAxisScale(config.xAxis[i]) as number)
           .attr("y", config.height - PADDING)
           .attr("fill", "orange");
	})();

	// animate bar
	(function animateChart() {
		SVG.selectAll('rect')
		   .transition()
		   .duration(750)
		   .attr("y", (d) => yAxisScale(d as number))
		   .attr("height", (d) => config.height - yAxisScale(d as number) - PADDING)
		   .delay((d, i) => i*50);
	})();
}
