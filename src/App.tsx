import { AppShell, Navbar, SimpleGrid, MantineProvider, NativeSelect } from "@mantine/core";
import { ReactElement, useEffect, useState } from "react";
import dayjs, { Dayjs } from 'dayjs';
import { HeaderTabs } from "./components/NavComponent";
import _dataset from "./Uncountable Front End Dataset.json";

// TODO semicolon style guide
// TODO see how strongly i should type
// TODO duplicate experiments
// TODO download as excel

interface DataPoint {quantity: string, value: number}

export interface ProcessedData {
  id: string,
  num: number,    
  date: Dayjs,
  inputs: DataPoint[],
  outputs: DataPoint[]
}


// TODO is this type correct?
function App(): ReactElement {

  const [inputVal, setInput] = useState('')
  const [outputVal, setOutput] = useState('')

  // TODO this preprocessing should not occur multiple times
  // consider using lodash union?
  // const dataset: RawData = _dataset
  const arr = Object.entries(_dataset)
  var inputs = [...new Set(arr.flatMap(exp => Object.keys(exp[1].inputs)))]
  var outputs = [...new Set(arr.flatMap(exp => Object.keys(exp[1].outputs)))]
  
  const tabulated: ProcessedData[] = arr.map(exp => {
    const [expNum, expDate] = parseExperiment(exp[0]);
    return {
     id: exp[0],
     num: expNum,
     date: expDate,
     inputs: Object.entries(exp[1].inputs).map((x): DataPoint => ({quantity: x[0], value: x[1]})),
     outputs: Object.entries(exp[1].outputs).map((x): DataPoint => ({quantity: x[0], value: x[1]}))
    }
  })

  // TODO the way i'm passing props is sus

  return (
    <MantineProvider theme={{ colorScheme: 'dark' }}withGlobalStyles withNormalizeCSS>
      <div className="App">
        <HeaderTabs table={tabulated}/>
        <NativeSelect
          value = {inputVal}
          onChange={(event) => setInput(event.currentTarget.value)}
          data={inputs}
          label="filler inputs"
          description="filler again"
        />
        <NativeSelect
          value = {outputVal}
          onChange={(event) => setOutput(event.currentTarget.value)}
          data={outputs}
          label="filler outputs"
          description="filler again again"
        />
        <pre>the input is {arr.map(exp => {
          const a = exp[1].inputs
          return a[inputVal as keyof typeof a]
        }).toString()}</pre>
      </div>
    </MantineProvider>
  );
}

function parseExperiment(str: string): [number, Dayjs] {
  try {
    const [date, , num] = str.split('_')
    return [parseInt(num), dayjs(date, 'YYYYMMDD')]
  } catch {
    return [-1, dayjs(null)]
  }
}

export default App;
