import { Line } from 'react-chartjs-2';
import estres from './estres.json';
import emociones from './emocionesProm.json';
import 'chart.js/auto';

const preprocessData = (data, emotions) => {
  // Recorre los datos y los formatea
  const formattedData = data.map((entry) => {
    const [nivelEstres, time, date, category] = entry;
    return {
      nivelEstres: nivelEstres,
      time: time,
      date: date,
      category: category,
    };
  });

  // Agrupa los datos por fecha
  const groupedData = formattedData.reduce((acc, entry) => {
    const { date, nivelEstres, time, category } = entry;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push({ nivelEstres, time, category });
    return acc;
  }, {});

  // Procesa los datos de emociones
  const emotionsData = emotions.reduce((acc, entry) => {
    const [user, date, emotion] = entry;
    acc[date] = emotion;
    return acc;
  }, {});

  // Extrae las etiquetas (fechas) y los niveles de rendimiento
  const labels = Object.keys(groupedData).sort((a, b) => a.localeCompare(b));
  const nivelesEstres = labels.map((date) => {
    const dayData = groupedData[date];
    const averageEstres =
      dayData.reduce((sum, entry) => sum + parseInt(entry.nivelEstres, 10), 0) /
      dayData.length;
    return averageEstres.toFixed(2);
  });
  const times = labels.map((date) =>
    groupedData[date].map((entry) => entry.time).join(', ')
  );
  const emocionesPorDia = labels.map(
    (date) => emotionsData[date] || 'No se registraron emociones'
  );

  return { labels, nivelesEstres, times, emocionesPorDia };
};

const { nivelesEstres, labels, times, emocionesPorDia } = preprocessData(
  estres,
  emociones
);

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
          let label = [
            `Nivel de estres: ${nivelesEstres[context.dataIndex]}`,
            `Emociones: ${emocionesPorDia[context.dataIndex]}`,
          ];
          return label;
        },
      },
    },
  },
};

export const EstresPromEmociones = () => {
  return (
    <div>
      <h2>Niveles de estres promedio y emociones</h2>
      <Line data={data} options={options} />
    </div>
  );
};