import React from 'react';
import { Line } from 'react-chartjs-2';
import desempenoPromAutopercibido from './desempenoPromAutopercibido.json';
import estres from './estres.json';
import 'chart.js/auto';

const preprocessDesempenoData = (data) => {
  const formattedData = data.map((entry) => {
    const [, date, performance] = entry;
    return {
      date: date,
      performance: performance,
    };
  });

  formattedData.sort((a, b) => a.date.localeCompare(b.date));

  const labels = formattedData.map((entry) => entry.date);
  const performances = formattedData.map((entry) => entry.performance);

  return { labels, performances };
};

const performanceToValue = (performance) => {
  switch (performance) {
    case 'muy bajo':
      return 1;
    case 'debajo del promedio':
      return 2;
    case 'promedio':
      return 3;
    case 'arriba del promedio':
      return 4;
    case 'muy alto':
      return 5;
    default:
      return 0;
  }
};

const { labels: desempenoLabels, performances: desempenoPerformances } = preprocessDesempenoData(desempenoPromAutopercibido);

const preprocessEstresData = (data) => {
  const formattedData = data.map((entry) => {
    const [nivelEstres, time, date, category] = entry;
    return {
      nivelEstres: nivelEstres,
      time: time,
      date: date,
      category: category,
    };
  });

  const groupedData = formattedData.reduce((acc, entry) => {
    const { date, nivelEstres } = entry;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push({ nivelEstres });
    return acc;
  }, {});

  const labels = Object.keys(groupedData).sort((a, b) => a.localeCompare(b));
  const nivelesEstres = labels.map(date => {
    const dayData = groupedData[date];
    const averageEstres = dayData.reduce((sum, entry) => sum + parseInt(entry.nivelEstres, 10), 0) / dayData.length;
    return averageEstres.toFixed(2);
  });

  return { labels, nivelesEstres };
};

const { labels: estresLabels, nivelesEstres } = preprocessEstresData(estres);

// Combine the datasets into one chart with different y-axes
const chartData = {
  labels: desempenoLabels,
  datasets: [
    {
      label: 'Desempeño',
      data: desempenoPerformances.map(performanceToValue),
      fill: false,
      borderColor: 'rgba(75, 112, 192, 1)',
      yAxisID: 'performance', // Assigning yAxisID for performance data
    },
    {
      label: 'Nivel de Estres',
      data: nivelesEstres,
      fill: false,
      borderColor: 'rgba(192, 75, 112, 1)',
      yAxisID: 'stress', // Assigning yAxisID for stress level data
    }
  ],
};

const chartOptions = {
  scales: {
    stress: { // y-axis for stress level data
      type: 'linear',
      position: 'left',
      ticks: {
        min: 0,
        callback: function (value) {
          return value.toFixed(2); // Show stress values with 2 decimal places
        },
      },
      grid: {
        drawOnChartArea: true, // Draw grid lines on the chart area
      },
    },
    performance: { // y-axis for performance data
      type: 'linear',
      position: 'left',
      ticks: {
        stepSize: 1,
        min: 1,
        max: 5,
        callback: function (value) {
          switch (value) {
            case 1:
              return 'Muy bajo';
            case 2:
              return 'Bajo';
            case 3:
              return 'Regular';
            case 4:
              return 'Alto';
            case 5:
              return 'Muy alto';
            default:
              return '';
          }
        },
      },
      grid: {
        drawOnChartArea: false, // Avoid drawing grid lines for the second axis
      },
    },
  },
  plugins: {
    tooltip: {
      callbacks: {
        label: function (context) {
          const dataIndex = context.dataIndex;
          if (context.datasetIndex === 0) {
            // For performance dataset
            const desempenoValue = desempenoPerformances[dataIndex];
            return `Desempeño: ${desempenoValue}`;
          } else if (context.datasetIndex === 1) {
            // For stress dataset
            const estresValue = nivelesEstres[dataIndex];
            return `Nivel de estres: ${estresValue}`;
          }
          return '';
        },
      },
    },
  },
};

export const EstresPromDesempenoProm = () => {
  return (
    <div>
      <h2>Desempeño y Niveles de Estres</h2>
      <Line data={chartData} options={chartOptions} />
    </div>
  );
};