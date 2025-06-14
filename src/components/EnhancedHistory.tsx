
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, PieChart, Pie, Cell } from 'recharts';
import { Filter } from 'lucide-react';
import { theme } from '@/utils/theme';
import { storage, DayData } from '@/utils/storage';
import DayDetailModal from './DayDetailModal';

const EnhancedHistory: React.FC = () => {
  const [selectedDay, setSelectedDay] = useState<string>('');
  const [timeRange, setTimeRange] = useState<'week' | 'month'>('week');
  const [chartData, setChartData] = useState<any[]>([]);
  const [moodData, setMoodData] = useState<DayData[]>([]);
  const [showDayModal, setShowDayModal] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const loadData = () => {
    try {
      const data = storage.getMoodData();
      setMoodData(data);
      
      const days = timeRange === 'week' ? 7 : 30;
      const chartDataArray = [];
      const today = new Date();
      
      for (let i = days - 1; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateString = date.toISOString().split('T')[0];
        const dayData = data.find(d => d.date === dateString);
        
        const currentHabits = dateString === today.toISOString().split('T')[0] 
          ? storage.getHabits() 
          : storage.getHabits();
        
        const habitsForDay = dayData?.habits || currentHabits.map(h => ({ ...h, completed: false }));
        const completedHabits = habitsForDay.filter(h => h.completed).length;
        const totalHabits = habitsForDay.length;
        const mood = dayData ? dayData.mood || 0 : 0;
        
        chartDataArray.push({
          date: dateString,
          day: date.toLocaleDateString('en-US', { weekday: 'short' }),
          fullDate: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          completedHabits,
          totalHabits,
          completionRate: totalHabits > 0 ? Math.round((completedHabits / totalHabits) * 100) : 0,
          mood: mood,
          habits: habitsForDay,
        });
      }
      
      setChartData(chartDataArray);
      
      if (!selectedDay && chartDataArray.length > 0) {
        setSelectedDay(chartDataArray[chartDataArray.length - 1]?.date || '');
      }
      
      setIsLoaded(true);
    } catch (error) {
      console.error('Error loading history data:', error);
      setIsLoaded(true);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, [timeRange, selectedDay]);

  useEffect(() => {
    const handleStorageChange = () => {
      loadData();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [timeRange]);

  const selectedDayData = chartData.find(d => d.date === selectedDay);

  const customTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <motion.div
          className="backdrop-blur-xl p-6 rounded-2xl shadow-xl border relative z-[9999]"
          style={{
            background: 'rgba(255, 255, 255, 0.25)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)',
          }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <p className="font-bold mb-3 text-white text-lg">
            {data.fullDate}
          </p>
          <div className="space-y-2">
            <p className="text-white/90">
              <span className="font-medium">Completion:</span> {data.completionRate}% ({data.completedHabits}/{data.totalHabits})
            </p>
            {payload[0].dataKey === 'mood' && (
              <p className="text-white/90">
                <span className="font-medium">Mood:</span> {data.mood}/5
              </p>
            )}
          </div>
        </motion.div>
      );
    }
    return null;
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen pb-24 relative z-10 flex items-center justify-center">
        <motion.div
          className="text-white text-lg"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          Loading your progress...
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24 relative z-10">
      {/* Day Detail Modal */}
      <DayDetailModal
        isOpen={showDayModal}
        onClose={() => setShowDayModal(false)}
        dayData={selectedDayData}
      />

      {/* Header */}
      <motion.div
        className="mb-6 px-4 pt-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold mb-2 text-white">
          Your Progress
        </h1>
        <p className="text-white/80 text-lg">
          Track your patterns and celebrate your growth
        </p>
      </motion.div>
      
      {/* Time Range Filter */}
      <motion.div
        className="mb-6 px-4"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center space-x-4">
          <Filter size={20} className="text-white" />
          <div className="flex space-x-2">
            {(['week', 'month'] as const).map((range) => (
              <motion.button
                key={range}
                onClick={() => setTimeRange(range)}
                className="px-4 py-2 rounded-xl font-medium transition-all duration-200 min-w-[44px] min-h-[44px]"
                style={{
                  backgroundColor: timeRange === range ? theme.colors.primary : 'rgba(255, 255, 255, 0.2)',
                  color: timeRange === range ? 'white' : 'rgba(255, 255, 255, 0.9)',
                  border: `1px solid ${timeRange === range ? 'transparent' : 'rgba(255, 255, 255, 0.3)'}`,
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {range === 'week' ? 'Week' : 'Month'}
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>
      
      {/* Mood Line Chart */}
      <motion.div
        className="p-6 mx-4 rounded-2xl backdrop-blur-xl mb-6 relative z-20"
        style={{
          background: 'rgba(255, 255, 255, 0.25)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
        }}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h3 className="text-xl font-semibold mb-4 text-white">
          Mood Trend
        </h3>
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartData}>
              <XAxis 
                dataKey="day" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: 'rgba(255, 255, 255, 0.7)' }}
              />
              <YAxis 
                hide 
                domain={[0, 5]} 
              />
              <Tooltip content={customTooltip} />
              <Line 
                type="monotone" 
                dataKey="mood" 
                stroke={theme.colors.secondary}
                strokeWidth={3}
                dot={{ fill: theme.colors.secondary, strokeWidth: 2, r: 6 }}
                activeDot={{ r: 8, fill: theme.colors.primary, stroke: 'white', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-48">
            <p className="text-white/70">
              No mood data yet. Start tracking!
            </p>
          </div>
        )}
      </motion.div>
      
      {/* Habits Bar Chart */}
      <motion.div
        className="p-6 mx-4 rounded-2xl backdrop-blur-xl mb-6 relative z-20"
        style={{
          background: 'rgba(255, 255, 255, 0.25)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
        }}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h3 className="text-xl font-semibold mb-4 text-white">
          Habit Completion Rate
        </h3>
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData}>
              <XAxis 
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: 'rgba(255, 255, 255, 0.7)' }}
              />
              <YAxis 
                hide 
                domain={[0, 100]}
              />
              <Tooltip content={customTooltip} />
              <Bar 
                dataKey="completionRate" 
                fill={theme.colors.primary}
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-48">
            <p className="text-white/70">
              No habit data yet. Start tracking!
            </p>
          </div>
        )}
      </motion.div>
      
      {/* Day Selector */}
      <motion.div
        className="mb-6 px-4 relative z-30"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {chartData.map((day) => (
            <motion.button
              key={day.date}
              onClick={() => {
                setSelectedDay(day.date);
                setShowDayModal(true);
              }}
              className="tab-button flex-shrink-0 px-4 py-3 rounded-xl font-medium transition-all duration-200 min-w-[44px] min-h-[44px]"
              style={{
                backgroundColor: selectedDay === day.date ? theme.colors.secondary : 'rgba(255, 255, 255, 0.2)',
                color: selectedDay === day.date ? 'white' : 'rgba(255, 255, 255, 0.9)',
                border: selectedDay === day.date ? 'none' : '1px solid rgba(255, 255, 255, 0.3)',
                boxShadow: selectedDay === day.date ? '0 8px 25px rgba(34, 211, 238, 0.4)' : 'none',
              }}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="text-center">
                <div className="text-sm font-semibold">{day.day}</div>
                <div className="text-xs opacity-80">{day.fullDate}</div>
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default EnhancedHistory;
