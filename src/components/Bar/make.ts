import * as d3 from "d3";
import Util from "lib/Util";
import Constitute, { Series, Config } from "lib/Constitute";

export default function make(config:Config) {
	// config 값 풀기
	const { id, width, height, label, xList, zList } = Constitute.Untie(config);

	// 리랜더링 시 svg 클리어
	Constitute.Clear(id)

	generate(config.series, id, width, height, label, xList, zList);
}

function generate(
	data:Series[], id:string, width:number, height:number, title?:string, xList?:string[], zList?:string[]
) {
	// svg 선택 및 width와 height 설정
	const svg = d3.select(id)
	              .attr("width", width)
	              .attr("height", height)
	              // .style("border", "1px solid #fff");

	// 공통으로 사용할 padding과 margin 값 지정
	const padding = 30;
	const margin = 15;

	// 차트의 각 축에서 사용할 데이터 정의
	const X = d3.map(data, d => d.x);
	const Y = d3.map(data, d => d.y);
	const Z = d3.map(data, d => d.z);

	// X축, Y축, Z축의 범위를 정의
	const xDomain = new d3.InternSet(X);
	const yDomain = [0, d3.max(Y)! * 1.1];
	const zDomain = new d3.InternSet(Z);

	// 차트를 그릴때 사용할 요소를 정의
	const xRange = [padding+margin, width - padding - margin];
	const yRange = [height - padding, padding];
	const xPadding = 0.2;
	const zPadding = 0.1;

	// Series의 인덱스 정의
	const I = d3.range(X.length).filter(i => xDomain.has(X[i]) && zDomain.has(Z[i]));

	// 차트를 그릴때 사용할 좌표값 함수를 정의
	const xScale = d3.scaleBand(xDomain, xRange).paddingInner(xPadding);
	const xzScale = d3.scaleBand(zDomain, [0, xScale.bandwidth()]).padding(zPadding);
	const yScale = d3.scaleLinear(yDomain, yRange);
	const zScale = d3.schemeSpectral[Util.bandage(zDomain.size, 3, 11)];
	const xAxis = Constitute.xAxisFactor(xList, xScale);
	const yAxis = d3.axisLeft(yScale).ticks(height/60).tickFormat((v) => Util.k(v as number))

	// y축 생성
	Constitute.YAxis(svg, width, padding, yAxis, (_:any, i:number) => i===0 ? 1:0.1)

	// title이 있으면 title 추가
	if(!!title) Constitute.Title(svg, padding, title);

	// Bar 차트 생성
	const bar = svg.append("g")
	               .selectAll("rect")
	               .data(I)
	               .join("rect")
	               .attr("class", "bar")
	               .attr("x", i => xScale(X[i])! + xzScale(Z[i])!)
	               .attr("y", yScale(0))
	               .attr("width", xzScale.bandwidth())
	               .attr("height", 0)
	               .attr("fill", i => zScale[Z[i]])
	               .on("mouseover", (_, i) => pointerMoved(i))
	               .on("mouseleave", pointerLeave)

	// x축 생성
	Constitute.XAxis(svg, height, padding, xAxis);

	// Bar 차트에 애니메이션 추가
	for (let i = 0; i < I.length; i++) {
		const b = svg.select(`.bar:nth-of-type(${i+1})`);

		b.transition()
		   .delay(i*50)
		   .ease(d3.easeSin)
		   .duration(500)
		   .attr("y", yScale(Y[i]))
		   .attr("height", yScale(0) - yScale(Y[i]))
	}

	const tooltip = svg.append("g")
	                   .style("pointer-events", "none")
	                   .attr("class", "tooltip");



	/**
	 * 마우스 포인터가 그래프 위에 오버 중일 때
	 */
	function pointerMoved(i:any) {
		tooltip.style("display", null);
		tooltip.attr("transform", `translate(${xScale(X[i])! + xzScale(Z[i])! + (xzScale.bandwidth()/2)}, ${yScale(Y[i])})`);

		const textValue = Constitute.TooltipText((!xList) ? X[i]:xList[i], Y[i], (!zList) ? Z[i]+1:zList[i]);
		Constitute.Tooltip(tooltip, textValue, zScale[Z[i]])

		bar.style("opacity", ((z) => Z[i] === Z[z] ? null:0.2));
	}

	/**
	 * 마우스 포인터가 그래프에서 나갔을 때
	 */
	function pointerLeave() {
		tooltip.style("display", "none");
		bar.style("opacity", 1);
	}
}