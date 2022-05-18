import React from "react";
import Random from "lib/Random";

interface Props {
	id: string;
	seed?: string;
	divWidth: number;
	divHeight: number;
	series: number[]|number[][];
	xAxis?: string[];
	label?: string;
}

/**
 * Props를 입력받아 정제된 id값과 차트의 설정값을 반환하는 hooks
 */
export default function useConfig({ id, seed, divWidth, divHeight, series, xAxis, label }:Props) {
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
		})();

		const _label = (!!label) ? label:"null";

		return {
			id: "#"+tId,
			width: divWidth,
			height: divHeight,
			series: series,
			xAxis: _xAxis,
			label: _label
		};
	}, [seed, tId, divWidth, divHeight, series, label]);



	return { tId, config };
}