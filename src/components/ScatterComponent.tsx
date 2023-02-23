import { NativeSelect, SimpleGrid, Stack } from "@mantine/core";
import { ScatterChart, Scatter, XAxis, YAxis } from "recharts";
import { useState } from "react";
import { RawData } from "../App";

interface ScatterPoint {
  x: number;
  y: number;
}

interface ScatterProps {
  data: RawData[];
  inputs: string[];
  outputs: string[];
}

export function ScatterComponent(props: ScatterProps) {
  const { data, inputs, outputs } = props;

  const [inputVal, setInput] = useState(inputs.length > 0 ? inputs[0] : "");
  const [outputVal, setOutput] = useState(outputs.length > 0 ? outputs[0] : "");

  const [outX, setOutX] = useState(outputs.length > 0 ? outputs[0] : "");
  const [outY, setOutY] = useState(outputs.length > 1 ? outputs[1] : "");

  const [points, setPoints] = useState(
    data
      .map(
        (exp): ScatterPoint => ({
          x: exp.inputs[inputVal],
          y: exp.outputs[outputVal],
        })
      )
      .filter((sp) => sp.x !== 0)
  );

  const [points2, setPoints2] = useState(
    data.map(
      (exp): ScatterPoint => ({
        x: exp.outputs[outX],
        y: exp.outputs[outY],
      })
    )
  );

  return (
    <SimpleGrid cols={2}>
      <Stack>
        <h4>Ingredient/Input vs Property</h4>
        <NativeSelect
          value={inputVal}
          onChange={(event) => {
            setInput(event.currentTarget.value);
            setPoints(
              data
                .map(
                  (exp): ScatterPoint => ({
                    x: exp.inputs[event.currentTarget.value],
                    y: exp.outputs[outputVal],
                  })
                )
                .filter((sp) => sp.x !== 0)
            );
          }}
          data={props.inputs}
          label="Ingredient/Input (X Axis)"
        />
        <NativeSelect
          value={outputVal}
          onChange={(event) => {
            setOutput(event.currentTarget.value);
            setPoints(
              data
                .map(
                  (exp): ScatterPoint => ({
                    x: exp.inputs[inputVal],
                    y: exp.outputs[event.currentTarget.value],
                  })
                )
                .filter((sp) => sp.x !== 0)
            );
          }}
          data={props.outputs}
          label="Property (Y Axis)"
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
          <XAxis dataKey="x" type="number" name={inputVal} />
          <YAxis dataKey="y" type="number" name={outputVal} />
          <Scatter data={points} fill="#ffffff" />
        </ScatterChart>
      </Stack>
      <Stack>
        <h4>Property vs Property</h4>
        <NativeSelect
          value={outX}
          onChange={(event) => {
            setOutX(event.currentTarget.value);
            setPoints2(
              data
                .map(
                  (exp): ScatterPoint => ({
                    x: exp.outputs[event.currentTarget.value],
                    y: exp.outputs[outY],
                  })
                )
                .filter((sp) => sp.x !== 0)
            );
          }}
          data={outputs}
          label="Property (X Axis)"
        />
        <NativeSelect
          value={outY}
          onChange={(event) => {
            setOutY(event.currentTarget.value);
            setPoints2(
              data
                .map(
                  (exp): ScatterPoint => ({
                    x: exp.outputs[outX],
                    y: exp.outputs[event.currentTarget.value],
                  })
                )
                .filter((sp) => sp.x !== 0)
            );
          }}
          data={outputs}
          label="Property (Y Axis)"
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
          <XAxis dataKey="x" type="number" name={outX} />
          <YAxis dataKey="y" type="number" name={outY} />
          <Scatter data={points2} fill="#ffffff" />
        </ScatterChart>
      </Stack>
    </SimpleGrid>
  );
}
