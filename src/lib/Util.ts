export default class Util {
	/**
	 * 도메인을 extract된 3차원 배열에 대응되도록 변경
	 */
	public static plait3(domain:string[]|undefined, extracted:{x:number, y:number, z:number}[], flag:"x"|"z") {
		if(!domain) return undefined;

		const output = [];

		if(flag === "x") {
			const x = Array.from(new Set(extracted.map(e => e.x)));
			const length = extracted.length/x.length;

			if(x.length === domain.length) {
				for (let i = 0; i <length; i++) {
					for (const el of x) {
						output.push(domain[el])
					}
				}
				return output;
			}
			else return undefined;
		}
		else {
			const z = Array.from(new Set(extracted.map(e => e.z)));
			const length = extracted.length/z.length;

			if(z.length === domain.length) {
				for (const el of z) {
					for (let i = 0; i <length; i++) {
						output.push(domain[el])
					}
				}
				return output;
			}
			else return undefined;
		}
	}

	/**
	 * 도메인을 extract된 2차원 배열에 대응되도록 변경
	 */
	public static plait2(domain:string[]|undefined, extracted:{x:number, y:number}[]) {
		if(!domain) return undefined;

		const output = [];
		const x = Array.from(new Set(extracted.map(e => e.x)));

		if(x.length === domain.length) {
			for(const el of x) {
				output.push(domain[el])
			}
			return output;
		}
		else return undefined;
	}

	/**
	 * 입력받은 series를 3차원 배열로 재배열하는 메소드
	 */
	public static extract3(Y:number[][]) {
		const output = [];
		for (const K in Y) {
			for (const k in Y[K]) {
				output.push({ y:Y[K][k], x:Number(k), z:Number(K) });
			}
		}

		return output;
	}

	/**
	 * 입력받은 series를 2차원 배열로 재배열하는 메소드
	 */
	public static extract2(N:number[]) {
		return N.map((d, i) => ({
			x: i, y: d
		}));
	}

	/**
	 * 입력받은 숫자가 1000을 넘으면 k로 표시하는 메소드
	 */
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

	public static bandage(v:number, min:number, max:number) {
		if(v > max) return max;
		if(v < min) return min;
		return v;
	}
}