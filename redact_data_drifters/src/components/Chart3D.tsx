import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

interface Chart3DProps {
  data: any[];
  dataKey: string;
  xKey: string;
  height?: number;
  color?: string;
}

export function BarChart3D({ data, dataKey, xKey, height = 300, color = '#0ea5e9' }: Chart3DProps) {
  // Create 3D effect by rendering multiple offset bars
  const layers = 5;
  
  return (
    <div className="relative" style={{ height }}>
      {/* Background layers for 3D depth */}
      {Array.from({ length: layers }).map((_, i) => {
        const offset = (layers - i) * 2;
        const opacity = 0.15 - (i * 0.03);
        
        return (
          <div
            key={i}
            className="absolute inset-0"
            style={{
              transform: `translate(${offset}px, ${offset}px)`,
              zIndex: i,
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <Bar dataKey={dataKey} fill={color} fillOpacity={opacity} radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        );
      })}
      
      {/* Main chart on top */}
      <div className="absolute inset-0" style={{ zIndex: layers }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
            <XAxis 
              dataKey={xKey} 
              stroke="#94a3b8"
              tick={{ fill: '#94a3b8', fontSize: 10 }}
            />
            <YAxis 
              stroke="#94a3b8"
              tick={{ fill: '#94a3b8', fontSize: 10 }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(15, 23, 42, 0.95)', 
                border: '1px solid rgba(59, 130, 246, 0.3)',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '12px'
              }}
            />
            <Legend wrapperStyle={{ fontSize: '12px' }} />
            <Bar dataKey={dataKey} radius={[8, 8, 0, 0]}>
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={color}
                  style={{
                    filter: 'drop-shadow(2px 4px 6px rgba(0, 0, 0, 0.3))',
                  }}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

interface LineChart3DProps {
  data: any[];
  lines: { dataKey: string; color: string; name: string }[];
  xKey: string;
  height?: number;
}

export function LineChart3D({ data, lines, xKey, height = 300 }: LineChart3DProps) {
  return (
    <div 
      className="relative"
      style={{ 
        height,
        transform: 'perspective(1000px) rotateX(10deg) rotateY(-5deg)',
        transformStyle: 'preserve-3d',
      }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <defs>
            {lines.map((line) => (
              <linearGradient key={line.dataKey} id={`gradient-${line.dataKey}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={line.color} stopOpacity={0.8}/>
                <stop offset="95%" stopColor={line.color} stopOpacity={0.1}/>
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
          <XAxis 
            dataKey={xKey} 
            stroke="#94a3b8"
            tick={{ fill: '#94a3b8', fontSize: 10 }}
          />
          <YAxis 
            stroke="#94a3b8"
            tick={{ fill: '#94a3b8', fontSize: 10 }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'rgba(15, 23, 42, 0.95)', 
              border: '1px solid rgba(59, 130, 246, 0.3)',
              borderRadius: '8px',
              color: '#fff',
              fontSize: '12px'
            }}
          />
          <Legend wrapperStyle={{ fontSize: '12px' }} />
          {lines.map((line) => (
            <Bar 
              key={line.dataKey}
              dataKey={line.dataKey} 
              fill={`url(#gradient-${line.dataKey})`}
              name={line.name}
              radius={[8, 8, 0, 0]}
              style={{
                filter: 'drop-shadow(0px 4px 8px rgba(0, 0, 0, 0.4))',
              }}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
