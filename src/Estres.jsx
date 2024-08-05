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

  // Sort the data by date
  formattedData.sort((a, b) => a.date.localeCompare(b.date));

  // Extract labels (dates) and performance levels
  const nivelesEstres = formattedData.map((entry) => entry.nivelEstres);
  const labels = formattedData.map((entry) => entry.date);
  const times = formattedData.map((entry) => entry.time);
  const categories = formattedData.map((entry) => entry.category);

  return { labels, nivelesEstres, times, categories };
};

const { nivelesEstres, labels, times, categories } = preprocessData(estres);

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

function traducirCategoria(category) {
    switch (category.toLowerCase()) {
      case 'low':
        return 'Bajo';
      case 'average':
        return 'Promedio';
      case 'moderate':
        return 'Moderado';
      case 'high':
        return 'Alto';
      case 'very low':
        return 'Muy bajo';
      default:
        return category;
    }
  }

const options = {
  plugins: {
    tooltip: {
      callbacks: {
        label: function (context) {
          let label = [
            `Nivel de estres: ${nivelesEstres[context.dataIndex]}`,
            `Categoría: ${traducirCategoria(categories[context.dataIndex])}`,
            `Hora: ${times[context.dataIndex]}`,
          ];
          return label;
        },
      },
    },
  },
};

export const Estres = () => {
  return (
    <div>
      <h2>Niveles de estres</h2>
      <Line data={data} options={options} />
    </div>
  );
};
