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
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }
  
  g.tick text {
    font-size: 12px;
  }
  
  rect {
    transition: opacity ease .3s;
  }
  
  .tooltip {
    transition: all ease .2s;
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

		// xAxis가 요소의 수와 같지 않다면
		const _xAxis = (() => {
			if(Array.isArray(series[0])) {
				return (/*xAxis?.length > 0 && */xAxis?.length === series[0].length)
					? xAxis : series[0].map((d, i) => i.toString());
			}
			else {
				return (/*xAxis?.length > 0 && */xAxis?.length === series.length)
					? xAxis : series.map((d, i) => i.toString());
			}
		})()

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
		if(Util.isEmpty(config)) return;

		// console.log("Init")
		make(config!); // 화면이 변하지 않는 이상 무조건 1번만 실행되야함
	}, [config])




	return (
		<Group ref={group} width={width} height={height}>
			<svg id={tId} />
		</Group>
	)
}