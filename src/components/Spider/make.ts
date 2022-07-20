import * as d3 from "d3";
import Constitute, { Series, Config } from "lib/Constitute";
import Util from "../../lib/Util";

export default function make(config:Config) {
	// config 값 풀기
	const { id, width, height, label, xList, zList } = Constitute.Untie3(config);

	Constitute.Clear(id);

	generate(config.series, id, width, height, label, xList, zList);
}

function generate(data:Series[], id:string, width:number, height:number, title?:string, xList?:string[], zList?:string[]) {
	// svg 선택 및 width와 height 설정
	const svg = d3.select(id)
	              .attr("width", width)
	              .attr("height", height)
	              .style("border", "1px solid #fff");

	// 공통으로 사용할 값 지정
	const r = width/2;
	// const padding = 40

	// 차트의 각 축에서 사용할 데이터 정의
	const X = d3.map(data, d => d.x);
	const Y = d3.map(data, d => d.y);
	const Z = d3.map(data, d => d.z);

	// 각 축에서 사용할 도메인 정의
	const xDomain = new d3.InternSet(X);
	const zDomain = new d3.InternSet(Z);
	const xGroup = (() => {
		const names = (xList === undefined) ? d3.map(X, d => String(d)) : xList;
		return new d3.InternSet(names);
	})();

	// Series의 인덱스 정의
	const I = d3.range(X.length).filter(i => zDomain.has(Z[i]));

	// 축에서 사용할 값 지정
	const maxValue = d3.max(Y)! * 1.25;
	const ticks = splitDomain(0, maxValue, 3);

	// X축, Y축 정의
	const rangeMax = (r*0.925) - 12;
	const radialScale = d3.scaleLinear()
	                      .domain([0, maxValue])
	                      .range([0, rangeMax]); // 실제 좌표에 맵핑

	initXAxis(); // X축 원을 그리는 구문
	initYAxis(); // Y축을 그리는 구문

	// 컬러 배열을 가져오는 구문
	const colors = d3.schemeSpectral[Util.bandage(zDomain.size, 3, 11)];

	// 실제 좌표가 맵핑된 data
	const F = d3.map(data, d => {
		const angle = (Math.PI / 2) + (2 * Math.PI * d.x / xDomain.size);
		const c = angleToCoordinate(angle, d.y)
		return { x:c.x, y:c.y, z:d.z }
	})

	// zDomain에 따라 2차원 배열로 맵핑된 data
	const dataFace = (() => {
		const temp:any[] = [];
		zDomain.forEach(z => { temp.push(data.filter(v => v.z === Number(z))) })
		return temp;
	})();

	// zDomain으로 구분하여 각 값의 좌표를 가져와 실제 도형을 그리는 구문
	drawChart();

	// tooltip으로 사용할 g 태그 생성
	const tooltip = svg.append("g")
	                   .style("pointer-events", "none")
	                   .attr("class", "tooltip");

	// SVG 마우스 오버 이벤트를 추가하는 메소드
	svg.on("pointerenter pointermove", (event) => {
		const [xm, ym] = d3.pointer(event);
		const i = d3.least(I, i => Math.hypot(F[i].x - xm, F[i].y - ym))!;

		tooltip.attr("display", null)
		       .attr("transform", `translate(${F[i].x}, ${F[i].y+5})`)

		const textValue = Constitute.TooltipText((!xList) ? X[i]:xList[i], Y[i], (!zList) ? Z[i]+1 : zList[i]);
		Constitute.Tooltip(tooltip, textValue, colors[Z[i]])
	});
	svg.on("pointerleave", () => {
		tooltip.attr("display", "none");
	});





	/**
	 * 차트를 실제로 그리는 메소드
	 */
	function drawChart() {
		const values = [];

		for (let i = 0; i < zDomain.size; i++) {
			const d = dataFace[i];
			const z = dataFace[i].map((v:any) => ({ x:v.x, y:0 }))
			const color = colors[i];

			const coordinates = getPathCoordinates(d);
			const zeroPoints = getPathCoordinates(z);

			const points = coordinates.reduce((a, c) => a + `${c.x},${c.y} `, '');
			const zero = zeroPoints.reduce((a, c) => a + `${c.x},${c.y} `, '');

			const g = svg.append("g").attr("class", "spider-values");

			// 값을 가져와 실제로 도형을 그림
			g.append("polygon")
			 .attr("class", "spider-poly")
			 .attr("points", zero)
			 .attr("stroke-width", 3)
			 .attr("stroke", color)
			 .attr("stroke-opacity", 1)
			 .attr("fill", color)
			 .attr("fill-opacity", 0.3)
			 .transition()
			 .delay((i+1) * 100)
			 .ease(d3.easeSin)
			 .duration(500)
			 .attr("points", points)

			// 각 꼭지점에 점을 그림
			for (const c of coordinates) {
				g.append("circle")
				 .attr("cx", c.x)
				 .attr("cy", c.y)
				 .attr("fill", color)
				 .attr("stroke", color)
				 .attr("r", 4)
				 .attr("opacity", "0")
				 .transition()
				 .delay((zDomain.size * 100) + 600)
				 .ease(d3.easeSin)
				 .duration(300)
				 .attr("opacity", "1")
			}

			g.on("pointerenter pointermove", () => {
				svg.selectAll("g.spider-values").attr("opacity", "0.3");
				g.attr("opacity", "1")
			});
			g.on("pointerleave", () => {
				svg.selectAll("g.spider-values").attr("opacity", "1");
			});

			values.push(g);
		}

		for (const value of values) {
			const polygon = value.select('polygon');
		}
		// for (let i = 0; i < zDomain.size; i++) {
		// 	const polygon = values.select(`polygon`);
		// 	console.log(`polygon(${i+1})`, polygon);
		// 	// const length = (p.node() as SVGPolygonElement);
		// }
	}

	/**
	 * 각도와 값을 입력받아 해당 축의 실제 좌표를 return하는 메소드
	 */
	function angleToCoordinate(angle:number, value:number) {
		const x = Math.cos(angle) * radialScale(value);
		const y = Math.sin(angle) * radialScale(value);
		return { x: x+r, y: r-y };
	}

	/**
	 * value 값에 비례하게 원을 그리는 메소드
	 */
	function makeYAxis(d:string, i:number, a:any) {
		const angle = (Math.PI / 2) + (2 * Math.PI * i / a.length);
		return angleToCoordinate(angle, maxValue);
	}

	/**
	 * 축의 라벨을 생성하는 메소드
	 */
	function makeAxisLabel(d:string, i:number, a:any) {
		const labelPosFactor = 1.075;
		const angle = (Math.PI / 2) + (2 * Math.PI * i / a.length);
		return angleToCoordinate(angle, (maxValue * labelPosFactor));
	}

	/**
	 * 입력받은 값들을 실제 좌표와 연결해 하나의 path로 만드는 메소드
	 */
	function getPathCoordinates(data_point:any[]) {
		const coordinates:any[] = [];

		xDomain.forEach(ft_name => {
			const angle = (Math.PI / 2) + (2 * Math.PI * ft_name / xDomain.size);
			coordinates.push(angleToCoordinate(angle, data_point[ft_name].y));
		})

		return coordinates;
	}

	/**
	 * ticks 값을 나누기 위한 메소드
	 */
	function splitDomain(min:number, max:number, splitor:number) {
		const tick = (min + max) / splitor;
		const domain = [];

		for (let i = 0; i < splitor; i++) {
			const temp = tick * (i+1)
			domain.push(Math.ceil(temp));
		}
		return domain;
	}

	/**
	 * Y축을 실제로 그리는 메소드
	 */
	function initYAxis() {
		svg.append("g")
		   .attr("class", "spider-lAxis")
		   .selectAll("line")
		   .data(xGroup)
		   .join("line")
		   .attr("x1", r)
		   .attr("y1", r)
		   .attr("x2", (d, i, a) => makeYAxis(d, i, a).x)
		   .attr("y2", (d, i, a) => makeYAxis(d, i, a).y)
		   .attr("stroke", "gray");

		// Y축에 라벨을 추가하는 구문
		svg.select("g.spider-lAxis")
		   .selectAll("text")
		   .data(xGroup)
		   .join("text")
		   .attr("x", (d,i,a)=> makeAxisLabel(d, i, a).x - 3)
		   .attr("y", (d,i,a)=> makeAxisLabel(d, i, a).y + 5)
		   .attr("transform", d => `translate(-${d.length*2}, 0)`)
		   .attr("fill", "currentColor")
		   .attr("font-weight", "bold")
		   .attr("font-size", 14)
		   .text(d => d);
	}

	/**
	 * X축을 실제로 그리는 메소드
	 */
	function initXAxis() {
		svg.append("g")
		   .attr("class", "spider-cAxis")
		   .selectAll("circle")
		   .data(ticks)
		   .join("circle")
		   .attr("cx", r)
		   .attr("cy", r)
		   .attr("fill", "none")
		   .attr("stroke", "gray")
		   .attr("r", radialScale)

		// X축 원에 값을 표시하는 구문
		svg.select("g.spider-cAxis")
		   .selectAll("text")
		   .data(ticks)
		   .join("text")
		   .attr("x", (r+5))
		   .attr("y", d => ((r+15) - radialScale(d)))
		   .attr("fill", "currentColor")
		   .attr("font-size", 10)
		   .text(d => d.toString())
	}
}