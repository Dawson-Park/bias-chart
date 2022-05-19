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
		// singleBar(config as Single);
	}
}

function generate(data:number[][], { id, width, height, xLabel, yLabel }:OptionsMultipleBar) {
	console.log(id, width, height, xLabel, yLabel)
	const svg = d3.select(id)
	              .attr("width", width)
	              .attr("height", height)
	              .style("border", "1px solid #fff");

	const padding = 30;
	const margin = 15;
}