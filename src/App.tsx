import { AppShell, Navbar, Accordion, MantineProvider, NativeSelect } from "@mantine/core";
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { useEffect, useState } from "react";
import dayjs, { Dayjs } from 'dayjs';
import sortBy from 'lodash/sortBy';
// import TestComponent from "./components/TestComponent";
import _dataset from "./Uncountable Front End Dataset.json";

// TODO semicolon style guide
// TODO see how strongly i should type
// TODO duplicate experiments


// TODO delete this if unnecessary
interface ExperimentData {
  [name: string]: {
    id?: string
    num?: string
    date?: Dayjs
    inputs: { [inKeys: string]: number }
    outputs: { [outKeys: string]: number }
  }
}



function App() {

  const [inputVal, setInput] = useState('')
  const [outputVal, setOutput] = useState('')

  // TODO this preprocessing should not occur multiple times
  // consider using lodash union?
  const dataset: ExperimentData = _dataset
  const arr = Object.entries(dataset)
  var inputs = [...new Set(arr.flatMap(exp => Object.keys(exp[1].inputs)))]
  var outputs = [...new Set(arr.flatMap(exp => Object.keys(exp[1].outputs)))]
  
  const tabulated = arr.map(exp => {
    exp[1].id = exp[0];
    [exp[1].num, exp[1].date] = parseExperiment(exp[0]);
    return exp[1]
  })

  const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({ columnAccessor: 'name', direction: 'asc' });
  const [records, setRecords] = useState(sortBy(tabulated, 'name'));

  console.log(dataset)
  console.log(tabulated)

  useEffect(() => {
    const data = sortBy(tabulated, sortStatus.columnAccessor);
    setRecords(sortStatus.direction === 'desc' ? data.reverse() : data);
  }, [sortStatus]);

  return (
    <MantineProvider theme={{ colorScheme: 'dark' }}withGlobalStyles withNormalizeCSS>
      <div className="App">
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
          let a = exp[1].inputs
          return a[inputVal as keyof typeof a]
        }).toString()}</pre>
        <DataTable
          minHeight={150}
          columns={[
            { accessor: 'id', title: "Experiment ID" }, 
            { accessor: 'num', title: "Experiment Number", sortable: true }, 
            { accessor: 'date', render: ({ date }) => date === undefined ? "N/A" : date.format('MMMM D, YYYY'), sortable: true }
          ]}
          idAccessor='id'
          records={records}
          rowExpansion={{
            allowMultiple: true,
            content: ( {record} ) => (
              <DataTable
                columns={[
                  { accessor: 'inputs', sortable: true },
                  { accessor: 'outputs', sortable: true }
                ]}
                records={ record }
              />
            )
          }}
          sortStatus={sortStatus}
          onSortStatusChange={setSortStatus}
          textSelectionDisabled
        />
      </div>
    </MantineProvider>
  );
}

function parseExperiment(str: string): [string, Dayjs] {
  try {
    const [date, _, num] = str.split('_')
    return [
      `Experiment ${num}`,
      dayjs(date, 'YYYYMMDD')
    ]
  } catch {
    return [str, dayjs(null)]
  }
}

export default App;
