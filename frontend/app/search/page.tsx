"use client";
import { useMemo, useState } from "react";
import {
  MaterialReactTable,
  type MRT_ColumnDef,
  type MRT_ColumnFiltersState,
  type MRT_PaginationState,
  type MRT_SortingState,
  useMaterialReactTable,
} from "material-react-table";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from "@mui/material";
import { SearchApi, Test } from "@/client";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TestStatus } from "@/components/Test/Status";
import { TestStatusLabel } from "@/components/TestRow/TestStatus";
import { formatDuration } from "@/tools/format-duration";

const searchTestsByName = (name: string, status: string | undefined) => {
  return new SearchApi().postSearchTestsByName({ name: name, status: status });
};

const SearchPage = () => {
  const [testName, setTestName] = useState<string | null>(null);
  const [testStatus, setTestStatus] = useState<string | null>(null);
  const [data, setData] = useState<Test[]>([]);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefetching, setIsRefetching] = useState(false);
  const [rowCount, setRowCount] = useState(0);
  const [columnFilters, setColumnFilters] = useState<MRT_ColumnFiltersState>(
    [],
  );
  const [sorting, setSorting] = useState<MRT_SortingState>([]);
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const handleSelect = (event: SelectChangeEvent) => {
    let value = event.target.value as string;
    if (value === "Any") {
      value = "";
    }
    setTestStatus(value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await fetchData();
  };

  const fetchData = async () => {
    if (!data.length && testName) {
      setIsLoading(true);
    } else {
      setIsRefetching(true);
    }

    try {
      const resp = await searchTestsByName(
        testName as string,
        testStatus ? (testStatus as string) : undefined,
      );
      setData(resp.data.data as Test[]);
      setRowCount(resp.data.count);
    } catch (error) {
      setIsError(true);
      console.error(error);
      return;
    }
    setIsError(false);
    setIsLoading(false);
    setIsRefetching(false);
  };

  const columns = useMemo<MRT_ColumnDef<Test>[]>(
    () => [
      {
        accessorKey: "location",
        header: "Test name",
        enableColumnFilter: false,
      },
      {
        accessorKey: "status",
        header: "Status",
        Cell: ({ cell }) => {
          return (
            <Box sx={{ width: "100px" }}>
              <TestStatusLabel status={cell.getValue() as typeof TestStatus} />
            </Box>
          );
        },
      },
      {
        accessorFn: (originalRow) => dayjs(originalRow.startedAt as string),
        id: "startedAt",
        header: "Started",
        filterVariant: "date",
        Cell: ({ cell }) => {
          return dayjs(cell.getValue() as string).format("DD.MM.YYYY HH:mm:ss");
        },
        filterFn: (row, id, filterValue) => {
          const filterValueModified = dayjs(filterValue).format("DD.MM.YYYY");
          const formatted = dayjs(row.original.startedAt as string)
            .format("DD.MM.YYYY")
            .toString();
          return formatted.includes(filterValueModified);
        },
      },
      {
        accessorFn: (originalRow) => dayjs(originalRow.stoppedAt as string),
        id: "stoppedAt",
        header: "Stopped",
        filterVariant: "date",
        Cell: ({ cell }) => {
          return dayjs(cell.getValue() as string).format("DD.MM.YYYY HH:mm:ss");
        },
        filterFn: (row, id, filterValue) => {
          const filterValueModif = dayjs(filterValue).format("DD.MM.YYYY");
          const formatted = dayjs(row.original.stoppedAt as string)
            .format("DD.MM.YYYY")
            .toString();
          return formatted.includes(filterValueModif);
        },
      },
      {
        Cell: ({ cell }) =>
          formatDuration(
            cell.row.original.startedAt as string,
            cell.getValue<string>(),
          ),
        accessorKey: "stoppedAt",
        header: "Duration",
        id: "1",
        filterFn: (row, id, filterValue) => {
          const formattedDuration = formatDuration(
            row.original.startedAt as string,
            row.original.stoppedAt,
          );
          return formattedDuration.includes(filterValue);
        },
      },
    ],
    [],
  );

  const table = useMaterialReactTable({
    columns,
    data,
    enableGlobalFilter: false,
    enableColumnActions: false,
    enableHiding: false,
    enableFullScreenToggle: false,
    initialState: { showColumnFilters: true },
    muiFilterDatePickerProps: { format: "DD.MM.YYYY" },
    muiToolbarAlertBannerProps: isError
      ? {
          color: "error",
          children: "Error loading data",
        }
      : undefined,
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    rowCount,
    state: {
      columnFilters,
      isLoading,
      pagination,
      showAlertBanner: isError,
      showProgressBars: isRefetching,
      sorting,
    },
  });

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <Box sx={{ display: "flex" }}>
        <Typography
          sx={{ marginTop: "10px", marginBottom: "25px" }}
          variant="h6"
        >
          Search
        </Typography>
      </Box>
      <Box sx={{ display: "flex" }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            width: "20%",
            gap: "10px",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              width: "90%",
              gap: "10px",
            }}
          >
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <form onSubmit={async (e) => await handleSubmit(e)}>
                <Box sx={{ display: "flex" }}>
                  <TextField
                    label="Test name"
                    variant="standard"
                    fullWidth
                    onChange={(e) => setTestName(e.target.value)}
                    required
                  />
                </Box>
                <Box sx={{ display: "flex", marginTop: "10px" }}>
                  <FormControl variant="standard" sx={{ width: "100%" }}>
                    <InputLabel id="status-select-label">Status</InputLabel>
                    <Select
                      labelId="status-select-label"
                      fullWidth
                      variant="standard"
                      id="status-select"
                      label="Status"
                      onChange={handleSelect}
                    >
                      <MenuItem value="Any">Any</MenuItem>
                      <MenuItem value="PASSED">Passed</MenuItem>
                      <MenuItem value="FAILED">Failed</MenuItem>
                      <MenuItem value="SKIPPED">Skipped</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
                <Box sx={{ display: "flex", marginTop: "30px" }}>
                  <Button
                    sx={{ width: "100%" }}
                    type="submit"
                    variant="outlined"
                    color="primary"
                  >
                    Submit
                  </Button>
                </Box>
              </form>
            </Box>
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            gap: "20px",
          }}
        >
          <Paper elevation={0} sx={{ width: "98%" }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <MaterialReactTable table={table} />
            </LocalizationProvider>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default SearchPage;
