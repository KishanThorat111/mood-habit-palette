
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { theme } from '@/utils/theme';
import { storage, DayData } from '@/utils/storage';

const History: React.FC = () => {
  const [selectedDay, setSelectedDay] = useState<string>('');
  const [weekData, setWeekData] = useState<any[]>([]);
  const [moodData, setMoodData] = useState<DayData[]>([]);

  useEffect(() => {
    const data = storage.getMoodData();
    setMoodData(data);
    
    // Generate last 7 days of data
    const last7Days = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateString = date.toISOString().split('T')[0];
      const dayData = data.find(d => d.date === dateString);
      
      const completedHabits = dayData ? dayData.habits.filter(h => h.completed).length : 0;
      const totalHabits = dayData ? dayData.habits.length : storage.getHabits().length;
      const mood = dayData ? dayData.mood || 0 : 0;
      
      last7Days.push({
        date: dateString,
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        fullDate: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        completedHabits,
        totalHabits,
        completionRate: totalHabits > 0 ? (completedHabits / totalHabits) * 100 : 0,
        mood: mood * 20, // Scale 1-5 to 20-100 for visualization
        moodValue: mood,
        habits: dayData?.habits || [],
      });
    }
    
    setWeekData(last7Days);
    setSelectedDay(last7Days[last7Days.length - 1]?.date || '');
  }, []);

  const selectedDayData = weekData.find(d => d.date === selectedDay);

  const customTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border">
          <p className="font-medium">{label}</p>
          <p style={{ color: theme.colors.primary }}>
            Habits: {payload[0].payload.completedHabits}/{payload[0].payload.totalHabits}
          </p>
          <p style={{ color: theme.colors.secondary }}>
            Mood: {payload[0].payload.moodValue}/5
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen p-4" style={{ background: 'linear-gradient(to bottom, #f8fafc, #e2e8f0)' }}>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2" style={{ color: theme.colors.textDark }}>
          Your Week in Review
        </h1>
        <p style={{ color: theme.colors.textLight }}>
          Track your progress and mood patterns
        </p>
      </div>
      
      {/* Day Selector */}
      <div className="mb-6">
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {weekData.map((day) => (
            <button
              key={day.date}
              onClick={() => setSelectedDay(day.date)}
              className="flex-shrink-0 px-4 py-2 rounded-lg font-medium transition-all duration-200"
              style={{
                backgroundColor: selectedDay === day.date ? theme.colors.secondary : 'rgba(255, 255, 255, 0.7)',
                color: selectedDay === day.date ? 'white' : theme.colors.textDefault,
                border: selectedDay === day.date ? 'none' : '1px solid rgba(0, 0, 0, 0.1)',
              }}
            >
              <div className="text-center">
                <div className="text-sm">{day.day}</div>
                <div className="text-xs">{day.fullDate}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
      
      {/* Chart */}
      <div 
        className="p-4 rounded-xl backdrop-blur-md mb-6"
        style={{
          background: theme.colors.glassCard,
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: theme.shadow.glass,
        }}
      >
        <h3 className="text-lg font-semibold mb-4" style={{ color: theme.colors.textDark }}>
          Habits & Mood Trend
        </h3>
        
        {weekData.length > 0 ? (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={weekData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <XAxis 
                dataKey="day" 
                axisLine={false}
                tickLine={false}
                style={{ fontSize: '12px', fill: theme.colors.textLight }}
              />
              <YAxis hide />
              <Tooltip content={customTooltip} />
              <Legend />
              <Bar 
                dataKey="completionRate" 
                fill={theme.colors.primary} 
                name="Habit Completion %" 
                radius={[4, 4, 0, 0]}
              />
              <Bar 
                dataKey="mood" 
                fill={theme.colors.secondary} 
                name="Mood Index" 
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-48">
            <p style={{ color: theme.colors.textLight }}>
              No data yet. Start tracking your habits!
            </p>
          </div>
        )}
      </div>
      
      {/* Selected Day Details */}
      {selectedDayData && (
        <div 
          className="p-4 rounded-xl backdrop-blur-md"
          style={{
            background: theme.colors.glassCard,
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: theme.shadow.glass,
          }}
        >
          <h3 className="text-lg font-semibold mb-3" style={{ color: theme.colors.textDark }}>
            {selectedDayData.fullDate} Details
          </h3>
          
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span style={{ color: theme.colors.textDefault }}>
                Habits Completed
              </span>
              <span className="font-medium" style={{ color: theme.colors.primary }}>
                {selectedDayData.completedHabits}/{selectedDayData.totalHabits}
              </span>
            </div>
            <div className="flex items-center justify-between mb-4">
              <span style={{ color: theme.colors.textDefault }}>
                Mood
              </span>
              <span className="font-medium">
                {selectedDayData.moodValue ? `${selectedDayData.moodValue}/5` : 'Not recorded'}
              </span>
            </div>
          </div>
          
          {selectedDayData.habits.length > 0 && (
            <div>
              <h4 className="font-medium mb-2" style={{ color: theme.colors.textDefault }}>
                Habit Details
              </h4>
              <div className="space-y-2">
                {selectedDayData.habits.map((habit: any) => (
                  <div 
                    key={habit.id} 
                    className="flex items-center justify-between p-2 rounded-lg"
                    style={{ backgroundColor: 'rgba(255, 255, 255, 0.5)' }}
                  >
                    <div className="flex items-center space-x-2">
                      <span>{habit.icon}</span>
                      <span 
                        style={{ 
                          color: theme.colors.textDefault,
                          textDecoration: habit.completed ? 'line-through' : 'none',
                          opacity: habit.completed ? 0.7 : 1,
                        }}
                      >
                        {habit.name}
                      </span>
                    </div>
                    <span className={habit.completed ? 'text-green-500' : 'text-gray-400'}>
                      {habit.completed ? '✓' : '○'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default History;
