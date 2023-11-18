import React, { useEffect, useState } from "react";
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
} from "chart.js";
import {
  collection,
  addDoc,
  orderBy,
  query,
  onSnapshot,
} from "firebase/firestore";
import { db } from "./firebase";
import { TextField, Button, Grid } from "@mui/material";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const WeightChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const weightsRef = collection(db, "weights");
    const q = query(weightsRef, orderBy("timestamp"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newData = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
        timestamp: doc.data().timestamp.toDate(),
      }));
      setData(newData);
    });

    return () => unsubscribe();
  }, []);

  const chartData = {
    labels: data.map((d) => d.timestamp.toLocaleDateString()),
    datasets: [
      {
        label: "Weight",
        data: data.map((d) => d.weight),
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  };

  return <Line data={chartData} />;
};

export default WeightChart;
