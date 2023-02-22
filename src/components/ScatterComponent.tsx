import { NativeSelect } from "@mantine/core";
import { ScatterChart, Scatter, XAxis, YAxis } from 'recharts';
import { useState } from "react";


export interface RawData {
  inputs: { [inKeys: string]: number }
  outputs: { [outKeys: string]: number }
}


interface ScatterPoint {
  x: number
  y: number
}

interface ScatterProps {
  data: RawData[];
  inputs: string[];
  outputs: string[];
}

export function ScatterComponent(props: ScatterProps) {

  const {data, inputs, outputs} = props;

  const [inputVal, setInput] = useState(inputs.length > 0 ? inputs[0] : "");
  const [outputVal, setOutput] = useState(outputs.length > 0 ? outputs[0] : "");
  const [points, setPoints] = useState(data.map((exp): ScatterPoint => ({x: exp.inputs[inputVal], y: exp.outputs[outputVal]})));

  return (
    <>
      <NativeSelect
        value={inputVal}
        onChange={(event) => {
          setInput(event.currentTarget.value)
          setPoints(data.map((exp): ScatterPoint => ({x: exp.inputs[inputVal], y: exp.outputs[outputVal]})))
        }}
        data={props.inputs}
        label="filler inputs"
        description="filler again"
      />
      <NativeSelect
        value={outputVal}
        onChange={(event) => {
          setOutput(event.currentTarget.value)
          setPoints(data.map((exp): ScatterPoint => ({x: exp.inputs[inputVal], y: exp.outputs[outputVal]})))
        }}
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
        <XAxis dataKey="x" type="number" name={inputVal}/>
        <YAxis dataKey="y" type="number" name={outputVal}/>
        <Scatter data={points} fill="#ffffff"/>
      </ScatterChart>
    </>
  );
}
