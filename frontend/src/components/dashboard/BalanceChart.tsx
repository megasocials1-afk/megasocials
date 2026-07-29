import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const data = {
  labels: ['May 11', 'May 12', 'May 13', 'May 14', 'May 15', 'May 16', 'May 17'],
  datasets: [{
    label: 'Balance (₦)',
    data: [1000, 750, 500, 250, 0, 150, 850],
    borderColor: '#f5c518',
    backgroundColor: 'rgba(245, 197, 24, 0.1)',
    tension: 0.4,
    fill: true,
    pointBackgroundColor: '#f5c518',
  }],
};

const options = {
  responsive: true,
  plugins: {
    legend: { display: false },
    tooltip: {
      mode: 'index' as const,
      callbacks: {
        label: (context: any) => `₦${context.parsed.y}`,
      },
    },
  },
  scales: {
    x: {
      grid: { color: 'rgba(255,255,255,0.05)' },
      ticks: { color: '#9ca3af' },
    },
    y: {
      grid: { color: 'rgba(255,255,255,0.05)' },
      ticks: { color: '#9ca3af', callback: (value: number) => `₦${value}` },
    },
  },
};

export const BalanceChart = () => {
  return (
    <div className="bg-dark-card border border-dark-border rounded-xl p-5 transition-all duration-300 hover:border-gold/20">
      <h3 className="text-lg font-semibold text-white mb-4">Balance Overview</h3>
      <div className="h-56">
        <Line data={data} options={options} />
      </div>
    </div>
  );
};
