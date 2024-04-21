import * as React from "react";
import { LineChart } from "@mui/x-charts/LineChart";

const uData = [4000, 3000, 2000, 2780, 1890, 2390, 3490];
const pData = [2400, 1398, 9800, 3908, 4800, 3800, 4300];
const xLabels = [
  "Jan",
  "Feb",
  "Mat",
  "Apri",
  "May",
  "June",
  "July",
  "Aug",
  "Oct",
  "Nov",
  "Dec",
];

export default function SimpleLineChart({ data, labels }) {
  return (
    <LineChart
      /* width={500} */
      /* height={300} */
      series={data}
      xAxis={[{ scaleType: "point", data: labels }]}
    />
  );
}
