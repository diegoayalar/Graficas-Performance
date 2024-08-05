import { Line } from 'react-chartjs-2';
import emociones from './emociones.json';
import 'chart.js/auto';

const preprocessData = (data) => {
  // Map through the data and format it
  const formattedData = data.map((entry) => {
    const [, date, time, activity, , , , performance, , emotions] = entry;
    return {
      date: date,
      time: time,
      performance: performance,
      activity: activity,
      emotions: emotions,
    };
  });

  // Sort the data by date
  formattedData.sort((a, b) => a.date.localeCompare(b.date));

  // Extract labels (dates) and data points (scores)
  const labels = formattedData.map((entry) => entry.date);
  const times = formattedData.map((entry) => entry.time);
  const performances = formattedData.map((entry) => entry.performance);
  const activities = formattedData.map((entry) => entry.activity);
  const emotions = formattedData.map((entry) => entry.emotions);

  return { labels, times, performances, activities, emotions };
};

const { labels, times, performances, activities, emotions } =
  preprocessData(emociones);

const data = {
  labels: labels,
  datasets: [
    {
      label: 'Desempeño',
      data: performances,
      fill: false,
      borderColor: 'rgba(75, 112, 192, 1)',
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
            default:
              return '';
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
            `Desempeño: ${getPerformanceLabel(
              performances[context.dataIndex]
            )}`,
            `Hora: ${times[context.dataIndex]}`,
            `Actividad: ${activities[context.dataIndex]}`,
            `Emociones: ${emotions[context.dataIndex]}`,
          ];
          return label;
        },
      },
    },
  },
};

const getPerformanceLabel = (score) => {
  switch (score) {
    case '1':
      return 'Muy bajo';
    case '2':
      return 'Bajo';
    case '3':
      return 'Regular';
    case '4':
      return 'Alto';
    case '5':
      return 'Muy alto';
    default:
      return score;
  }
};

export const DesempenoAutopercibidoEmociones = () => {
  return (
    <div>
      <h2>Desempeño autopercibido y emociones</h2>
      <Line data={data} options={options} />
    </div>
  );
};
