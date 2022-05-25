import * as d3 from "d3";

export default class Constitute {
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
}