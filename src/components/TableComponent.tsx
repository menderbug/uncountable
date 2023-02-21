import {
  AppShell,
  Navbar,
  SimpleGrid,
  MantineProvider,
  NativeSelect,
} from "@mantine/core";
import { DataTable, DataTableSortStatus } from "mantine-datatable";
import { ReactElement, useEffect, useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import sortBy from "lodash/sortBy";
import _dataset from "../Uncountable Front End Dataset.json";
import { ProcessedData } from "../App";

interface TableProps {
  table: ProcessedData[];
}

export function TableComponent(props: TableProps): ReactElement {
  const table = props.table;

  const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
    columnAccessor: "name",
    direction: "asc",
  });
  const [records, setRecords] = useState(sortBy(table, "name"));

  useEffect(() => {
    const data = sortBy(table, sortStatus.columnAccessor);
    setRecords(sortStatus.direction === "desc" ? data.reverse() : data);
  }, [sortStatus]);

  return (
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
          <SimpleGrid cols={2}>
            <DataTable
              minHeight={150}
              columns={[
                { accessor: "quantity", sortable: true },
                { accessor: "value", sortable: true },
              ]}
              records={record.inputs}
            />
            <DataTable
              minHeight={150}
              columns={[
                { accessor: "quantity", sortable: true },
                { accessor: "value", sortable: true },
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
  );
}
