import * as d3 from "d3";
import Constitute  from "lib/Constitute";

interface Series {
	x: number;
	y: number;
}

interface Config {
	id: string;
	width: number;
	height: number;
	series: Series[];
	label?: string;
	xDomain?: string[];
}

export default function make(config:Config) {
	// config 값 풀기
	const { id, width, height, label, xList } = Constitute.Untie2(config);

	// 리랜더링 시 svg 클리어
	Constitute.Clear(id);

	generate(config.series, id, width, height, label, xList);
}

function generate(
	data:Series[], id:string, width:number, height:number, title?:string, xList?:string[]
) {
	/* MAINSTREAM AREA ---------------------------------------------------------------------------------------------- */
	const padding = 30;
	const rwidth = width - padding*2;
	const rheight = height - padding*2;

	// svg 선택 및 width와 height 설정
	const svg = d3.select(id)
	              .attr("width", width)
	              .attr("height", height)
	              .attr("viewBox", [0, -height/2, width, height])
	              .attr("style", "max-width:100%; height:auto; height:intrinsic")
	              // .style("border", "1px solid #fff");

	// Factors
	const innerRadius = /*Math.min(rwidth, rheight)/8*/0;
	const outerRadius = Math.min(rwidth, rheight)/2;
	const labelRadius = (innerRadius * 0.2 + outerRadius * 0.8);
	const stroke = /*(innerRadius > 0) ? "none" : */"white";
	const strokeWidth = 1;
	const strokeLinejoin = "round";
	const padAngle = /*(stroke === "none") ? 1/outerRadius : */0;

	// Compute Values
	const N = d3.map(data, d => d.x);
	const V = d3.map(data, d => d.y);
	const I = d3.range(N.length).filter(i => !isNaN(V[i]));

	// Unique the names
	const names = (() => {
		const names = (xList === undefined) ? d3.map(data, d => String(d.x)) : xList;
		return new d3.InternSet(names);
	})();

	// Chose a default color scheme based on cardinality.
	const colors = (() => {
		// return d3.schemeSpectral[Util.bandage(names.size, 3, 11)];
		return d3.quantize(t => d3.interpolateSpectral(t * 0.8 + 0.1), names.size);
	})();

	// Construct Scales.
	const color = d3.scaleOrdinal(names, colors);
	const scheme = (xList === undefined) ? d3.map(data, d => String(d.x)) : xList;

	const label = (() => {
		const formatValue = d3.format(",")
		return (i:number) => `${scheme[i]}\n${formatValue(V[i])}`;
	})();

	// Construct arcs
	const arcs = d3.pie().padAngle(padAngle).sort(null).value(i => V[Number(i)])(I);
	const arc = d3.arc().innerRadius(innerRadius).outerRadius(outerRadius);
	const arcLabel = d3.arc().innerRadius(labelRadius).outerRadius(labelRadius);
	const animatedArc = (d:any) => {
		let i = d3.interpolate(d.startAngle, d.endAngle);

		return (t:any) => {
			d.endAngle = i(t);
			return arc(d);
		}
	}

	// 파이차트를 생성하는 구문
	const pie = svg.append("g")
		   .attr("stroke", stroke)
		   .attr("stroke-width", strokeWidth)
		   .attr("stroke-linejoin", strokeLinejoin)
           .attr("class", "pie-container")
	   .selectAll("path")
	   .data(arcs)
	   .join("path")
	       .attr("fill", d => color(scheme[Number(d.data)]));

	// 파이 차트에 텍스트를 올리는 구문
	svg.select("g.pie-container")
		.selectAll("text")
		.data(arcs)
		.join("text")
			.attr("font-family", "sans-serif")
			.attr("font-size", 12)
			.attr("text-anchor", "middle") // @ts-ignore
			.attr("transform", d => `translate(${arcLabel.centroid(d)})`)
			.attr("stroke-width", 0)
		.selectAll("tspan")
		.data(d => {
		    const lines = `${label(Number(d.data))}`.split(/\n/);
		    return (d.endAngle - d.startAngle) > 0.25 ? lines : lines.slice(0, 1);
		})
		.join("tspan")
			.attr("x", 0)
			.attr("y", (_,i) => `${i * 1.1}em`)
			.attr("font-weight", (_, i) => i ? null:"bold")
		.text(d => d);

	// 원을 그릴때 애니메이션을 부여하는 구문
	svg.selectAll("path")
	   .transition()
	   .delay((_, i) => i*300)
	   .duration(400) // @ts-ignore
	   .attrTween("d", animatedArc);

	// 원이 다 그려진 후 텍스트를 떠오르게 하는 애니메이션 구문
	svg.selectAll("text")
	   .attr("opacity", 0)
	   .transition()
	   .delay((d, i, a) => a.length*300)
	   .duration(450)
	   .attr("opacity", 1);

	// 파이 차트에 마우스 오버/아웃 시 파이 조각이 떠오르는 애니메이션 추가
	pie.on('mouseover', onMouseOver)
	   .on('mouseout', onMouseLeave)

	if(!!title) {
		svg.append('g')
		   .attr("font-size", "10px")
		   .attr("fill", "white")
		   .attr('transform', `translate(0, -${(height/2)-10})`)
		   .append('text')
		   .text(title)
	}

	// Tooltip 생성
	const tooltip = svg.append("g")
	                   .style("pointer-events", "none")
	                   .attr("class", "tooltip");

	/* ---------------------------------------------------------------------------------------------- MAINSTREAM AREA */





	/* FUNCTION DEFINE AREA ----------------------------------------------------------------------------------------- */
	/**
	 * 마우스 오버시 파이 조각이 12px만큼 밖으로 이동하는 애니메이션을 추가하는 메소드
	 */
	function onMouseOver(event:any, d:any) {
		makeTooltip(d);

		const duration = 250;

		d3.select(event.currentTarget)
		  .transition()
		  .duration(duration)
		  .attr("transform", calcTranslate(d, 12));
		d3.select(event.currentTarget).select('path')
		  .transition()
		  .duration(duration)
		  .attr('stroke', 'rgba(100, 100, 100, 0.2)')
		  .attr('stroke-width', 4);


		/**
		 * move 만큼 위치를 이동시키는 메소드
		 */
		function calcTranslate(data:any, move=4) {
			const moveAngle = data.startAngle + ((data.endAngle - data.startAngle)/2);
			return `translate(${-move * Math.cos(moveAngle + Math.PI/2)}, ${-move * Math.sin(moveAngle + Math.PI/2)})`;
		}
	}


	/**
	 * 마우스 아웃시 파이 조각이 원래 자리로 돌아가는 애니메이션을 추가하는 메소드
	 */
	function onMouseLeave(event:any) {
		tooltip.style("display", "none");


		const duration = 250;

		d3.select(event.currentTarget)
		  .transition()
		  .duration(duration)
		  .attr("transform", 'translate(0, 0)');
		d3.select(event.currentTarget).select('path')
		  .transition()
		  .duration(duration)
		  .attr('stroke', stroke)
		  .attr('stroke-width', 1);
	}

	/**
	 * Tooltip을 설정하는 메소드
	 */
	function makeTooltip(d:any) {
		const [X, Y] = arcLabel.centroid(d);

		tooltip.style("display", null);
		tooltip.attr("transform", `translate(${X+(width/2)}, ${Y+16})`)

		const textValue = `${label(Number(d.data))}`.split(/\n/);

		Constitute.Tooltip(tooltip, textValue, color(scheme[Number(d.data)]))
	}
	/* ----------------------------------------------------------------------------------------- FUNCTION DEFINE AREA */
}





