import React from "react";

interface Props {
	name: string;
}

export default function Hello({name}:Props) {
	return <div>Hello {name}!</div>
}