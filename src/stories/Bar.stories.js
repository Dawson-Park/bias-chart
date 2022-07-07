import { Bar } from "acryl-bias-chart";

export default {
	title: "Bar",
	component: Bar
}

const Base = (args) => <Bar {...args} />

export const Default = Base.bind({});
Default.args = {
	data: [[
		13, 46, 15, 30, 8, 10
	]]
}

export const Multiple = Base.bind({});
Multiple.args = {
	data: [
		[13, 46, 15, 30, 8, 10],
		[26, 92, 30, 60, 16, 20]
	]
}

export const XDomain = Base.bind({});
XDomain.args = {
	data: [[
		13, 46, 15, 30, 8, 10
	]],
	xDomain: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]
}

export const ZDomain = Base.bind({});
ZDomain.args = {
	data: [
		[13, 46, 15, 30, 8, 10],
		[26, 92, 30, 60, 16, 20]
	],
	zDomain: ["Florida", "New Jersey"]
}

export const Label = Base.bind({});
Label.args = {
	data: [[
		13, 46, 15, 30, 8, 10
	]],
	label: "rain drop the falling on my head"
}