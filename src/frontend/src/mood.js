import React from 'react';
import { RadialBarChart, RadialBar, Legend, Tooltip } from 'recharts';


function MoodTracker({data}) {  
    
    return (
        <div style={{'justify-items': 'center'}}>
            <h1>Mood Tracker</h1>
                <RadialBarChart
                    width={550}
                    height={600}
                    innerRadius="50%"
                    outerRadius="130%"
                    data={data}
                    startAngle={180}
                    endAngle={0}
                >
                    <RadialBar
                    minAngle={15}
                    label={false}
                    background
                    clockWise={true}
                    dataKey="count"
                    />
                    <Legend
                    iconSize={15}
                    width={200}
                    height={200}
                    layout="horizontal"
                    align="center"
                    wrapperStyle={{
                        top: '60%',
                        transform: 'translateY(-10%)',}}/>
                    <Tooltip
                        content={({ payload }) => {
                            if (!payload || payload.length === 0) return null;

                            const {value} = payload[0];

                            return (
                            <div style={{ backgroundColor: '#fff', border: '1px solid #ccc', borderRadius: '5px', padding: '5px' }}>
                                <p>{`${((value / 30) * 100).toFixed(2)}%`}</p>
                            </div>
                            );
                        }}
                        contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc', borderRadius: '5px' }}
                    />
                </RadialBarChart>
        </div>
    );
  };
  
  export default MoodTracker;