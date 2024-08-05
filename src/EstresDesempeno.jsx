import { Line } from 'react-chartjs-2';
import estres from './estres.json';
import desempenoAutopercibido from './desempenoAutopercibido.json';
import 'chart.js/auto';

const preprocessData = (data, isPerformance = false) => {
  const formattedData = data.map((entry) => {
    if (isPerformance) {
      const [, date, time, nivel, , category] = entry;
      return { nivel: parseFloat(nivel), time, date, category };
    } else {
      const [nivelEstres, time, date, category] = entry;
      return { nivel: nivelEstres, time, date, category };
    }
  });

  formattedData.sort((a, b) => a.date.localeCompare(b.date));

  const niveles = formattedData.map((entry) => entry.nivel);
  const labels = formattedData.map((entry) => entry.date);
  const times = formattedData.map((entry) => entry.time);
  const categories = formattedData.map((entry) => entry.category);

  return { labels, niveles, times, categories };
};

const estresData = preprocessData(estres);
const desempenoData = preprocessData(desempenoAutopercibido, true);

const data = {
  labels: estresData.labels,
  datasets: [
    {
      label: 'Estrés',
      data: estresData.niveles,
      fill: false,
      borderColor: 'rgba(75,112,192,1)',
      yAxisID: 'y-axis-estres',
    },
    {
      label: 'Desempeño',
      data: desempenoData.niveles,
      fill: false,
      borderColor: 'rgba(192,75,75,1)',
      yAxisID: 'y-axis-desempeno',
    },
  ],
};

function traducirCategoria(category) {
  // ... (keep your existing function)
}

const options = {
  scales: {
    'y-axis-estres': {
      type: 'linear',
      position: 'left',
      title: {
        display: true,
        text: 'Nivel de Estrés',
      },
    },
    'y-axis-desempeno': {
      type: 'linear',
      position: 'right',
      title: {
        display: true,
        text: 'Nivel de Desempeño',
      },
    },
  },
  plugins: {
    tooltip: {
      callbacks: {
        label: function (context) {
          const datasetLabel = context.dataset.label;
          const value = context.parsed.y;
          const index = context.dataIndex;
          const time = context.dataset.label === 'Estrés' ? estresData.times[index] : desempenoData.times[index];
          const category = context.dataset.label === 'Estrés' ? estresData.categories[index] : desempenoData.categories[index];
          
          return [
            `${datasetLabel}: ${value}`,
            `Categoría: ${traducirCategoria(category)}`,
            `Hora: ${time}`,
          ];
        },
      },
    },
  },
};

export const EstresDesempeno = () => {
  return (
    <div>
      <h2>Niveles de Estrés y Desempeño</h2>
      <Line data={data} options={options} />
    </div>
  );
};