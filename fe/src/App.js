import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import './App.css';

ChartJS.register(ArcElement, Tooltip, Legend);

function App() {
  const [systemInfo, setSystemInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSystemInfo();
    const intervalId = setInterval(() => {
      fetchSystemInfo();
    }, 10000); 

    return () => clearInterval(intervalId);
  }, []);

  const fetchSystemInfo = async () => {
    try {
      const response = await fetch('http://localhost:5147/api/HienThi');
      console.log(response.status, response.statusText); 
      if (!response.ok) {
        throw new Error('lỗi khi kết nối đến API');
      }
      const data = await response.json();
      setSystemInfo(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatBytes = (bytes) => {
    const gb = bytes / (1024 * 1024 * 1024);
    return gb.toFixed(2) + ' GB';
  };

  const getRamChartData = () => {
    if (!systemInfo) return null;
    
    return {
      labels: ['Used RAM', 'Free RAM'],
      datasets: [
        {
          data: [systemInfo.ram.used, systemInfo.ram.free],
          backgroundColor: ['#FF6B6B', '#4ECDC4'],
          borderColor: ['#FF5252', '#26A69A'],
          borderWidth: 1,
        },
      ],
    };
  };

  const getDiskChartData = (disk) => {
    return {
      labels: ['Used Space', 'Free Space'],
      datasets: [
        {
          data: [disk.used, disk.free],
          backgroundColor: ['#FFB74D', '#81C784'],
          borderColor: ['#FF9800', '#4CAF50'],
          borderWidth: 1,
        },
      ],
    };
  };

  const getCpuChartData = () => {
    if (!systemInfo) return null;
    
    const usage = systemInfo.cpu.usagePercentage;
    const free = 100 - usage;
    
    return {
      labels: ['CPU Usage', 'CPU Free'],
      datasets: [
        {
          data: [usage, free],
          backgroundColor: ['#F06292', '#E0E0E0'],
          borderColor: ['#E91E63', '#BDBDBD'],
          borderWidth: 1,
        },
      ],
    };
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.parsed;
            
            if (label.includes('RAM') || label.includes('Space')) {
              return `${label}: ${formatBytes(value)}`;
            } else if (label.includes('CPU')) {
              return `${label}: ${value.toFixed(2)}%`;
            }
            return `${label}: ${value}`;
          }
        }
      }
    },
  };

  if (loading) return <div className="loading">Loading system information...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (!systemInfo) return <div className="error">No data available</div>;

  return (
    <div className="App">
      <header className="App-header">
        <h1>System Information Dashboard</h1>
      </header>
      
      <div className="dashboard">
        <div className="system-info">
          <div className="info-card">
            <h3>CPU Information</h3>
            <p><strong>Name:</strong> {systemInfo.cpu.name.trim()}</p>
            <p><strong>Logical Cores:</strong> {systemInfo.cpu.logicalCores}</p>
            <p><strong>Usage:</strong> {systemInfo.cpu.usagePercentage.toFixed(2)}%</p>
          </div>
          
          <div className="info-card">
            <h3>RAM Information</h3>
            <p><strong>Total:</strong> {formatBytes(systemInfo.ram.total)}</p>
            <p><strong>Used:</strong> {formatBytes(systemInfo.ram.used)}</p>
            <p><strong>Free:</strong> {formatBytes(systemInfo.ram.free)}</p>
          </div>
        </div>

        <div className="charts-container">
          <div className="chart-section">
            <h3>RAM Usage</h3>
            <div className="chart-wrapper">
              <Pie data={getRamChartData()} options={chartOptions} />
            </div>
          </div>

          <div className="chart-section">
            <h3>CPU Usage</h3>
            <div className="chart-wrapper">
              <Pie data={getCpuChartData()} options={chartOptions} />
            </div>
          </div>

          {systemInfo.disks.map((disk, index) => (
            <div key={index} className="chart-section">
              <h3>Disk {disk.name} Usage</h3>
              <div className="disk-info">
                <p><strong>Total:</strong> {formatBytes(disk.total)}</p>
                <p><strong>Used:</strong> {formatBytes(disk.used)}</p>
                <p><strong>Free:</strong> {formatBytes(disk.free)}</p>
              </div>
              <div className="chart-wrapper">
                <Pie data={getDiskChartData(disk)} options={chartOptions} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;