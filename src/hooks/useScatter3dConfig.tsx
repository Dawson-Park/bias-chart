import React from "react";
import Util from "lib/Util";
import Random from "lib/Random";
import useInit from "./useInit";
import { Domain } from "../lib/Constitute";

type ChartType = "Bar"|"Line"|"Spider"|"Pie"|"Scatter3d";

/**
 * prop을 전달받아 config 파일을 생성하는 함수
 */
export default function useScatter3dConfig(
	data: number[][], group: React.RefObject<HTMLDivElement>, type:ChartType, id?: string, label?: string, domain?: Domain
) {
	const [seed, setSeed] = React.useState<string>();
	const [viewBox, setViewBox] = React.useState("0 0 0 0");
	const [size, setSize] = React.useState(0);

	React.useEffect(() => {
		setSeed(Random.string(6));
	}, [])

	React.useEffect(() => {
		if(group === null || !group.current) return;

		const w = group.current.offsetWidth;
		const s = (() => {
			if(w > 900) return 900;
			else if(w < 300) return 300;
			else return w;
		})()

		setSize(s);
		setViewBox(`0 0 ${s} ${s}`);
	}, [group])

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
		return Util.extract4(data);
	}, [data, type])

	/**
	 * 차트에서 사용할 설정값을 저장하는 Memo
	 */
	const config = React.useMemo(() => {
		if(!tId) return null;

		return {
			id: tId,
			size, domain, series, label
		};
	}, [tId, size, series, label, domain, type]);

	return { config, viewBox };
}