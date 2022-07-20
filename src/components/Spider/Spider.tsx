import React from "react";
import make from "./make";
import Container from "../common/Container";
import useConfig from "hooks/useConfig";

export interface SpiderProps {
	data: number[][];
	id?: string;
	xDomain?: string[];
	zDomain?: string[];
	width?: string;
	height?: string;
	label?: string;
}

export default function Spider({
	id, data, xDomain, zDomain, width="100%", height="100%", label=undefined
}:SpiderProps) {
	const group = React.useRef<HTMLDivElement>(null);
	const config = useConfig(data, group, "Spider", id, label, xDomain, zDomain);

	/**
	 * config가 확정되면 차트를 생성하는 side-effect
	 */
	React.useEffect(() => {
		if(config === null) return;

		make(config);
	}, [config]);

	return (
		<Container ref={group} height={height} width={width}>
			<svg id={config?.id||"polar"} />
		</Container>
	)
}

