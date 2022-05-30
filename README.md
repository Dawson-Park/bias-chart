# Bias-chart
d3.js 기반 React 라이브러리 입니다.

## Usage

<details>
<summary>Bar chart</summary>


### Import
```jsx
import { Bar } from "@acryl/bias-chart";
```

### Props
| Name    | Type         | Default     | Description                 |
|---------|--------------|-------------|-----------------------------|
| data    | `number[][]` |             | 그래프를 나타내는데 사용될 데이터          |
| id      | `string`     | `undefined` | 차트의 id. 여러 컴포넌트를 사용하는 경우 권고 |
| xDomain | `string[]`   | `undefined` | x축의 이름                      |
| zDomain | `string[]`   | `undefined` | 데이터 그룹의 이름                  |
| width   | `string`     | '100%'      | 차트의 너비                      |
| height  | `string`     | '100%'      | 차트의 높이                      |
| label   | `string`     | `undefined` | y축의 라벨                      |

### Single Graph
```jsx
const data = [
  [59, 84, 78, 63, 87, 89]
];

<div>
  <Bar id={"bar"} data={data} />
</div>
```
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
