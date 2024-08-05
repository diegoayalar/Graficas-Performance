import { Line } from 'react-chartjs-2';
import desempenoAutopercibido from './desempenoAutopercibido.json';
import 'chart.js/auto';

const preprocessData = (data) => {
  // Map through the data and format it
  const formattedData = data.map((entry) => {
    const [, date, time, score, activity, performance] = entry;
    return {
      date: date,
      time: time,
      score: parseInt(score, 10),
      activity: activity,
      performance: performance,
    };
  });

  // Sort the data by date
  formattedData.sort((a, b) => a.date - b.date);

  // Extract labels (dates) and data points (scores)
  const labels = formattedData.map((entry) => entry.date);
  const times = formattedData.map((entry) => entry.time);
  const scores = formattedData.map((entry) => entry.score);
  const activities = formattedData.map((entry) => entry.activity);
  const performances = formattedData.map((entry) => entry.performance);

  return { labels, times, scores, activities, performances };
};

const { labels, times, scores, activities, performances } = preprocessData(
  desempenoAutopercibido
);

const data = {
  labels: labels,
  datasets: [
    {
      label: 'Desempeño',
      data: scores,
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
          callback: function(value) {
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
          }
        },
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context) {
            let label = [
              `Desempeño: ${performances[context.dataIndex]}`,
              `Hora: ${times[context.dataIndex]}`,
              `Actividad: ${activities[context.dataIndex]}`
            ];
            return label;
          },
        },
      },
    },
  };

export const DesempenoAutopercibido = () => {
  return (
    <div>
      <h2>Desempeño autopercibido</h2>
      <Line data={data} options={options} />
    </div>
  );
};
