export default class Random {
	private static _AVAILABLECHAR = [
		'_',
		'0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
		'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j',
		'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't',
		'u', 'v', 'w', 'x', 'y', 'z',
		'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J',
		'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T',
		'U', 'V', 'W', 'X', 'Y', 'Z'
	];

	private static _MAXIMUM = this._AVAILABLECHAR.length;

	public static number(min:number, max:number) {
		return Math.floor(Math.random() * (max - min) + min);
	}

	public static string(lots: number) {
		const list = this._getStringArray(lots);
		return list.map(i => this._AVAILABLECHAR[i]).join().replaceAll(',','');
	}

	private static _getStringArray(lots:number) {
		const result:number[] = [];

		for(let i=0; i<lots; i++) {
			result.push(this.number(0, this._MAXIMUM))
		}

		return result;
	}
}