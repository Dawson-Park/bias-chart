import React from "react";
import Util from "lib/Util";
import useInit from "hooks/useInit";
import useConfig from "hooks/useConfig";
import Container from "./Container";
import make from "./make";

export interface Props {
	id: string;
	series: number[]|number[][];
	xAxis?: string[];
	width?: string;
	height?: string;
	label?: string;
}

export default function Bar({
	id, series, xAxis=[], width="100%", height="100%", label="null"
}:Props) {
	const group = React.useRef<HTMLDivElement>(null);
	const { divWidth, divHeight, seed } = useInit(group);
	const { tId, config } = useConfig({ id, seed, divWidth, divHeight, series, xAxis, label });

	/**
	 * config가 확정되면 차트를 생성하는 side-effect
	 */
	React.useEffect(() => {
		if(Util.isEmpty(config)) return;

		// console.log("Init")
		make(config!); // 화면이 변하지 않는 이상 무조건 1번만 실행되야함
	}, [config])

	/* Render Area */
	return (
		<Container ref={group} width={width} height={height}>
			<svg id={tId} />
		</Container>
	)



	// /**
	//  * 시드값이 지정된 SVG의 id 값
	//  */
	// const tId = React.useMemo(() => (
	// 	`Bar_${!id?Random.string(6):id}_${seed}`
	// ), [id, seed]);
	//
	// /**
	//  * 차트에서 사용할 설정값을 저장하는 Memo
	//  */
	// const config = React.useMemo(() => {
	// 	if(!seed || !tId) return null;
	//
	// 	// xAxis가 요소의 수와 같지 않다면
	// 	const _xAxis = (() => {
	// 		if(Array.isArray(series[0])) {
	// 			return (/*xAxis?.length > 0 && */xAxis?.length === series[0].length)
	// 				? xAxis : series[0].map((d, i) => i.toString());
	// 		}
	// 		else {
	// 			return (/*xAxis?.length > 0 && */xAxis?.length === series.length)
	// 				? xAxis : series.map((d, i) => i.toString());
	// 		}
	// 	})()
	//
	// 	return {
	// 		id: "#"+tId,
	// 		width: divWidth,
	// 		height: divHeight,
	// 		series: series,
	// 		xAxis: _xAxis,
	// 		label: label
	// 	};
	// }, [seed, xAxis, tId, divWidth, divHeight, series, label]);
}