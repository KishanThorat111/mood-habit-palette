import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
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

  useEffect(() => {
    // Add a small delay to ensure proper rehydration
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
          
          const currentHabits = storage.getHabits();
          const completedHabits = dayData ? dayData.habits.filter(h => h.completed).length : 0;
          const totalHabits = dayData ? dayData.habits.length : currentHabits.length;
          const mood = dayData ? dayData.mood || 0 : 0;
          
          chartDataArray.push({
            date: dateString,
            day: date.toLocaleDateString('en-US', { weekday: 'short' }),
            fullDate: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            completedHabits,
            totalHabits,
            completionRate: totalHabits > 0 ? Math.round((completedHabits / totalHabits) * 100) : 0,
            mood: mood,
            habits: dayData?.habits || [],
          });
        }
        
        setChartData(chartDataArray);
        
        // Set selected day to today if none selected
        if (!selectedDay && chartDataArray.length > 0) {
          setSelectedDay(chartDataArray[chartDataArray.length - 1]?.date || '');
        }
        
        setIsLoaded(true);
      } catch (error) {
        console.error('Error loading history data:', error);
        setIsLoaded(true);
      }
    };

    // Small delay to ensure DOM is ready
    const timer = setTimeout(loadData, 100);
    return () => clearTimeout(timer);
  }, [timeRange, selectedDay]);

  const selectedDayData = chartData.find(d => d.date === selectedDay);

  const customTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <motion.div
          className="backdrop-blur-xl p-4 rounded-xl shadow-xl border relative z-[9999]"
          style={{
            background: 'rgba(255, 255, 255, 0.95)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
          }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <p className="font-semibold mb-2" style={{ color: theme.colors.textDark }}>
            {data.fullDate}
          </p>
          <p style={{ color: theme.colors.primary }}>
            Completion: {data.completionRate}% ({data.completedHabits}/{data.totalHabits})
          </p>
          {payload[0].dataKey === 'mood' && (
            <p style={{ color: theme.colors.secondary }}>
              Mood: {data.mood}/5
            </p>
          )}
        </motion.div>
      );
    }
    return null;
  };

  // Show loading state until data is properly loaded
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
      
      {/* Day Modal */}
      {showDayModal && selectedDayData && (
        <motion.div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-[9999]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setShowDayModal(false)}
        >
          <motion.div
            className="bg-white/95 backdrop-blur-xl rounded-2xl p-6 max-w-sm w-full relative z-[10000]"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold mb-4" style={{ color: theme.colors.textDark }}>
              {selectedDayData.fullDate}
            </h3>
            
            {/* Mood and completion summary */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span style={{ color: theme.colors.textDefault }}>Mood</span>
                <span className="text-2xl">
                  {selectedDayData.mood === 5 ? '😃' : 
                   selectedDayData.mood === 4 ? '😊' : 
                   selectedDayData.mood === 3 ? '😐' : 
                   selectedDayData.mood === 2 ? '🙁' : 
                   selectedDayData.mood === 1 ? '😢' : '—'}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span style={{ color: theme.colors.textDefault }}>Habits</span>
                <span className="font-semibold" style={{ color: theme.colors.primary }}>
                  {selectedDayData.completedHabits}/{selectedDayData.totalHabits} ({selectedDayData.completionRate}%)
                </span>
              </div>
            </div>
            
            {/* Mini donut chart */}
            {selectedDayData.totalHabits > 0 && (
              <div className="mb-4">
                <ResponsiveContainer width="100%" height={150}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Completed', value: selectedDayData.completedHabits, color: theme.colors.success },
                        { name: 'Remaining', value: selectedDayData.totalHabits - selectedDayData.completedHabits, color: '#E5E7EB' }
                      ]}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={60}
                      dataKey="value"
                    >
                      {[selectedDayData.completedHabits, selectedDayData.totalHabits - selectedDayData.completedHabits].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index === 0 ? theme.colors.success : '#E5E7EB'} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
            
            <motion.button
              onClick={() => setShowDayModal(false)}
              className="w-full py-3 rounded-xl font-medium text-white"
              style={{ backgroundColor: theme.colors.primary }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Close
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default EnhancedHistory;
