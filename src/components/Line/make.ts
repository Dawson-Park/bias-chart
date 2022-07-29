import * as d3 from "d3";
import Util from "lib/Util";
import Constitute, { Series, Config } from "lib/Constitute";

export default function make(config:Config) {
	// config 값 풀기
	const { id, width, height, label, xList, zList } = Constitute.Untie3(config);

	// 리랜더링 시 svg 클리어
	Constitute.Clear(id)

	generate(config.series, id, width, height, label, xList, zList);
}

function generate(
	data:Series[], id:string, width:number, height:number, title?:string, xList?:string[], zList?:string[]
) {
	/* MAINSTREAM AREA ---------------------------------------------------------------------------------------------- */
	// svg 선택 및 width와 height 설정
	const svg = d3.select(id)
	              .attr("width", width)
	              .attr("height", height)
	              // .style("border", "1px solid #fff");

	// 공통으로 사용할 padding과 margin 값 지정
	const padding = 30;
	// const margin = 15;

	// 차트의 각 축에서 사용할 데이터 정의
	const X = d3.map(data, d => d.x);
	const Y = d3.map(data, d => d.y);
	const Z = d3.map(data, d => d.z);
	const O = d3.map(data, d => d);

	// X축, Y축, Z축의 범위를 정의
	const xDomain = new d3.InternSet(X);
	const yDomain = [0, d3.max(Y, d => d)! * 1.1];
	const zDomain = new d3.InternSet(Z);

	// 차트를 그릴때 사용할 요소를 정의
	const xRange = [padding, width - padding]
	const yRange = [height - padding, padding]

	// Series의 인덱스 정의
	const I = d3.range(X.length).filter(i => zDomain.has(Z[i]));

	// 차트를 그릴때 사용할 좌표값 함수를 정의
	const xScale = d3.scaleBand(xDomain, xRange); // x좌표 생성함수
	const yScale = d3.scaleLinear(yDomain, yRange); // y좌표 생성함수
	const zScale = d3.schemeSpectral[Util.bandage(zDomain.size, 3, 11)];
	const xAxis = Constitute.xAxisFactor(xList, xScale);
	const yAxis = d3.axisLeft(yScale).ticks(height/60).tickFormat((v) => Util.k(v as number)); // y축 설정

	// path 생성 함수
	const line = d3.line()
	               .x((d) => xScale(d[0])!)
	               .y((d) => yScale(d[1]))

	// x축 생성
	Constitute.XAxis(svg, height, padding, xAxis);

	// y축 생성
	Constitute.YAxis(svg, width, padding, yAxis, 0.1)

	// title이 있으면 title 추가
	if(!!title) Constitute.Title(svg, padding, title);

	// 첫번쨰 x좌표의 값을 읽어온다
	const firstTick = (svg.select(".xAxis > .tick")
	                      .node() as SVGGElement).transform.animVal[0].matrix.e;

	// path 생성
	const path = svg.append("g")
	                .attr("class", "line-group")
	                .attr("transform", `translate(${firstTick-padding}, 0)`) // 첫번째 x좌표의 위치만큼 path를 이동시킨다
	                .attr("fill", "none") // 채우기 없음
	                .attr("stroke-width", 1.5) // path의 굵기
	                .selectAll("path")
	                .data(d3.group(I, i => Z[i])) // Z값에 따라 그릅화
	                .join("path")
	                .attr("class", "line-path")
	                .attr("stroke", (d) => zScale[d[0]]) // path 별 색상 부여
	                .attr("d", ([_, i]) => { // path에 데이터 부여
						const temp = i.map(v => [data[v].x, data[v].y])
						return line(temp as [number, number][])
	                })

	// path에 애니메이션 추가
	for (let i = 0; i < d3.group(I, i => Z[i]).size; i++) {
		const p = svg.select(`.line-path:nth-of-type(${i+1})`);
		const length = (p.node() as SVGPathElement).getTotalLength();

		p.attr("stroke-dashoffset", length) // path를 안보이게
		    .attr("stroke-dasharray", length)// path를 안보이게
		    .transition() // 애니메이션 부여
		    .delay(i*100)
		    .ease(d3.easeSin)
		    .duration(500) // 750 ms 간 애니메이션 수행
		    .attr("stroke-dashoffset", 0) // path를 보이게
	}

	// path의 꼭지점에 점을 생성하는 구문
	const dot = svg.append("g")
	               .attr("class", "line-dots")
	               .attr("transform", `translate(${firstTick-padding}, 0)`)
	               .attr("width", width)
	               .attr("height", height)
	               .selectAll("circle")
	               .data(O)
	               .join("circle")
	               .attr("r", 4)
	               .attr("stroke", "#ccc")
	               .attr("stroke-width", 1)
	               .attr("fill", d => zScale[d.z])
	               .attr("cx", d => xScale(d.x)!)
	               .attr("cy", d => yScale(d.y))
	               .attr("class", "dot")

	for (let i = 0; i < O.length; i++) {
		const d = svg.select(`.dot:nth-of-type(${i+1})`);

		d.attr("opacity", 0)
		 .transition()
		 .delay(750)
		 .ease(d3.easeSin)
		 .duration(250)
		 .attr("opacity", 1)
	}

	// svg에 이벤트 추가
	svg.on("pointerenter pointermove", pointerMoved)
	   .on("pointerleave", pointerLeave)

	// tooltip으로 사용할 g 태그 생성
	const tooltip = svg.append("g")
	                   .style("pointer-events", "none")
	                   .attr("class", "tooltip");

	/* ---------------------------------------------------------------------------------------------- MAINSTREAM AREA */





	/* FUNCTION DEFINE AREA ----------------------------------------------------------------------------------------- */
	/**
	 * 마우스 포인터가 svg 위에서 움직일 때
	 */
	function pointerMoved(event:any) {
		const [xm, ym] = d3.pointer(event);
		const i = d3.least(I, i => Math.hypot(xScale(X[i])! - xm + (firstTick-padding), yScale(Y[i]) - ym))!;

		tooltip.attr("display", null)
		       .attr("transform", `translate(${xScale(X[i])! + (firstTick-padding)}, ${yScale(Y[i]) + 5})`)

		path.style("opacity", ([z]) => Z[i] === z ? null : 0.2).filter(([z]) => Z[i]===z).raise();
		dot.style("opacity", (z => Z[i] === z.z ? null : 0.2)).raise();

		const textValue = Constitute.TooltipText((!xList) ? X[i]:xList[i], Y[i], (!zList) ? Z[i]+1 : zList[i]);
		Constitute.Tooltip(tooltip, textValue, zScale[Z[i]])
	}

	/**
	 * 마우스 포인터가 svg를 떠날 때
	 */
	function pointerLeave() {
		path.style("opacity", 1);
		dot.style("opacity", 1);
		tooltip.attr("display", "none");
	}
	/* ----------------------------------------------------------------------------------------- FUNCTION DEFINE AREA */
}