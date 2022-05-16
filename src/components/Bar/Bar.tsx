import React from "react";
import styled from "styled-components";
import Random from "lib/Random";
import Util from "lib/Util";
import make from "./make";
import useInit from "hooks/useInit";

export interface Props {
	id: string;
	series: number[]|number[][];
	xAxis?: string[];
	width?: string;
	height?: string;
	label?: string;
}

const Group = styled("div")<{ width:string, height:string }>`
  width: ${props => props.width};
  height: ${props => props.height};
  min-width: 300px;
  min-height: 300px;
  max-height: 750px;

  svg {
    box-sizing: border-box;
  }
`;

export default function Bar({
	id, series, xAxis=[], width="100%", height="100%", label="null"
}:Props) {
	const group = React.useRef<HTMLDivElement>(null);
	const { divWidth, divHeight, seed } = useInit(group);

	/**
	 * 시드값이 지정된 SVG의 id 값
	 */
	const tId = React.useMemo(() => (
		`Bar_${!id?Random.string(6):id}_${seed}`
	), [id, seed]);

	/**
	 * 차트에서 사용할 설정값을 저장하는 Memo
	 */
	const config = React.useMemo(() => {
		if(!seed || !tId) return null;

		const _xAxis = (!Util.isEmpty(xAxis) && xAxis?.length === series.length)
						? xAxis : series.map((d:any, i:any) => i);

		return {
			id: "#"+tId,
			width: divWidth,
			height: divHeight,
			series: series,
			xAxis: _xAxis,
			label: label
		};
	}, [seed, tId, divWidth, divHeight, series, label]);

	/**
	 * config가 확정되면 차트를 생성하는 side-effect
	 */
	React.useEffect(() => {
		// console.log(config)
		if(Util.isEmpty(config)) return;
		// console.log("Initializing Graph")
		make(config!); // 화면이 변하지 않는 이상 무조건 1번만 실행되야함
	}, [config])




	return (
		<Group ref={group} width={width} height={height}>
			<svg id={tId} />
		</Group>
	)
}