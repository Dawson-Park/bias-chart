import React from "react";
import useConfig from "hooks/useConfig";
import make from "./make";
import Container from "../common/Container";

export interface LineProps {
	data: number[][];
	id?: string;
	xDomain?: string[];
	zDomain?: string[];
	width?: string;
	height?: string;
	label?: string;
}

export default function Line({
	id, data, xDomain, zDomain, width="100%", height="100%", label=undefined
}:LineProps) {
	const group = React.useRef<HTMLDivElement>(null);
	const config = useConfig(data, group, "Line", id, label, xDomain, zDomain); // 차트에서 사용할 설정값

	/**
	 * config가 확정되면 차트를 생성하는 side-effect
	 */
	React.useEffect(() => {
		if(config === null) return;

		// console.log("Line Init")
		make(config); // 화면이 변하지 않는 이상 무조건 1번만 실행되야함
	}, [config])

	/* Render Area */
	return (
		<Container ref={group} width={width} height={height}>
			<svg id={config?.id||"line"} />
		</Container>
	)
}