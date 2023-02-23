import { useState } from "react";
import { NativeSelect, RangeSlider } from "@mantine/core";
import { RawData } from "../App";

interface HistoProps {
  data: RawData[];
  inputs: string[];
}

export function HistogramComponent(props: HistoProps) {
  const { data, inputs } = props;

  const [inputVal, setInput] = useState(inputs.length > 0 ? inputs[0] : "");
  const [rangeValue, setRangeValue] = useState<[number, number]>([20, 80]);

  return (
    <>
      <NativeSelect
        value={inputVal}
        onChange={(event) => {
          setInput(event.currentTarget.value);
        }}
        data={props.inputs}
        label="filler inputs"
        description="filler again"
      />
      <RangeSlider value={rangeValue} onChangeEnd={setRangeValue} />
    </>
  );
}
