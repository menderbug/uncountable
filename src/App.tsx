import { MantineProvider, Tabs } from "@mantine/core";
import { ReactElement, useEffect, useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import _dataset from "./Uncountable Front End Dataset.json";
import { TableComponent } from "./components/TableComponent";
import { ScatterComponent } from "./components/ScatterComponent";

// TODO semicolon style guide
// TODO see how strongly i should type
// TODO duplicate experiments
// TODO download as excel

interface DataPoint {
  quantity: string;
  value: number;
}

export interface ProcessedData {
  id: string;
  num: number;
  date: Dayjs;
  inputs: DataPoint[];
  outputs: DataPoint[];
}

// TODO is this type correct?
function App(): ReactElement {
  // TODO this preprocessing should not occur multiple times
  // consider using lodash union?
  // const dataset: RawData = _dataset
  const arr = Object.entries(_dataset);
  const inputs: string[] = [
    ...new Set(arr.flatMap((exp) => Object.keys(exp[1].inputs))),
  ];
  const outputs: string[] = [
    ...new Set(arr.flatMap((exp) => Object.keys(exp[1].outputs))),
  ];

  const tabulated: ProcessedData[] = arr.map((exp) => {
    const [expNum, expDate] = parseExperiment(exp[0]);
    return {
      id: exp[0],
      num: expNum,
      date: expDate,
      inputs: Object.entries(exp[1].inputs).map(
        (x): DataPoint => ({ quantity: x[0], value: x[1] })
      ),
      outputs: Object.entries(exp[1].outputs).map(
        (x): DataPoint => ({ quantity: x[0], value: x[1] })
      ),
    };
  });

  // TODO the way i'm passing props is sus
  // TODO go through and type EVERYTHING

  return (
    <MantineProvider
      theme={{ colorScheme: "dark" }}
      withGlobalStyles
      withNormalizeCSS
    >
      <div className="App">
        <Tabs defaultValue="gallery">
          <Tabs.List>
            <Tabs.Tab value="gallery">Gallery</Tabs.Tab>
            <Tabs.Tab value="messages">Messages</Tabs.Tab>
            <Tabs.Tab value="settings">Settings</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="gallery" pt="xs">
            <TableComponent table={tabulated} />
          </Tabs.Panel>

          <Tabs.Panel value="messages" pt="xs">
            <ScatterComponent
              table={tabulated}
              inputs={inputs}
              outputs={outputs}
            />
          </Tabs.Panel>

          <Tabs.Panel value="settings" pt="xs">
            Settings tab content
          </Tabs.Panel>
        </Tabs>
      </div>
    </MantineProvider>
  );
}

function parseExperiment(str: string): [number, Dayjs] {
  try {
    const [date, , num] = str.split("_");
    return [parseInt(num), dayjs(date, "YYYYMMDD")];
  } catch {
    return [-1, dayjs(null)];
  }
}

export default App;
