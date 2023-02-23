import { Accordion, Space, Input, Text, Code, SimpleGrid, Center, Button } from "@mantine/core";
import { DataTable, DataTableSortStatus } from "mantine-datatable";
import { ReactElement, useEffect, useState } from "react";
import sortBy from "lodash/sortBy";
import dayjs from "dayjs";
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

  // TODO input should be sanitized by default
  return (
    <>
      <Input
        sx={(theme) => ({width: '40%'})}
        value={params}
        onChange={(event) => {
          setParams(event.currentTarget.value)
          setRecords(parseSearch(event.currentTarget.value))
        }}
        placeholder="e.g. Cure Time >= 3.0, Polymer 2 < Polymer 1, Coloring Pigment = 0"
      />
      <Accordion sx={(theme) => ({width: '30%'})}>
        <Accordion.Item value="info">
          <Accordion.Control>Need Help Querying?</Accordion.Control>
          <Accordion.Panel>
            <Text fz="sm">
              Any number of conditions can be specified, separated by commas.
              The values that can be compared are any of the inputs or properties, as well as the Experiment ID, number, or date.
              The comparison operators that can be used are <Code>{">, >=, <, <=, =, and !="}</Code>.
              These values can be compared to numbers when appropriate, or the date can be compared to a given date.
              The date can be formatted either as ISO 8601 {"(YYYY-MM-DD)"} or any conventional month/day/year format.
            </Text>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
      <Space h="xl"/>
      <DataTable
        withBorder
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

enum ArgType {Input, Output, DateLiteral, NumberLiteral, ID, ExpNum, Date, Err}

// TODO i can remove more cases before filtering 
// TODO stretch feature: allow for an OR operator (something something 3-SAT?)

function parseSearch(params: string): ProcessedData[] {
  let filtered = [...table]
  try{
    params.split(',').forEach( condition => {
      const [arg1, op, arg2]: string[] = condition.split(/([<>!=]=|[<>])/g).map(x => x.trim())
      const [type1, type2]: ArgType[] = [arg1, arg2].map(findType)
      if (type1 === type2 && (type1 === ArgType.ID || type1 === ArgType.ExpNum || type1 === ArgType.Date))
        return;
      filtered = filtered.filter(exp => {
        const val1 = valFromType(arg1, type1, exp);
        const val2 = valFromType(arg2, type2, exp);

        console.log(`${val1} \t ${val2}`)

        if (val1 === undefined || val2 == undefined)
          return;
        switch (op) {
          case ">":   return val1 > val2;
          case ">=":  return val1 >= val2;
          case "<":   return val1 < val2;
          case "<=":  return val1 <= val2;
          case "!=":  return val1 !== val2;
          case "=":
          case "==":  return val1 === val2;
          default:    return true;
        }
      })
    })
  } catch {}
  return filtered
}

// TODO stretch feature fuzzy text matching
function findType(arg: string) {
  if (inputs.includes(arg))
    return ArgType.Input
  else if (outputs.includes(arg))
    return ArgType.Output
  else if (/^\d+\.?\d*$/.test(arg))
    return ArgType.NumberLiteral
  else if (dayjs(arg).isValid())
    return ArgType.DateLiteral
  else if (arg === "Experiment ID")
    return ArgType.ID
  else if (arg === "Experiment Number")
    return ArgType.ExpNum
  else if (arg === "Date")
    return ArgType.Date
  else
    return ArgType.Err
}

function valFromType(arg: string, type: ArgType, exp: ProcessedData): (string | number | undefined) {
  if (type === ArgType.Input)
    return new Map(exp.inputs.map(dp => [dp.name, dp.value])).get(arg)
  else if (type === ArgType.Output)
    return new Map(exp.outputs.map(dp => [dp.name, dp.value])).get(arg)
  else if (type === ArgType.NumberLiteral)
    return parseFloat(arg)
  else if (type === ArgType.DateLiteral)
    return dayjs(arg).valueOf()
  else if (type === ArgType.ID)
    return exp.id
  else if (type === ArgType.ExpNum)
    return exp.num
  else if (type === ArgType.Date)
    return exp.date.valueOf() 
  else
    throw new Error()
}