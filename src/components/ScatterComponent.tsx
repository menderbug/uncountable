import { NativeSelect } from "@mantine/core";
import { ScatterChart, Scatter, XAxis, YAxis } from 'recharts';
import { useState } from "react";
// import { ProcessedData } from "../App";


export interface RawData {
  inputs: { [inKeys: string]: number }
  outputs: { [outKeys: string]: number }
}


interface ScatterProps {
  data: RawData[];
  inputs: string[];
  outputs: string[];
}

export function ScatterComponent(props: ScatterProps) {
  const [inputVal, setInput] = useState("");
  const [outputVal, setOutput] = useState("");

  console.log(props.data)
  console.log(props.data.map(exp => exp.inputs[inputVal]))

  return (
    <>
      <NativeSelect
        value={inputVal}
        onChange={(event) => setInput(event.currentTarget.value)}
        data={props.inputs}
        label="filler inputs"
        description="filler again"
      />
      <NativeSelect
        value={outputVal}
        onChange={(event) => setOutput(event.currentTarget.value)}
        data={props.outputs}
        label="filler outputs"
        description="filler again again"
      />
      <ScatterChart
        width={730}
        height={250}
        margin={{
          top: 20,
          right: 20,
          bottom: 10,
          left: 10,
        }}
      >
        <XAxis dataKey={inputVal} type="number" name={inputVal}/>
        <YAxis dataKey={outputVal} type="number" name={outputVal}/>
        <Scatter data={props.data.map(exp => exp.inputs[inputVal])} />
      </ScatterChart>
    </>
  );
}
