import React from "react";
import Util from "lib/Util";
import useInit from "hooks/useInit";
import useConfig from "hooks/useConfig";
import Container from "components/common/Container";
import make from "./make";

export interface LineProps {
	id: string;
	series: number[]|number[][];
	xAxis?: string[];
	width?: string;
	height?: string;
	label?: string;
}

export default function Line({
	id, series, xAxis=[], width="100%", height="100%", label="null"
}:LineProps) {
	const group = React.useRef<HTMLDivElement>(null);
	const { divWidth, divHeight, seed } = useInit(group);
	const { tId, config } = useConfig({ id, seed, divWidth, divHeight, series, xAxis, label });

	/**
	 * config가 확정되면 차트를 생성하는 side-effect
	 */
	React.useEffect(() => {
		if(Util.isEmpty(config)) return;

		console.log("Init")
		make(config!); // 화면이 변하지 않는 이상 무조건 1번만 실행되야함
	}, [config])

	/* Render Area */
	return (
		<Container ref={group} width={width} height={height}>
			<svg id={tId} />
		</Container>
	)
}