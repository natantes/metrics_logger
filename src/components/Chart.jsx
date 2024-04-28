import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
} from "chart.js";
import { Box } from "@mui/material";
import { convertKgToLbs } from "../utilities/functions";
import "chartjs-adapter-date-fns";

// Register the Chart.js components and the Time scale
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

const gradientBgPlugin = {
  id: "gradientBg",
  beforeDatasetsDraw: (chart) => {
    const ctx = chart.ctx;
    const chartArea = chart.chartArea;
    const dataset = chart.getDatasetMeta(0);
    if (!chartArea || !dataset.data.length) {
      return;
    }

    ctx.save();

    // Start path at the first point
    ctx.beginPath();
    ctx.moveTo(dataset.data[0].x, chartArea.bottom);

    // Draw line along the dataset points
    dataset.data.forEach((point, index) => {
      ctx.lineTo(point.x, point.y);
    });

    // Complete the path back to the start
    ctx.lineTo(dataset.data[dataset.data.length - 1].x, chartArea.bottom);
    ctx.closePath();

    // Create gradient
    const gradient = ctx.createLinearGradient(
      0,
      chartArea.bottom,
      0,
      chartArea.top
    );
    gradient.addColorStop(0, "rgba(119, 221, 118, 0.3)");
    gradient.addColorStop(1, "rgba(255, 105, 98, 0.3)");

    // Fill the area under the line plot
    ctx.fillStyle = gradient;
    ctx.fill();
    ctx.restore();
  },
};

ChartJS.register(gradientBgPlugin);

const StyledWeightChart = ({ data, unit }) => {
  const sortedData = [...data].sort((a, b) => a.timestamp - b.timestamp);

  const chartData = {
    labels: sortedData.map((d) => d.timestamp),
    datasets: [
      {
        label: `Weight (${unit})`,
        data: sortedData.map((d) =>
          unit === "kg" ? d.weight : convertKgToLbs(d.weight)
        ),
        backgroundColor: "transparent",
        pointBorderWidth: 1,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.2,
      },
    ],
  };

  const options = {
    scales: {
      x: {
        type: "time",
        time: {
          parser: "yyyy-MM-dd",
          unit: "day",
          displayFormats: {
            day: "MM/dd/yy",
          },
        },
        title: {
          display: true,
          text: "Date",
        },
        grid: {
          display: false,
        },
      },
      y: {
        title: {
          display: true,
          text: `Weight (${unit})`,
        },
        grid: {
          color: "#D3D3D3",
        },
        border: {
          dash: [6, 10],
        },
      },
    },
    plugins: {
      legend: {
        display: true,
      },
    },
    maintainAspectRatio: false,
    responsive: true,
  };

  
  return (
    <Box
      sx={{
        border: 2,
        borderColor: "accent.main",
        borderRadius: 4,
        padding: 2,
        width: "65%",
        minHeight: "350px",
        height: "auto",
        margin: "auto",
        marginTop: "30px",
        marginBottom: "30px",
      }}
    >
      <Line data={chartData} options={options} />
    </Box>
  );
};

export default StyledWeightChart;
