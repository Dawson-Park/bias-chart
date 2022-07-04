import React from "react";
import make from "./make";
import Container from "../common/Container";
import usePieConfig from "hooks/usePieConfig";

export interface PieProps {
	data: number[];
	id?: string;
	xDomain?: string[];
	width?: string;
	height?: string;
	label?: string;
}

export default function Pie({
	id, data, xDomain, width="100%", height="100%", label=undefined
}:PieProps) {
	const group = React.useRef<HTMLDivElement>(null);
	const config = usePieConfig(data, group, "Pie", id, label, xDomain);

	/**
	 * config가 확정되면 차트를 생성하는 side-effect
	 */
	React.useEffect(() => {
		if(config === null) return;

		// console.log("Pie Init");
		make(config);
	}, [config]);

	return (
		<Container ref={group} height={height} width={width}>
			<svg id={config?.id||"pie"} />
		</Container>
	)
}

