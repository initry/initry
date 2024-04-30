"use client";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import { Test } from "@/client";
import Box from "@mui/material/Box";
import {
  Chip,
  Tooltip,
  TooltipProps,
  Typography,
  styled,
  tooltipClasses,
} from "@mui/material";
import { formatDuration, formatSeconds } from "@/tools/format-duration";
import InfoIcon from "@mui/icons-material/Info";
import { blue, grey } from "@mui/material/colors";
import { usePathname } from "next/navigation";

dayjs.extend(duration);

type TestWithPluginType = Test & {
  pluginType?: string | null;
  testSuite?: string | null;
  hostName?: string | null;
};

interface Props {
  data: TestWithPluginType;
}

const CustomTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(() => ({
  [`& .${tooltipClasses.tooltip}`]: {
    fontSize: 16,
  },
}));

export const TestDetails = ({ data }: Props) => {
  const pathname = usePathname();
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        width: "250px",
      }}
    >
      {data.pluginType === "pytest.xml" ? (
        <>
          <Box sx={{ display: "flex", flexDirection: "row" }}>
            <Box sx={{ display: "flex", width: "80px" }}>
              <CustomTooltip
                sx={{ fontSize: "20px" }}
                title='"started" and "stopped" timestamps are not available when using
                    Pytest JUnit XML as the only source of data'
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: "5px" }}>
                  <InfoIcon sx={{ fontSize: 16, color: blue[500] }} />{" "}
                  <Typography>Info</Typography>
                </Box>
              </CustomTooltip>
            </Box>
            <Box></Box>
          </Box>
          <Box sx={{ display: "flex", flexDirection: "row" }}>
            <Box sx={{ display: "flex", width: "80px" }}>
              <Typography sx={{ fontWeight: "bold" }}>Duration:</Typography>
            </Box>
            <Box sx={{ display: "flex", maxWidth: "160px" }}>
              {pathname.includes("test-runs")
                ? formatDuration(
                    data.startedAt as string,
                    data.stoppedAt as string,
                  )
                : formatSeconds((data as Partial<Test>).duration as number)}
            </Box>
          </Box>
        </>
      ) : (
        <>
          <Box sx={{ display: "flex", flexDirection: "row", gap: "10px" }}>
            <Box sx={{ display: "flex", width: "80px" }}>
              <Typography sx={{ fontWeight: "bold" }}>Started:</Typography>
            </Box>
            <Box>
              {dayjs(data?.startedAt as string)
                .format("DD MMM YYYY HH:mm:ss")
                .toString()}
            </Box>
          </Box>
          {data.stoppedAt && (
            <Box sx={{ display: "flex", flexDirection: "row", gap: "10px" }}>
              <Box sx={{ display: "flex", width: "80px" }}>
                <Typography sx={{ fontWeight: "bold" }}>Stopped:</Typography>
              </Box>
              <Box>
                {dayjs(data?.stoppedAt as string)
                  .format("DD MMM YYYY HH:mm:ss")
                  .toString()}
              </Box>
            </Box>
          )}
          {data.stoppedAt && (
            <Box sx={{ display: "flex", flexDirection: "row", gap: "10px" }}>
              <Box sx={{ display: "flex", width: "80px" }}>
                <Typography sx={{ fontWeight: "bold" }}>Duration:</Typography>
              </Box>
              <Box>
                {formatDuration(
                  data?.startedAt as string,
                  data?.stoppedAt as string,
                ).toString()}
              </Box>
            </Box>
          )}
        </>
      )}
      <Box sx={{ display: "flex", flexDirection: "row", gap: "10px" }}>
        <Box sx={{ display: "flex", width: "80px" }}>
          <Typography sx={{ fontWeight: "bold" }}>Source:</Typography>
        </Box>
        <Box>
          {data.pluginType === "pytest.initry" && (
            <Chip
              size="small"
              label="pytest-initry"
              color="info"
              variant="outlined"
            />
          )}
          {data.pluginType === "pytest.xml" && (
            <>
              <Chip
                size="small"
                label="Pytest JUnit XML"
                sx={{ backgroundColor: grey[100] }}
                variant="outlined"
              />
            </>
          )}
          {data.pluginType === "pytest.initry.xml" && (
            <>
              <Chip
                size="small"
                label="pytest-initry + JUnit XML"
                color="info"
                variant="outlined"
              />
            </>
          )}
        </Box>
      </Box>
      {data.testSuite && (
        <Box sx={{ display: "flex", flexDirection: "row", gap: "10px" }}>
          <Box sx={{ display: "flex", width: "80px" }}>
            <Typography sx={{ fontWeight: "bold" }}>Testsuite:</Typography>
          </Box>
          <Box>{data.testSuite}</Box>
        </Box>
      )}
      {data.hostName && (
        <Box sx={{ display: "flex", flexDirection: "row", gap: "10px" }}>
          <Box sx={{ display: "flex", width: "80px" }}>
            <Typography sx={{ fontWeight: "bold" }}>Hostname:</Typography>
          </Box>
          <Box>{data.hostName}</Box>
        </Box>
      )}
    </Box>
  );
};
