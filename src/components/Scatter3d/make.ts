import * as d3 from 'd3';
// @ts-ignore
import { _3d } from 'd3-3d';
import Constitute, { Domain, Series } from "lib/Constitute";

type ScatterObject = any;

type Config = {
	id: string,
	size: number,
	domain?: Domain,
	series: Series[],
	label?: string
}

/**
 * 차트 생성을 위한 export 함수
 */
export default function make(config:Config) {
	// config 값 풀기
	const { id, size, domain } = config;

	// 리랜더링 시 svg 클리어
	Constitute.Clear(id)

	generate(config.series, "#"+id, size, domain);
}

/**
 * 내부에서 함수를 생성하는 메소드
 */
function generate(
	data:Series[], id:string, size:number, domain?:Domain, /*title?:string*/
) {
	const setupSize = 600;
	const factor = size / setupSize;
	const originSize = (setupSize/2) * factor;

	let origin = [originSize+10, originSize+10];
	const scale = 20 * factor;

	const DRange = {
		x: [0, Math.ceil(d3.max(data, d => d.x) as number * 1.2)],
		y: [0, Math.ceil(d3.max(data, d => d.y) as number * 1.2)],
		z: [0, Math.ceil(d3.max(data, d => d.z) as number * 1.2)]
	};

	const YRange = (() => {
		const f = (DRange.y[0] + DRange.y[1]) / 10;
		let sum = 0;
		const arr = [];

		if(DRange.y[1] > 99) {
			for (let i = 0; i < 11; i++) {
				arr.push(sum.toFixed(0));
				sum = (sum + f);
			}
		}
		else {
			for (let i = 0; i < 11; i++) {
				arr.push(sum.toFixed(1));
				sum = (sum + f);
			}
		}

		return arr;
	})();

	const __YLine:ScatterObject[] = [];
	const __XGrid:ScatterObject[] = [];
	const __Datum:ScatterObject[] = [];

	const key = (d:ScatterObject) => d.id;
	let startAngle = Math.PI/4;

	const svg    = d3.select('svg');
	svg.selectAll("g").remove();

	svg.call(
		// @ts-ignore
		d3.drag()
		  .on('drag', dragged)
		  .on('start', dragStart)
		  .on('end', dragEnd)
	)
	   .append('g');

	const color  = d3.scaleOrdinal(["red", "green", "blue", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);
	let mx:number; let my:number; let mouseX:number; let mouseY:number;

	const grid3d = _3d().shape('GRID', 20)
	                    .origin(origin)
	                    .rotateY( startAngle)
	                    .rotateX(-startAngle)
	                    .scale(scale);

	const point3d = _3d().x((d:any) => d.x)
	                     .y((d:any) => d.y)
	                     .z((d:any) => d.z)
	                     .origin(origin)
	                     .rotateY( startAngle)
	                     .rotateX(-startAngle)
	                     .scale(scale);

	const yScale3d = _3d().shape('LINE_STRIP')
	                      .origin(origin)
	                      .rotateY( startAngle)
	                      .rotateX(-startAngle)
	                      .scale(scale);

	init();

	// tooltip으로 사용할 g 태그 생성
	const tooltip = svg.append("g")
	                   .style("pointer-events", "none")
	                   .attr("class", "tooltip");

	function mouseOverEvent(e:MouseEvent, d:any) {
		const x = d.projected.x;
		const y = d.projected.y;
		const datum = d.datum;

		tooltip.attr("display", null)
		       .attr("transform", `translate(${x}, ${y})`)

		const textValue = Constitute.TooltipText3D(datum, domain)
		Constitute.Tooltip3D(tooltip, textValue)

		// svg.select()
	}

	function mouseLeaveEvent() {
		tooltip.attr("display", "none");
	}

	function processData(data:ScatterObject, tt:number){
		/* ----------- GRID ----------- */
		const xGrid = svg.selectAll('path.grid').data(data[0], key);
		xGrid.enter()
		     .append('path')
		     .attr('class', '_3d grid') // @ts-ignore
		     .merge(xGrid)
		     .attr('stroke', 'black')
		     .attr('stroke-width', 0.3)
		     .attr('fill', (d:ScatterObject) => (d.ccw ? 'lightgrey' : '#717171'))
		     .attr('fill-opacity', 0.9)
		     .attr('d', grid3d.draw);
		xGrid.exit().remove();

		/* ----------- POINTS ----------- */
		const circleSize = 4 * factor;

		const points = svg.selectAll('circle').data(data[1], key);
		// @ts-ignore
		points.enter()
		      .append('circle')
		      .on('mouseenter', mouseOverEvent)
		      .on('mouseleave', mouseLeaveEvent)
		      .attr('class', '_3d')
		      .attr('opacity', 0)
		      .attr('cx', posPointX)
		      .attr('cy', posPointY) // @ts-ignore
		      .merge(points)
		      .transition()
		      .duration(tt)
		      .attr('r', circleSize) // @ts-ignore
		      .attr('stroke', (d:ScatterObject) => d3.color(color(d.id)).darker(3))
		      .attr('fill', (d:ScatterObject) => color(d.id))
		      .attr('opacity', 1)
		      .attr('cx', posPointX)
		      .attr('cy', posPointY);
		points.exit().remove();

		// svg.selectAll('circle').on('mouseenter', mouseOverEvent)

		/* ----------- y-Scale ----------- */
		const yScale = svg.selectAll('path.yScale').data(data[2]);
		yScale.enter()
		      .append('path')
		      .attr('class', '_3d yScale') // @ts-ignore
		      .merge(yScale)
		      .attr('stroke', 'currentColor')
		      .attr('stroke-width', .5)
		      .attr('d', yScale3d.draw);
		yScale.exit().remove();

		/* ----------- y-Scale Text ----------- */
		const yText = svg.selectAll('text.yText').data(data[2][0]);
		yText.enter()
		     .append('text')
		     .attr('class', '_3d yText')
		     .attr('dx', '.3em')
		     .attr('fill', 'currentColor') // @ts-ignore
		     .merge(yText)
		     .each((d:any) => { d.centroid = {x: d.rotated.x, y: d.rotated.y, z: d.rotated.z}; })
		     .attr('x', (d:ScatterObject) => d.projected.x)
		     .attr('y', (d:ScatterObject) => d.projected.y)
		     .text((d, i) => (i-1 < 0 ? '' : `-${YRange[i-1]}`));
		yText.exit().remove();

		svg.selectAll('._3d').sort(_3d().sort);
	}

	function posPointX(d:ScatterObject){
		return d.projected.x;
	}

	function posPointY(d:ScatterObject){
		return d.projected.y;
	}

	/**
	 * x의 범위는 -10 ~ 9까지
	 * y의 범위는 1 ~ -10까지
	 * z의 범위는 -10 ~ 9까지
	 * 이 범위를 parse 해 줄 함수가 있어야함
	 */
	function init(){
		const j = 10;
		let cnt = 0;

		for(let z = -j; z < j; z++){
			for(let x = -j; x < j; x++){
				__XGrid.push([x, 1, z]);
			}
		}

		for (const datum of data) {
			__Datum.push(parsePosition(datum, cnt++))
		}

		for (const el of d3.range(-1, 11, 1)) {
			__YLine.push([-j, -el, -j])
		}

		const output = [
			grid3d(__XGrid),
			point3d(__Datum),
			yScale3d([__YLine])
		];
		processData(output, 100);
	}

	function dragStart(e:MouseEvent){
		mx = e.x;
		my = e.y;
	}

	function dragged(e:MouseEvent){
		mouseX = mouseX || 0;
		mouseY = mouseY || 0;
		let beta = (e.x - mx + mouseX) * Math.PI / 230;
		let alpha = (e.y - my + mouseY) * Math.PI / 230  * (-1);
		const data = [
			grid3d.rotateY(beta + startAngle).rotateX(alpha - startAngle)(__XGrid),
			point3d.rotateY(beta + startAngle).rotateX(alpha - startAngle)(__Datum),
			yScale3d.rotateY(beta + startAngle).rotateX(alpha - startAngle)([__YLine]),
		];
		processData(data, 0);
	}

	function dragEnd(e:MouseEvent){
		mouseX = e.x - mx + mouseX;
		mouseY = e.y - my + mouseY;
	}

	function parsePosition(datum:Series, cnt=0) {
		const targetRange = {
			x: [-9, 8],
			y: [0, -10],
			z: [-9, 8]
		}

		const x = convertRange(datum.x, DRange.x, targetRange.x);
		const y = convertRange(datum.y, DRange.y, targetRange.y);
		const z = convertRange(datum.z, DRange.z, targetRange.z);

		return { x, y, z, id: `point_${cnt}`, datum };

		function convertRange(value:number, inputRange:number[], targetRange:number[]) {
			return ( value - inputRange[ 0 ] ) * ( targetRange[ 1 ] - targetRange[ 0 ] ) / ( inputRange[ 1 ] - inputRange[ 0 ] ) + targetRange[ 0 ];
		}
	}
}