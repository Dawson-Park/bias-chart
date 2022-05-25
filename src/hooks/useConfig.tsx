import React from "react";
import Util from "lib/Util";
import Random from "lib/Random";
import useInit from "./useInit";

/**
 * prop을 전달받아 config 파일을 생성하는 함수
 */
export default function useConfig(
	data: number[][], group: React.RefObject<HTMLDivElement>, type:string, id?: string, label?: string, xDomain?: string[], zDomain?: string[]
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
		return Util.extract(data);
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
			xDomain: Util.plait(xDomain, series, "x"),
			zDomain: Util.plait(zDomain, series, "z"),
			series, label
		};
	}, [tId, divWidth, divHeight, series, label, xDomain, zDomain]);
}