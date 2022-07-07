import { Pie } from "acryl-bias-chart";

export default {
	title: "Pie",
	component: Pie
}

const Base = (args) => <Pie {...args} />

export const Default = Base.bind({});
Default.args = {
	data: [
		13, 46, 15, 30, 8, 10
	]
}

export const XDomain = Base.bind({});
XDomain.args = {
	data: [[
		13, 46, 15, 30, 8, 10
	]],
	xDomain: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]
}


export const Label = Base.bind({});
Label.args = {
	data: [[
		13, 46, 15, 30, 8, 10
	]],
	label: "rain drop the falling on my head"
}