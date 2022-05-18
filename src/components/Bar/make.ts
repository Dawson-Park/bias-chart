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

// const COLOR = [
// 	"#d53e4f", "#f46d43", "#fdae61",
// 	"#fee08b", "#ffffbf", "#e6f598",
// 	"#abdda4", "#66c2a5", "#3288bd",
// 	"#95B5FF",
// ]

export default function make(config:Config) {
	// untie config
	const id = config.id;
	const width = config.width;
	const height = config.height;
	const label = (config.label === "null") ? undefined : config.label;
	const xLabel = (config.xAxis.length > 0) ? config.xAxis : undefined;

	(function clear() {
		d3.selectAll(`${config.id} *`).remove();
	})();

	if(Array.isArray(config.series[0])) {
		multipleBar(config.series as number[][], { id, width, height, xLabel, yLabel:label })
	}
	else {
		multipleBar([config.series as number[]], { id, width, height, xLabel, yLabel:label })
		// singleBar(config as Single);
	}
}

interface OptionsMultipleBar {
	id:string;
	width:number;
	height:number;
	xLabel?:string[];
	yLabel?:string;
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

function multipleBar(data:number[][], { id, width, height, xLabel, yLabel }:OptionsMultipleBar) {
	const svg = d3.select(id)
	              .attr("width", width)
	              .attr("height", height)
	              // .style("border", "1px solid #fff");

	const padding = 30;
	const margin = 15;

	// const X = d3.map(data[0], (d, i) => i);
	const X = (() => {
		if(!!xLabel) return d3.map(xLabel, (d) => d);
		else return d3.map(data[0], (d, i) => i.toString());
	})();
	const Y = d3.map(data, d => d);
	const FY = Util.flat(data);
	const Z = d3.map(data, (d, i) => i);

	const xDomain = new d3.InternSet(X);
	const yDomain = [0, d3.max(FY)! * 1.1];
	const zDomain = new d3.InternSet(Z);

	const colorDomain = (() => {
		if(Z.length > 11) return 11;
		if(Z.length < 3) return 3;
		return Z.length;
	})();

	const colors = d3.schemeSpectral[colorDomain];
	const xPadding = 0.2;
	const xRange = [padding+margin, width - padding-margin];
	const yRange = [height - padding, padding];
	const zPadding = 0.1;
	const yFormat = undefined;

	const xScale = d3.scaleBand(xDomain, xRange).paddingInner(xPadding);
	const xzScale = d3.scaleBand(zDomain, [0, xScale.bandwidth()]).padding(zPadding);
	const yScale = d3.scaleLinear(yDomain, yRange);
	const zScale = d3.scaleOrdinal(zDomain, colors);
	const xAxis = d3.axisBottom(xScale).tickSizeOuter(0);
	const yAxis = d3.axisLeft(yScale).ticks(height/60, yFormat);

	if(!!yLabel) {
		svg.append("g")
		   .attr("transform", `translate(${padding}, 0)`)
		   .call(yAxis)
		   .call(g => g.select(".domain").remove())
		   .call(g => g.selectAll(".tick line").clone()
		               .attr("x2", width - padding - padding)
		               .attr("stroke-opacity", (d, i) => i===0 ? 1:0.1))
		   .call(g => g.append("text")
		               .attr("x", -padding)
		               .attr("y", padding)
		               .attr("fill", "currentColor")
		               .attr("class", "ylabel")
		               .text(yLabel));

		const textWidth = (d3.select("text.ylabel").node() as SVGAElement).getBBox().width;
		const textHeight = (d3.select("text.ylabel").node() as SVGAElement).getBBox().height;
		d3.select("text.ylabel").attr("transform", `translate(${textWidth}, ${-textHeight})`);
	}
	else {
		svg.append("g")
		   .attr("transform", `translate(${padding}, 0)`)
		   .call(yAxis)
		   .call(g => g.select(".domain").remove())
		   .call(g => g.selectAll(".tick line").clone()
		               .attr("x2", width - padding - padding)
		               .attr("stroke-opacity", (d, i) => i===0 ? 1:0.1))
	}

	for (const x in X) {
		svg.append("g") // 그래프 추가
		   .selectAll("rect") // 모든 사각형을 선택
		   .data(Z) // 연동할 데이터 : Z축
		   .join("rect")
		   .attr("x", i => xScale(X[x])! + xzScale(Z[i])!)
		   .attr("y", yScale(0))
		   .attr("width", xzScale.bandwidth())
		   .attr("height", 0)
		   .attr('fill', i => zScale(Z[i]))
		   // event
		   .on("mouseover", (e, z) => _pointerOver(e, x, z))
		   .on("mouseleave", i => _pointerLeave())
		   // animation
		   .transition() // 애니메이션 동작을 위한 transition 추가
		   .delay((d, i) => i * 50) // 각 인덱스 당 0.2초 지연
		   .duration(750) // 이하 애니메이션을 0.75초 동안 수행
		   .attr("y", i => yScale(Y[i][x])) // y의 좌표를 위로 이동
		   .attr("height", i => yScale(0) - yScale(Y[i][x])) // 높이를 y좌표와 동일하게
	}

	svg.append("g")
		.attr("transform", `translate(0, ${height - padding})`)
		.call(xAxis);

	const tooltip = svg.append("g").style("pointer-events", "none").attr("class", "tooltip");

	function _pointerOver(e:MouseEvent, xIdx:string, zIdx:number) {
		const target = e.target as SVGElement;
		const tX = Number(target.getAttribute('x'));
		const tY = Number(target.getAttribute('y'));
		const tW = Number(target.getAttribute('width'));

		const textData = [`${X[Number(xIdx)]}`, `Series ${zIdx+1} : ${Y[zIdx][Number(xIdx)]}`]

		svg.selectAll("rect").attr("opacity", 0.2);
		svg.selectAll(`rect[fill='${zScale(Z[zIdx])}']`).attr("opacity", 1);

		tooltip.style("display", null);
		tooltip.attr("transform", `translate(${tX+tW/2}, ${tY})`);

		const path = tooltip.selectAll("path")
		                    .data([,])
		                    .join("path")
		                        .attr("fill", "white")
		                        .attr("stroke", "black");

		const text = tooltip.selectAll("text")
		                    .data([,])
		                    .join('text')
		                    .call(text => text.selectAll("tspan")
		                                      .data(textData)
		                                      .join('tspan')
		                                        .attr("x", (_, i) => i ? 14:0)
		                                        .attr("y", (_, i) => `${i * 1.25}em`)
		                                        .attr("font-weight", (_, i) => i ? null:"bold")
		                                        .attr("font-size", 12)
		                                        .text(d => d));

		const circle = tooltip.selectAll("circle")
		                      .data([,])
		                      .join('circle')
		                      .attr("cx", 0)
		                      .attr("cy", 0)
		                      .attr("r", 4)
		                      .attr("stroke", "#ccc")
		                      .attr("stroke-width", "1")
		                      .attr("fill", zScale(Z[zIdx]))

		const {x, y, width:w, height:h} = (text.node() as SVGTextElement).getBBox();
		text.attr("transform", `translate(${-w / 2},${15 - y})`);
		path.attr("d", `M${-w / 2 - 10},5H-5l5,-5l5,5H${w / 2 + 10}v${h + 20}h-${w + 20}z`);
		circle.attr("transform", `translate(${(-w+8) / 2},${26.5 - y})`)
	}

	function _pointerLeave() {
		tooltip.style("display", "none");
		svg.selectAll("rect").attr("opacity", 1);
	}
}





// function singleBar(config:Single) {
// 	const SVG = d3.select(config.id)
// 	              .attr("width", config.width)
// 	              .attr("height", config.height)
// 	              // .style("border", "1px solid #fff");
//
// 	const PADDING = 45;
//
// 	// make xAxis
// 	const xAxisScale = (function makeXAxis() {
// 		const xAxisScale = d3.scaleBand()
// 		                     .domain(config.xAxis)
// 		                     .range([PADDING, config.width - PADDING])
// 		                     .padding(0.2);
//
// 		const xAxis = d3.axisBottom(xAxisScale);
//
// 		SVG.append('g').call(xAxis)
// 		   .attr("class", 'Bar_xAxis')
// 		   .attr("transform", `translate(0, ${config.height - PADDING})`);
//
// 		return xAxisScale;
// 	})();
//
// 	// make yAxis
// 	const yAxisScale = (function makeYAxis() {
// 		const yAxisScale = d3.scaleLinear()
// 		                     .domain([0, Util.max(config.series)*1.1])
// 		                     .range([config.height - PADDING, PADDING]);
//
// 		const yAxis = d3.axisLeft(yAxisScale).tickFormat((v) => Util.k(v as number));
//
// 		SVG.append('g').call(yAxis)
// 		   .attr("class", 'Bar_yAxis')
// 		   .attr("transform", `translate(${PADDING}, 0)`);
//
// 		return yAxisScale;
// 	})();
//
// 	// match the data
// 	(function matchToData() {
// 		SVG.selectAll('rect')
// 		   .data(config.series)
// 		   .enter()
// 		   .append("rect")
// 			// .attr("class", "")
//            .attr("height", 0)
//            .attr("width", xAxisScale.bandwidth())
//            .attr("x", (d, i) => xAxisScale(config.xAxis[i]) as number)
//            .attr("y", config.height - PADDING)
//            .attr("fill", "orange");
// 	})();
//
// 	// animate bar
// 	(function animateChart() {
// 		SVG.selectAll('rect')
// 		   .transition()
// 		   .duration(750)
// 		   .attr("y", (d) => yAxisScale(d as number))
// 		   .attr("height", (d) => config.height - yAxisScale(d as number) - PADDING)
// 		   .delay((d, i) => i*50);
// 	})();
// }

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