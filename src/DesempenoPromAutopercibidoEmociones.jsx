import { Line } from 'react-chartjs-2';
import desempenoPromAutopercibido from './desempenoPromAutopercibido.json';
import emocionesProm from './emocionesProm.json'; // Assuming you have emotions data in a separate JSON file
import 'chart.js/auto';

const preprocessData = (data, emotions) => {
  // Map through the data and format it
  const formattedData = data.map((entry) => {
    const [, date, performance] = entry; // Destructure to skip 'user'
    return {
      date: date,
      performance: performance,
    };
  });

  // Sort the data by date
  formattedData.sort((a, b) => a.date.localeCompare(b.date));

  // Process emotions data
  const emotionsData = emotions.reduce((acc, entry) => {
    const [, date, emotion] = entry;
    acc[date] = emotion;
    return acc;
  }, {});

  // Extract labels (dates) and performance levels
  const labels = formattedData.map((entry) => entry.date);
  const performances = formattedData.map((entry) => entry.performance);
  const emocionesPorDia = labels.map(date => emotionsData[date] || 'No emotions recorded');

  return { labels, performances, emocionesPorDia };
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
  }
};

const { labels, performances, emocionesPorDia } = preprocessData(desempenoPromAutopercibido, emocionesProm);

const data = {
  labels: labels,
  datasets: [
    {
      label: 'Desempeño',
      data: performances.map(performanceToValue),
      fill: false,
      borderColor: 'rgba(75,112,192,1)',
    },
  ],
};

const options = {
  scales: {
    y: {
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
          }
        },
      },
    },
  },
  plugins: {
    tooltip: {
      callbacks: {
        label: function (context) {
          let label = [
            `Desempeño: ${performances[context.dataIndex]}`,
            `Emociones: ${emocionesPorDia[context.dataIndex]}`
          ];
          return label;
        },
      },
    },
  },
};

export const DesempenoPromAutopercibidoEmociones = () => {
  return (
    <div>
      <h2>Desempeño promedio autopercibido y emociones</h2>
      <Line data={data} options={options} />
    </div>
  );
};