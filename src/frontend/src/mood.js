import React from 'react';
import { RadialBarChart, RadialBar, Legend, Tooltip } from 'recharts';

const fake_data = [
    {
      name: "happy",
      uv: 20,
      fill: "#8884d8"
    },
    {
      name: "sad",
      uv: 3,
      fill: "#83a6ed"
    },
    {
      name: "angry",
      uv: 1,
      fill: "#8dd1e1"
    },
    {
      name: "calm",
      uv: 10,
      fill: "#82ca9d"
    },
    {
      name: "anxious",
      uv: 10,
      fill: "#a4de6c"
    }
  ];


const MoodTracker = ({ fake_data }) => {
  return (
    <RadialBarChart
      width={730}
      height={250}
      innerRadius="10%"
      outerRadius="80%"
      data={data}
      startAngle={180}
      endAngle={0}
    >
      <RadialBar
        minAngle={15}
        label={{ fill: '#666', position: 'insideStart' }}
        background
        clockWise={true}
        dataKey="uv"
      />
      <Legend
        iconSize={10}
        width={120}
        height={140}
        layout="vertical"
        verticalAlign="middle"
        align="right"
      />
      <Tooltip />
    </RadialBarChart>
  );
};

export default MoodRadialChart;


