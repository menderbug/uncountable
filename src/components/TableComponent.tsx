import { Input, SimpleGrid, Center, Button } from "@mantine/core";
import { DataTable, DataTableSortStatus } from "mantine-datatable";
import { ReactElement, useEffect, useState } from "react";
import sortBy from "lodash/sortBy";
import XLSX from "xlsx";
import _dataset from "../Uncountable Front End Dataset.json";
import { ProcessedData } from "../App";

interface TableProps {
  table: ProcessedData[];
  inputs: string[];
  outputs: string[];
}

let table: ProcessedData[], inputs: string[], outputs: string[]

export function TableComponent(props: TableProps): ReactElement {
  ({ table, inputs, outputs } = props)

  const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
    columnAccessor: "name",
    direction: "asc",
  });
  const [records, setRecords] = useState(sortBy(table, "name"));

  useEffect(() => {
    const data = sortBy(table, sortStatus.columnAccessor);
    setRecords(sortStatus.direction === "desc" ? data.reverse() : data);
  }, [sortStatus]);

  const [params, setParams] = useState("")

  parseSearch('Polymer 1 > Cure Time')


  // TODO input should be sanitized by default
  return (
    <>
      <Input
        value={params}
        onChange={(event) => setParams(event.currentTarget.value)}
        placeholder="Cure Time >= 3.0, Polymer 2 < Polymer 1, Coloring Pigment = 0"
      />
      <h1>{params}</h1>
      <DataTable
        minHeight={150}
        columns={[
          { accessor: "id", title: "Experiment ID" },
          {
            accessor: "num",
            title: "Experiment Number",
            render: ({ num }) => (num === -1 ? "" : `Experiment ${num}`),
            sortable: true,
          },
          {
            accessor: "date",
            render: ({ date }) =>
              date === undefined ? "N/A" : date.format("MMMM D, YYYY"),
            sortable: true,
          },
        ]}
        idAccessor="id"
        records={records}
        rowExpansion={{
          allowMultiple: true,
          content: ({ record }) => (
            <SimpleGrid cols={2} color="red.2">
              <DataTable
                styles={{
                  root: {
                    color: "red.2",
                  },
                }}
                withBorder
                minHeight={150}
                columns={[
                  { accessor: "name", title: "Ingredient/Input" },
                  { accessor: "value", title: "Amount" },
                ]}
                records={record.inputs.filter((x) => x.value !== 0)}
              />
              <DataTable
                withBorder
                minHeight={150}
                columns={[
                  { accessor: "name", title: "Property" },
                  { accessor: "value" },
                ]}
                records={record.outputs}
              />
            </SimpleGrid>
          ),
        }}
        sortStatus={sortStatus}
        onSortStatusChange={setSortStatus}
        textSelectionDisabled
      />
      <Center>
        <Button
          onClick={() => toExcel("Uncountable_Front_End_Dataset.xlsx")}
        >
          Download Data as Excel File
        </Button>
      </Center>
    </>
  );
}

interface ExcelRow {
  id: string;
  name: string;
  value: number;
}

function toExcel(fileName: string) {
  const ws = XLSX.utils.json_to_sheet(table.flatMap(reformat));
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Sheet 1");
  XLSX.writeFile(wb, fileName);
}

function reformat(exp: ProcessedData) {
  return exp.inputs
    .map((dp): ExcelRow => ({ id: exp.id, name: dp.name, value: dp.value }))
    .concat(
      exp.outputs.map(
        (dp): ExcelRow => ({ id: exp.id, name: dp.name, value: dp.value })
      )
    );
}

enum ArgType {Input, Output, Number, ID, ExpNum, Date, Err}

function parseSearch(params: string) {
  params.split(',').forEach( condition => {
    try {
      const [arg1, op, arg2]: string[] = condition.split(/([<>!=]=|[<>])/g).map(x => x.trim())
      const [type1, type2]: ArgType[] = [arg1, arg2].map(findType)

    } catch {}
  })
}

function findType(arg: string) {
  if (inputs.includes(arg))
    return ArgType.Input
  else if (outputs.includes(arg))
    return ArgType.Output
  else if (parseFloat(arg))
    return ArgType.Number
  else if (arg === "Experiment ID")
    return ArgType.ID
  else if (arg === "Experiment Number")
    return ArgType.ExpNum
  else if (arg === "Date")
    return ArgType.Date
  else
    return ArgType.Err
}
