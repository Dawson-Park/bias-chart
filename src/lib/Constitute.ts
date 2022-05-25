import * as d3 from "d3";

export interface Series {
	x: number;
	y: number;
	z: number;
}
export interface Config {
	id: string;
	width: number;
	height: number;
	series: Series[];
	label?: string;
	xDomain?: string[];
	zDomain?: string[];
}

export default class Constitute {
	/**
	 * x축 생성함수를 return 하는 메소드
	 */
	public static xAxisFactor(xList: string[]|undefined, xScale: d3.ScaleBand<number>) {
		if(!xList) {
			return d3.axisBottom(xScale)
			         .tickSizeOuter(0)
			         .tickFormat(null);
		}
		else {
			return d3.axisBottom(xScale)
			         .tickSizeOuter(0)
			         .tickFormat((_, i) => xList[i]);
		}
	}

	/**
	 * X축을 생성하는 메소드
	 */
	public static XAxis(svg: d3.Selection<d3.BaseType, unknown, HTMLElement, any>, height:number, padding: number, xAxis: d3.Axis<number>) {
		svg.append("g")
		   .attr("transform", `translate(0, ${height - padding})`)
		   .attr("z-index", 100)
		   .attr("class", "xAxis")
		   .call(xAxis);
	}

	/**
	 * Y축을 생성하는 메소드
	 */
	public static YAxis(svg: d3.Selection<d3.BaseType, unknown, HTMLElement, any>, width:number, padding:number, yAxis: d3.Axis<d3.NumberValue>, strokeOpc:any) {
		svg.append("g")
		   .attr("transform", `translate(${padding+5}, 0)`)
		   .call(yAxis)
		   .call(g => g.select(".domain").remove())
		   .call(g => g.selectAll(".tick line").clone()
		               .attr("x2", width - padding - padding)
		               .attr("stroke-opacity", strokeOpc))
	}

	/**
	 * SVG의 Title를 생성하는 메소드
	 */
	public static Title(svg: d3.Selection<d3.BaseType, unknown, HTMLElement, any>, padding:number, title:string) {
		svg.append("g")
		   .call(g => g.append("text")
		               .attr("x", 0)
		               .attr("y", padding)
		               .attr("fill", "currentColor")
		               .attr("class", "ylabel")
		               .attr("font-size", 10)
		               .attr("transform", `translate(0, 0)`)
		               .text(title));
	}

	/**
	 * Tooltip에서 사용할 텍스트를 생성하는 메소드
	 */
	public static TooltipText(x:string|number, y:string|number, z:string|number) {
		if(typeof z === "number") {
			return [`${x}`, `Series ${z} : ${y}`]
		}
		else {
			return [`${x}`, `${z} : ${y}`]
		}
	}

	/**
	 * Tooltip을 구성하는 메소드
	 */
	public static Tooltip(tooltip:d3.Selection<SVGGElement, unknown, HTMLElement, any>, textValue:string[], color:string) {
		// 툴팁을 그린다
		const _path = tooltip.selectAll("path")
		                     .data([undefined])
		                     .join("path")
		                     .attr("fill", "white")
		                     .attr("stroke", "black")

		// 툴팁에 텍스트를 추가한다
		const _text = tooltip.selectAll("text")
		                    .data([undefined])
		                    .join('text')
		                    .call(text => text.selectAll("tspan")
		                                      .data(textValue)
		                                      .join('tspan')
		                                      .attr("x", (_, i) => i ? 14:0)
		                                      .attr("y", (_, i) => `${i * 1.25}em`)
		                                      .attr("font-weight", (_, i) => i ? null:"bold")
		                                      .attr("font-size", 12)
		                                      .text(d => d));

		// 툴팁에 동그라미를 추가하고, z인덱스의 색상값을 갖는다
		const _circle = tooltip.selectAll("circle")
		                      .data([undefined])
		                      .join('circle')
		                      .attr("cx", 0)
		                      .attr("cy", 0)
		                      .attr("r", 4)
		                      .attr("stroke", "#ccc")
		                      .attr("stroke-width", "1")
		                      .attr("fill", color)

		const {y, width:w, height:h} = (_text.node() as SVGTextElement).getBBox();
		_text.attr("transform", `translate(${-w / 2},${15 - y})`);
		_path.attr("d", `M${-w / 2 - 10},5H-5l5,-5l5,5H${w / 2 + 10}v${h + 20}h-${w + 20}z`);
		_circle.attr("transform", `translate(${(-w+8) / 2},${26.5 - y})`)
	}

	/**
	 * Configuration을 일반 변수로 return하는 메소드
	 */
	public static Untie(config:Config) {
		const id = "#"+config.id;
		const width = config.width;
		const height = config.height;
		const label = config.label;
		const xList = config.xDomain;
		const zList = config.zDomain;

		return { id, width, height, label, xList, zList };
	}

	/**
	 * 전달받은 id 값 이하의 모든 SVG 요소를 삭제하는 메소드
	 */
	public static Clear(id:string) {
		d3.selectAll(`${id} *`).remove();
	}
}