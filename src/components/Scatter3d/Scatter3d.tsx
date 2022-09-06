import React from "react";
import make from "./make";
import Container from "../common/Container";
import useScatter3dConfig from "hooks/useScatter3dConfig";
import { Domain } from "lib/Constitute";

export interface Scatter3dProps {
	data: number[][];
	id?: string;
	domain?: Domain;
	size?: string;
	label?: string;
}

export default function Scatter3d({
	id, data, domain=undefined, size="100%", label=undefined
}:Scatter3dProps) {
	const group = React.useRef<HTMLDivElement>(null);
	const { config, viewBox } = useScatter3dConfig(data, group, "Scatter3d", id, label, domain);

	/**
	 * config가 확정되면 차트를 생성하는 side-effect
	 */
	React.useEffect(() => {
		if(config === null) return;

		make(config);
	}, [config]);

	return (
		<Container ref={group} height={size} width={size}>
			<svg width="960" height="960" viewBox={viewBox} id={config?.id||"scatter3d"} />
		</Container>
	)
}

