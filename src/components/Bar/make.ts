import * as d3 from "d3";
import Util from "lib/Util";

// const COLOR = [
// 	"#d53e4f", "#f46d43", "#fdae61",
// 	"#fee08b", "#ffffbf", "#e6f598",
// 	"#abdda4", "#66c2a5", "#3288bd",
// 	"#95B5FF",
// ]

interface Config {
	id: string;
	width: number;
	height: number;
	series: number[]|number[][];
	xAxis: string[];
	label: string;
}

interface OptionsMultipleBar {
	id:string;
	width:number;
	height:number;
	xLabel?:string[];
	yLabel?:string;
}

export default function make(config:Config) {
	// config 값 풀기
	const id = config.id;
	const width = config.width;
	const height = config.height;
	const label = (config.label === "null") ? undefined : config.label;
	const xLabel = (config.xAxis.length > 0) ? config.xAxis : undefined;

	// 리랜더링 시 svg 클리어
	(function clear() {
		d3.selectAll(`${config.id} *`).remove();
	})();

	// 1차원 배열을 받은 경우 2차원배열로 변환하여 generate 함수 실행
	if(Array.isArray(config.series[0])) {
		generate(config.series as number[][], { id, width, height, xLabel, yLabel:label })
	}
	else {
		generate([config.series as number[]], { id, width, height, xLabel, yLabel:label })
	}
}



function generate(data:number[][], { id, width, height, xLabel, yLabel }:OptionsMultipleBar) {
	// svg 선택 및 width와 height 설정
	const svg = d3.select(id)
	              .attr("width", width)
	              .attr("height", height)
	              // .style("border", "1px solid #fff");

	// 공통으로 사용할 padding과 margin 값 지정
	const padding = 30;
	const margin = 15;

	// 차트의 각 축에서 사용할 데이터 정의
	const X = (() => {
		if(!!xLabel) return d3.map(xLabel, (d) => d);
		else return d3.map(data[0], (d, i) => i.toString());
	})(); // X : X 축에서 사용할 값. 그룹단위로 묶을때 사용한다.
	const Y = d3.map(data, d => d); // Y : Y축에서 사용할 값. 각 차트의 값을 나타날때 사용한다.
	const FY = Util.flat(data); // Flatted Y : 최대값을 찾기 위한 배열.
	const Z = d3.map(data, (d, i) => i); // X축 그룹화를 위해 사용할 값. 배열이 2차원 이상일 때 입력된 값을 인덱스에 따라 나열한다.

	// X축, Y축, Z축의 범위를 정의
	const xDomain = new d3.InternSet(X); // X축의 범위. 사용자 정의된 X축 도메인이 있다면 적용하고, 아니면 인덱스를 표시
	const yDomain = [0, d3.max(FY)! * 1.1]; // Y축의 범위. 최소값을 0으로 잡고 FY의 max값의 1.1배한 것을 최대값으로 한다.
	const zDomain = new d3.InternSet(Z); // Z축의 범위. 2차원 배열인 경우, 요소의 길이에 비례한다.

	// 컬러의 범위를 정의 : 3보다 작은 경우 3개 컬러, 11보다 큰 경우 11개 컬러가 반복되어 출력된다.
	const colorDomain = (() => {
		if(Z.length > 11) return 11;
		if(Z.length < 3) return 3;
		return Z.length;
	})();

	// 차트를 그릴때 사용할 요소를 정의
	const colors = d3.schemeSpectral[colorDomain]; // 컬러 배열을 가져온다
	const xPadding = 0.2; // x축과 x축 사이의 거리를 벌린다
	const xRange = [padding+margin, width - padding-margin]; // x축이 표시될 범위
	const yRange = [height - padding, padding]; // y축이 표시될 범위
	const zPadding = 0.1; // x축 그룹내의 그래프간 거리를 벌린다
	const yFormat = undefined; // y축을 표시할 일정한 포맷.

	// 차트를 그릴때 사용할 실질적인 좌표값 함수를 정의
	const xScale = d3.scaleBand(xDomain, xRange).paddingInner(xPadding); // x축이 표시될 실질적인 좌표 함수
	const xzScale = d3.scaleBand(zDomain, [0, xScale.bandwidth()]).padding(zPadding); // x축에 맞춰 차트 그룹을 표시할 실질적인 좌표 함수
	const yScale = d3.scaleLinear(yDomain, yRange); // y축이 표시될 실질적인 좌표 함수
	const zScale = d3.scaleOrdinal(zDomain, colors); // 배열의 인덱스에 따라 색상을 return 해주는 함수
	const xAxis = d3.axisBottom(xScale).tickSizeOuter(0); // 물리적 생성된 x축
	const yAxis = d3.axisLeft(yScale).ticks(height/60, yFormat); // 물리적 생성된 y축

	// yLabel을 표시하는 경우에 따라 차트를 표시하는 방법이 달라진다.
	if(!!yLabel) { // yLabel이 있는 경우
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
	else { // yLabel이 없는 경우
		svg.append("g")
		   .attr("transform", `translate(${padding}, 0)`)
		   .call(yAxis)
		   .call(g => g.select(".domain").remove())
		   .call(g => g.selectAll(".tick line").clone()
		               .attr("x2", width - padding - padding)
		               .attr("stroke-opacity", (d, i) => i===0 ? 1:0.1))
	}

	// 1차원 배열이 가진 요소의 수 만큼 반복된다.
	for (const x in X) {
		svg.append("g") // 그래프 추가
		   .selectAll("rect") // 모든 사각형을 선택
		   .data(Z) // 연동할 데이터 : Z축
		   // 그래프 생성
		   .join("rect")
		   .attr("x", i => xScale(X[x])! + xzScale(Z[i])!)
		   .attr("y", yScale(0))
		   .attr("width", xzScale.bandwidth())
		   .attr("height", 0)
		   .attr('fill', i => zScale(Z[i]))
		   // 그래프에 이벤트 추가
		   .on("mouseover", (e, z) => _pointerOver(e, x, z))
		   .on("mouseleave", i => _pointerLeave())
		   // 그래프에 애니메이션 추가
		   .transition() // 애니메이션 동작을 위한 transition 추가
		   .delay((d, i) => i * 50) // 각 인덱스 당 0.2초 지연
		   .duration(750) // 이하 애니메이션을 0.75초 동안 수행
		   .attr("y", i => yScale(Y[i][x])) // y의 좌표를 위로 이동
		   .attr("height", i => yScale(0) - yScale(Y[i][x])) // 높이를 y좌표와 동일하게
	}

	// x축 생성
	svg.append("g")
		.attr("transform", `translate(0, ${height - padding})`)
		.call(xAxis);

	// 툴팁 생성
	const tooltip = svg.append("g").style("pointer-events", "none").attr("class", "tooltip");

	/**
	 * 마우스 포인터가 그래프 위에 오버중일 때
	 */
	function _pointerOver(e:MouseEvent, xIdx:string, zIdx:number) {
		// 그래프의 실제 값을 읽어와 정의한다
		const target = e.target as SVGElement;
		const tX = Number(target.getAttribute('x'));
		const tY = Number(target.getAttribute('y'));
		const tW = Number(target.getAttribute('width'));

		// 표시할 텍스트를 정의
		const textData = [`${X[Number(xIdx)]}`, `Series ${zIdx+1} : ${Y[zIdx][Number(xIdx)]}`]

		// 모든 차트의 투명도를 올리고, 선택된 차트와 동일한 색상값을 갖는 차트의 투명도는 1로 만든다
		svg.selectAll("rect").attr("opacity", 0.2);
		svg.selectAll(`rect[fill='${zScale(Z[zIdx])}']`).attr("opacity", 1);

		// 툴팁이 표시되고 차트의 크기 만큼 위치를 조정한다
		tooltip.style("display", null);
		tooltip.attr("transform", `translate(${tX+tW/2}, ${tY})`);

		// 툴팁을 그린다
		const path = tooltip.selectAll("path")
		                    .data([,])
		                    .join("path")
		                        .attr("fill", "white")
		                        .attr("stroke", "black");

		// 툴팁에 텍스트를 추가한다
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

		// 툴팁에 동그라미를 추가하고, z인덱스의 색상값을 갖는다
		const circle = tooltip.selectAll("circle")
		                      .data([,])
		                      .join('circle')
		                      .attr("cx", 0)
		                      .attr("cy", 0)
		                      .attr("r", 4)
		                      .attr("stroke", "#ccc")
		                      .attr("stroke-width", "1")
		                      .attr("fill", zScale(Z[zIdx]))

		// 툴팁의 실질적인 좌표와 높이, 너비를 구하고, 그에 맞춰 툴팁의 위치, 크기를 정의한다
		const { y, width:w, height:h } = (text.node() as SVGTextElement).getBBox();
		text.attr("transform", `translate(${-w / 2},${15 - y})`);
		path.attr("d", `M${-w / 2 - 10},5H-5l5,-5l5,5H${w / 2 + 10}v${h + 20}h-${w + 20}z`);
		circle.attr("transform", `translate(${(-w+8) / 2},${26.5 - y})`)
	}

	/**
	 * 마우스 포인터가 그래프에서 나갔을 때
	 */
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