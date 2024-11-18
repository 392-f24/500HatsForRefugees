import React, { useEffect, useRef } from 'react';
import { Chart } from 'chart.js/auto';
import './Graph.css';

const Graph = () => {
  const chartRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    // Check if a chart instance already exists and destroy it if necessary
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    // Create the chart and store the instance in chartRef
    const ctx = canvasRef.current.getContext('2d');
    chartRef.current = new Chart(ctx, {
      type: 'bar', // Change type as needed
      data: {
        labels: ['January', 'February', 'March', 'April', 'May'],
        datasets: [
          {
            label: 'Donations Over Time',
            data: [150, 200, 250, 300, 350],
            backgroundColor: 'rgba(54, 162, 235, 0.5)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
      },
    });

    // Cleanup function to destroy the chart on component unmount
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, []); // Run only once when the component mounts

  return <canvas ref={canvasRef} id="adminChart"></canvas>;
};

export default Graph;
