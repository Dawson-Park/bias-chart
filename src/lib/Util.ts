export default class Util {
	public static k(n:number):string {
		return Intl.NumberFormat('en', {notation:'compact'}).format(n)
	}

	/**
	 * 입력받은 배열에서 가장 작은 값을 출력하는 메소드
	 */
	public static min(data:number[]):number {
		return Math.min.apply(Math, data)
	}

	/**
	 * 입력받은 배열에서 가장 큰 값을 출력하는 메소드
	 */
	public static max(data:number[]):number {
		return Math.max.apply(Math, data)
	}

	/**
	 * 2차원 배열을 1차원 배열로 변경하는 메소드
	 */
	public static flat(array:number[][]):number[] {
		return array.reduce((acc, cur) => acc.concat(cur));
	}

	/**
	 * 입력받은 변수가 비어있는지 확인하는 메소드
	 */
	public static isEmpty(...args:any):boolean {
		const result = args.map((arg:any) => {
			switch (typeof arg) {
				case "boolean": return !arg;
				case "object": return this.isVaccum(arg);
				case "string": return this.isTalk(arg);
				case "number": return this.isUInt(arg);
				case "undefined": return true;
				default: return false;
			}
		});

		return this.or(result);
	}

	/**
	 * 입력받은 문자열이 비어있는지 확인하는 메소드
	 */
	public static isTalk(string:string):boolean {
		return !(string.length > 0);
	}

	/**
	 * 입력받은 숫자가 unsigned int인지 확인하는 메소드
	 */
	public static isUInt(number:number):boolean {
		return !(number > 0);
	}

	/**
	 * 입력받은 Object가 비어있는지 확인하는 메소드
	 */
	public static isVaccum(object:any):boolean {
		if(object===null) {
			return true;
		}
		else if(typeof object.length === 'number') {
			return !(object.length > 0);
		}
		else {
			if (object.constructor === Object && Object.keys(object).length === 0) {
				return true
			}
			else {
				const res = [];
				for (const property in object) {
					res.push(this.isEmpty(object[property]))
				}
				return this.or(res);
			}
		}
	}

	/**
	 * 입력받은 boolean 배열을 or 연산하는 메소드
	 */
	public static or(result:boolean[]):boolean {
		for (const el of result) {
			if(el) return true;
		}
		return false;
	}

	/**
	 * 입력받은 boolean 배열을 and 연산하는 메소드
	 */
	public static and(result:boolean[]):boolean {
		for (const el of result) {
			if(!el) return false;
		}
		return true;
	}
}