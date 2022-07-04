import React from "react";
import useInit from "./useInit";
import Random from "lib/Random";
import Util from "lib/Util";

export default function usePieConfig(
	data: number[], group: React.RefObject<HTMLDivElement>, type:string, id?: string, label?: string, xDomain?: string[]
) {
	const { divWidth, divHeight, seed } = useInit(group);

	/**
	 * 시드값이 지정된 SVG의 id 값
	 */
	const tId = React.useMemo(() => {
		if(!seed) return null;
		else return `${type}_${!id ? Random.string(6):id}_${seed}`;
	}, [id, seed]);

	/**
	 * 1차원 배열로 재정의된 data
	 */
	const series = React.useMemo(() => {
		return Util.extract2(data);
	}, [data])

	/**
	 * 차트에서 사용할 설정값을 저장하는 Memo
	 */
	return React.useMemo(() => {
		if(!tId) return null;

		return {
			id: tId,
			width: divWidth,
			height: divHeight,
			xDomain: Util.plait2(xDomain, series),
			series, label
		};
	}, [tId, divWidth, divHeight, series, label, xDomain]);
}