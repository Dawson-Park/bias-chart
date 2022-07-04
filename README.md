# Bias-chart
d3.js 기반 React 라이브러리 입니다.  
npm package : https://www.npmjs.com/package/acryl-bias-chart

## Installation
```
npm i acryl-bias-chart
```

## Usage

<details>
<summary>Bar chart</summary>


### Import
```jsx
import { Bar } from "acryl-bias-chart";
```

### Props
| Name    | Type         | Default     | Description        |
|---------|--------------|-------------|--------------------|
| data    | `number[][]` |             | 그래프를 나타내는데 사용될 데이터 |
| id      | `string`     | `undefined` | 차트의 id             |
| xDomain | `string[]`   | `undefined` | x축의 이름             |
| zDomain | `string[]`   | `undefined` | 데이터 그룹의 이름         |
| width   | `string`     | '100%'      | 차트의 너비             |
| height  | `string`     | '100%'      | 차트의 높이             |
| label   | `string`     | `undefined` | y축의 라벨             |

### Single Graph
```jsx
const data = [
  [59, 84, 78, 63, 87, 89]
];

<div>
  <Bar id={"bar"} data={data} />
</div>
```
id는 기본값으로 임의의 문자열 6자가 지정됩니다. 다만 같은 종류의 컴포넌트를 둘 이상 사용할 때는 사용할 것을 권고드립니다.

![1](https://user-images.githubusercontent.com/94957353/170938239-75ed7532-a5eb-4f40-a08a-0638bdc2ff5e.png)

### Multiple Graph
```jsx
const data = [
  [59, 84, 78, 63, 87, 89],
  [66, 16, 60, 30, 130, 62],
];

<div>
  <Bar id={"bar"} data={data} />
</div>
```
![2](https://user-images.githubusercontent.com/94957353/170938324-16bbb2eb-5271-4c7e-815f-dbf9f13c756e.png)

### xDomain 사용
```jsx
const data = [
  [59, 84, 78, 63, 87, 89]
];

const xDomain = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun" ];
    
<div>
  <Bar id={"bar"} data={data} xDomain={xDomain} />
</div>
```
`xDomain`의 `length`는 `data` 1차원 배열의 요소의 수와 같아야합니다. 만약 요소의 수가 위처럼 6개라면 `xDomain` 요소의 수 역시 6개로 동일해야합니다. 이보다 많거나 적다면 기본값인 요소의 인덱스 값인 `n`으로 표시됩니다.  

![3](https://user-images.githubusercontent.com/94957353/170938393-09e0093d-715e-42d8-a25b-3d41ec2044d0.png)

### zDomain 사용
```jsx
const data = [
  [59, 84, 78, 63, 87, 89]
];

const zDomain = [ "Florida" ];
    
<div>
  <Bar id={"bar"} data={data} zDomain={zDomain} />
</div>
```
`zDomain`의 `length`는 반드시 `data`의 1차원 배열 수와 같아야합니다. 만약 그래프의 수가 위처럼 하나라면 `zDomain` 역시 하나여야합니다. 이보다 많거나 적다면 기본값인 `Series n`으로 표시됩니다.  

![4](https://user-images.githubusercontent.com/94957353/170938415-3b4702a9-22c1-4175-9126-70472b6ec553.png)

### label 사용
```jsx
const data = [
  [59, 84, 78, 63, 87, 89]
];

const label = "강우확률(%)";
    
<div>
  <Bar id={"bar"} data={data} label={label} />
</div>
```
![5](https://user-images.githubusercontent.com/94957353/170938433-0f6b4406-bc6d-44c7-a676-996f2b1ad1c6.png)

### width, height의 사용
```jsx
<div>
  <Bar id={"bar"} data={data} width={"360px"} height={"400px"} />
</div>
```
`width`와 `height`에 대한 직접적인 크기 조절은 권장하지 않습니다. 컴포넌트는 부모 태그의 크기에 맞도록 `100%`로 설정되어있기 때문에, 부모 태그의 크기를 조절하여 사용할 것을 권고합니다.

</details>



<details>
<summary>Line chart</summary>


### Import
```jsx
import { Line } from "acryl-bias-chart";
```

### Props
| Name    | Type         | Default     | Description        |
|---------|--------------|-------------|--------------------|
| data    | `number[][]` |             | 그래프를 나타내는데 사용될 데이터 |
| id      | `string`     | `undefined` | 차트의 id             |
| xDomain | `string[]`   | `undefined` | x축의 이름             |
| zDomain | `string[]`   | `undefined` | 데이터 그룹의 이름         |
| width   | `string`     | '100%'      | 차트의 너비             |
| height  | `string`     | '100%'      | 차트의 높이             |
| label   | `string`     | `undefined` | y축의 라벨             |

### Single Graph
```jsx
const data = [
  [59, 84, 78, 63, 87, 89]
];

<div>
  <Line id={"line"} data={data} />
</div>
```
id는 기본값으로 임의의 문자열 6자가 지정됩니다. 다만 같은 종류의 컴포넌트를 둘 이상 사용할 때는 사용할 것을 권고드립니다.  

![1](https://user-images.githubusercontent.com/94957353/170941085-f3fa0b8e-d32a-4e4d-b8d2-c9474d416de9.png)

### Multiple Graph
```jsx
const data = [
  [59, 84, 78, 63, 87, 89],
  [66, 16, 60, 30, 130, 62],
];

<div>
  <Line id={"line"} data={data} />
</div>
```
![2](https://user-images.githubusercontent.com/94957353/170941108-4b91b8c0-a810-4c69-aedb-f29101e34348.png)

### xDomain 사용
```jsx
const data = [
  [59, 84, 78, 63, 87, 89]
];

const xDomain = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun" ];
    
<div>
  <Line id={"line"} data={data} xDomain={xDomain} />
</div>
```
`xDomain`의 `length`는 `data` 1차원 배열의 요소의 수와 같아야합니다. 만약 요소의 수가 위처럼 6개라면 `xDomain` 요소의 수 역시 6개로 동일해야합니다. 이보다 많거나 적다면 기본값인 요소의 인덱스 값인 `n`으로 표시됩니다.

![3](https://user-images.githubusercontent.com/94957353/170941136-2eed1d74-6d51-4549-ade4-0ebf2767f4c6.png)

### zDomain 사용
```jsx
const data = [
  [59, 84, 78, 63, 87, 89]
];

const zDomain = [ "Florida" ];
    
<div>
  <Line id={"line"} data={data} zDomain={zDomain} />
</div>
```
`zDomain`의 `length`는 반드시 `data`의 1차원 배열 수와 같아야합니다. 만약 그래프의 수가 위처럼 하나라면 `zDomain` 역시 하나여야합니다. 이보다 많거나 적다면 기본값인 `Series n`으로 표시됩니다.

![4](https://user-images.githubusercontent.com/94957353/170941208-e33ec1a5-b88e-4501-9273-ae897c79c883.png)

### label 사용
```jsx
const data = [
  [59, 84, 78, 63, 87, 89]
];

const label = "강우확률(%)";
    
<div>
  <Line id={"line"} data={data} label={label} />
</div>
```
![5](https://user-images.githubusercontent.com/94957353/170941234-d72aa94b-3076-4ad6-9165-2aeebb9d6b8d.png)

### width, height의 사용
```jsx
<div>
  <Line id={"line"} data={data} width={"360px"} height={"400px"} />
</div>
```
`width`와 `height`에 대한 직접적인 크기 조절은 권장하지 않습니다. 컴포넌트는 부모 태그의 크기에 맞도록 `100%`로 설정되어있기 때문에, 부모 태그의 크기를 조절하여 사용할 것을 권고합니다.

</details>


<details>
<summary>Pie chart</summary>


### Import
```jsx
import { Pie } from "acryl-bias-chart";
```

### Props
| Name    | Type       | Default     | Description        |
|---------|------------|-------------|--------------------|
| data    | `number[]` |             | 그래프를 나타내는데 사용될 데이터 |
| id      | `string`   | `undefined` | 차트의 id             |
| xDomain | `string[]` | `undefined` | x축의 이름             |
| width   | `string`   | '100%'      | 차트의 너비             |
| height  | `string`   | '100%'      | 차트의 높이             |
| label   | `string`   | `undefined` | y축의 라벨             |

### Single Graph
```jsx
const data = [
	59, 84, 78, 63, 87, 89
];

<div>
  <Pie id={"pie"} data={data} />
</div>
```
id는 기본값으로 임의의 문자열 6자가 지정됩니다. 다만 같은 종류의 컴포넌트를 둘 이상 사용할 때는 사용할 것을 권고드립니다.  
![1](https://user-images.githubusercontent.com/94957353/177104324-1729b4f8-6ceb-45d0-bf39-055f35bb531e.png)

### xDomain 사용
```jsx
const data = [
	59, 84, 78, 63, 87, 89
];

const xDomain = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun" ];
    
<div>
  <Pie id={"pie"} data={data} xDomain={xDomain} />
</div>
```
`xDomain`의 `length`는 `data` 배열의 요소의 수와 같아야합니다. 만약 요소의 수가 위처럼 6개라면 `xDomain` 요소의 수 역시 6개로 동일해야합니다. 이보다 많거나 적다면 기본값인 요소의 인덱스 값인 `n`으로 표시됩니다.  
![2](https://user-images.githubusercontent.com/94957353/177104544-8afbba6f-6a8e-47a6-a458-93f1ff5e3d74.png)

### label 사용
```jsx
const data = [
	59, 84, 78, 63, 87, 89
];

const label = "강우확률(%)";
    
<div>
  <Pie id={"pie"} data={data} label={label} />
</div>
```  
![3](https://user-images.githubusercontent.com/94957353/177104708-5694e1f7-3ee6-4343-9949-515ea1dacb61.png)


### width, height의 사용
```jsx
<div>
  <Pie id={"pie"} data={data} width={"360px"} height={"400px"} />
</div>
```
`width`와 `height`에 대한 직접적인 크기 조절은 권장하지 않습니다. 컴포넌트는 부모 태그의 크기에 맞도록 `100%`로 설정되어있기 때문에, 부모 태그의 크기를 조절하여 사용할 것을 권고합니다.

</details>
