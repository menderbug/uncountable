import { NativeSelect } from "@mantine/core"
import { useState } from "react"
import { ProcessedData } from "../App"

interface ScatterProps {
	table: ProcessedData[] 
	inputs: string[]
	outputs: string[]
}


export function ScatterComponent(props: ScatterProps) {

	const [inputVal, setInput] = useState('')
	const [outputVal, setOutput] = useState('')

	return (
		<>
			<NativeSelect
			value = {inputVal}
			onChange={(event) => setInput(event.currentTarget.value)}
			data={props.inputs}
			label="filler inputs"
			description="filler again"
			/>
			<NativeSelect
			value = {outputVal}
			onChange={(event) => setOutput(event.currentTarget.value)}
			data={props.outputs}
			label="filler outputs"
			description="filler again again"
			/>
		</>
	)
}