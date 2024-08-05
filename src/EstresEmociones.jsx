import { Line } from 'react-chartjs-2';
import estres from './estres.json';
import emociones from './emociones.json';
import 'chart.js/auto';

const roundToNearestHour = (time) => {
  const [hour, minute, period] = time.split(':');
  const hourInt = parseInt(hour, 10);
  const minuteInt = parseInt(minute, 10);
  
  let adjustedHour = hourInt;
  
  if (period.includes('p') && hourInt !== 12) {
    adjustedHour += 12;
  } else if (period.includes('a') && hourInt === 12) {
    adjustedHour = 0;
  }
  
  if (minuteInt >= 30) {
    adjustedHour = (adjustedHour + 1) % 24;
  }
  
  return `${adjustedHour.toString().padStart(2, '0')}:00`;
};

const preprocessData = (data, emociones) => {
  // Formatea y agrupa los datos de estrés por fecha y hora redondeada
  const formattedData = data.map((entry) => {
    const [nivelEstres, time, date, category] = entry;
    const roundedTime = roundToNearestHour(time);
    return { nivelEstres, time: roundedTime, date, category };
  });

  const groupedData = formattedData.reduce((acc, entry) => {
    const { date, time, nivelEstres, category } = entry;
    const dateTime = `${date} ${time}`;
    if (!acc[dateTime]) {
      acc[dateTime] = [];
    }
    acc[dateTime].push({ nivelEstres, category });
    return acc;
  }, {});

  // Procesa correctamente los datos de emociones
  const emocionesData = emociones.reduce((acc, entry) => {
    const [user, date, time, stressLevel, activity, valence, arousal, dominance, NA, emotions] = entry;
    const roundedTime = roundToNearestHour(time);
    const dateTime = `${date} ${roundedTime}`;
    acc[dateTime] = emotions; // Extrae las emociones correctas del último campo
    return acc;
  }, {});

  // Extrae etiquetas (fecha y hora) y niveles promedio de estrés
  const labels = Object.keys(groupedData).sort((a, b) => a.localeCompare(b));
  const nivelesEstres = labels.map((dateTime) => {
    const dayData = groupedData[dateTime];
    const averageEstres =
      dayData.reduce((sum, entry) => sum + parseInt(entry.nivelEstres, 10), 0) /
      dayData.length;
    return averageEstres.toFixed(2);
  });
  const emocionesPorDia = labels.map(
    (dateTime) => emocionesData[dateTime] || 'No se registraron emociones'
  );

  return { labels, nivelesEstres, emocionesPorDia };
};

const { nivelesEstres, labels, emocionesPorDia } = preprocessData(estres, emociones);

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

export const EstresEmociones = () => {
  return (
    <div>
      <h2>Niveles de estres y emociones</h2>
      <Line data={data} options={options} />
    </div>
  );
};
