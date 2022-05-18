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

export default function make(config:Config) {
	return "";
}