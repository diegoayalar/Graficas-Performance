import { Line } from 'react-chartjs-2';
import estres from './estres.json';
import 'chart.js/auto';

const preprocessData = (data) => {
  // Map through the data and format it
  const formattedData = data.map((entry) => {
    const [nivelEstres, time, date, category] = entry;
    return {
      nivelEstres: nivelEstres,
      time: time,
      date: date,
      category: category,
    };
  });

  // Group data by date
  const groupedData = formattedData.reduce((acc, entry) => {
    const { date, nivelEstres, time, category } = entry;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push({ nivelEstres, time, category });
    return acc;
  }, {});

  // Extract labels (dates) and performance levels
  const labels = Object.keys(groupedData).sort((a, b) => a.localeCompare(b));
  const nivelesEstres = labels.map(date => {
    const dayData = groupedData[date];
    const averageEstres = dayData.reduce((sum, entry) => sum + parseInt(entry.nivelEstres, 10), 0) / dayData.length;
    return averageEstres.toFixed(2);
  });
  const times = labels.map(date => groupedData[date].map(entry => entry.time).join(', '));

  return { labels, nivelesEstres, times };
};

const { nivelesEstres, labels, times } = preprocessData(estres);

const data = {
  labels: labels,
  datasets: [
    {
      label: 'Estres',
      data: nivelesEstres,
      fill: false,
      borderColor: 'rgba(75,112,192,1)',
    },
  ],
};

const options = {
  plugins: {
    tooltip: {
      callbacks: {
        label: function (context) {
          return `Nivel de estres: ${nivelesEstres[context.dataIndex]}`;
        },
      },
    },
  },
};

export const EstresProm = () => {
  return (
    <div>
      <h2>Niveles de estres promedio</h2>
      <Line data={data} options={options} />
    </div>
  );
};