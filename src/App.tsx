import { MantineProvider, Tabs } from "@mantine/core";
import { ReactElement } from "react";
import dayjs, { Dayjs } from "dayjs";
import _dataset from "./Uncountable Front End Dataset.json";
import { TableComponent } from "./components/TableComponent";
import { ScatterComponent } from "./components/ScatterComponent";
import { HistogramComponent } from "./components/HistogramComponent";

// TODO semicolon style guide
// TODO see how strongly i should type
// TODO duplicate experiments
// TODO download as excel

export interface RawData {
  inputs: { [inKeys: string]: number };
  outputs: { [outKeys: string]: number };
}

export interface DataPoint {
  name: string;
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
        (x): DataPoint => ({ name: x[0], value: x[1] })
      ),
      outputs: Object.entries(exp[1].outputs).map(
        (x): DataPoint => ({ name: x[0], value: x[1] })
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
        <Tabs defaultValue="table">
          <Tabs.List position="center">
            <Tabs.Tab value="table">
              <h3>Raw Data Table</h3>
            </Tabs.Tab>
            <Tabs.Tab value="scatter">
              <h3>Scatter Plots</h3>
            </Tabs.Tab>
            <Tabs.Tab value="histo">
              <h3>Histograms</h3>
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="table" pt="xs">
            <TableComponent table={tabulated} />
          </Tabs.Panel>

          <Tabs.Panel value="scatter" pt="xs">
            <ScatterComponent
              data={arr.map((x) => x[1])}
              inputs={inputs}
              outputs={outputs}
            />
          </Tabs.Panel>

          <Tabs.Panel value="histo" pt="xs">
            <HistogramComponent data={arr.map((x) => x[1])} inputs={inputs} />
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
