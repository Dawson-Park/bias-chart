import React from "react";
import Random from "../lib/Random";

/**
 * div의 Reference를 전달받아 div의 높이와 너비, 랜덤ID의 시드값을 반환하는 hooks
 */
export default function useInit(group: React.RefObject<HTMLDivElement>) {
	const [divWidth, setDivWidth] = React.useState(0);
	const [divHeight, setDivHeight] = React.useState(0);
	const [seed, setSeed] = React.useState<string>();

	/**
	 * Group Ref가 할당되어 있다면, Group의 width와 height를 읽어오는 메소드
	 */
	const getDivSize = () => {
		if(!group.current) return;
		setDivWidth(group.current.clientWidth);
		setDivHeight(group.current.clientHeight);
	}

	/**
	 * useRef가 할당되면 1회 실행
	 * Group div의 크기를 할당하는 side-effect
	 */
	React.useEffect(() => {
		getDivSize();
	}, [group])

	/**
	 * 최초 1회 실행
	 * 1) 화면 사이즈가 변경되면 Group div의 크기를 재할당
	 * 2) 랜덤 시드값 추가
	 */
	React.useEffect(() => {
		window.addEventListener("resize", getDivSize);
		setSeed(Random.string(6));
	}, [])


	return { divWidth, divHeight, seed }
}