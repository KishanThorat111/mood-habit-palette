export interface Habit {
  id: string;
  name: string;
  icon: string;
  completed: boolean;
  createdAt: string;
}

export interface DayData {
  date: string;
  habits: Habit[];
  mood: number | null; // 1-5 scale
  moodEmoji: string;
}

const STORAGE_KEYS = {
  HABITS: 'habits',
  MOOD_DATA: 'moodData',
};

export const storage = {
  // Habit management
  getHabits: (): Habit[] => {
    const stored = localStorage.getItem(STORAGE_KEYS.HABITS);
    return stored ? JSON.parse(stored) : [];
  },

  saveHabits: (habits: Habit[]): void => {
    localStorage.setItem(STORAGE_KEYS.HABITS, JSON.stringify(habits));
    // Also save today's habit state to mood data
    storage.saveTodayHabits(habits);
  },

  addHabit: (name: string, icon: string): Habit => {
    const habits = storage.getHabits();
    const newHabit: Habit = {
      id: Date.now().toString(),
      name,
      icon,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    habits.push(newHabit);
    storage.saveHabits(habits);
    return newHabit;
  },

  toggleHabit: (habitId: string): void => {
    const habits = storage.getHabits();
    const habit = habits.find(h => h.id === habitId);
    if (habit) {
      habit.completed = !habit.completed;
      storage.saveHabits(habits);
    }
  },

  deleteHabit: (habitId: string): void => {
    const habits = storage.getHabits().filter(h => h.id !== habitId);
    storage.saveHabits(habits);
  },

  // Mood data management
  getMoodData: (): DayData[] => {
    const stored = localStorage.getItem(STORAGE_KEYS.MOOD_DATA);
    return stored ? JSON.parse(stored) : [];
  },

  saveMoodData: (data: DayData[]): void => {
    localStorage.setItem(STORAGE_KEYS.MOOD_DATA, JSON.stringify(data));
  },

  // Save today's habit completion state
  saveTodayHabits: (habits: Habit[]): void => {
    const today = new Date().toISOString().split('T')[0];
    const data = storage.getMoodData();
    const existingIndex = data.findIndex(d => d.date === today);
    
    if (existingIndex >= 0) {
      // Update existing day's habits
      data[existingIndex].habits = [...habits];
    } else {
      // Create new day entry
      const todayData: DayData = {
        date: today,
        habits: [...habits],
        mood: null,
        moodEmoji: '',
      };
      data.push(todayData);
    }

    // Keep only last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const filtered = data.filter(d => new Date(d.date) >= thirtyDaysAgo);
    
    storage.saveMoodData(filtered);
  },

  setTodayMood: (mood: number, emoji: string): void => {
    const today = new Date().toISOString().split('T')[0];
    const data = storage.getMoodData();
    const existingIndex = data.findIndex(d => d.date === today);
    
    const currentHabits = storage.getHabits();
    
    const todayData: DayData = {
      date: today,
      habits: currentHabits,
      mood,
      moodEmoji: emoji,
    };

    if (existingIndex >= 0) {
      // Preserve existing habits if they exist
      if (data[existingIndex].habits.length > 0) {
        todayData.habits = data[existingIndex].habits;
      }
      data[existingIndex] = todayData;
    } else {
      data.push(todayData);
    }

    // Keep only last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const filtered = data.filter(d => new Date(d.date) >= thirtyDaysAgo);
    
    storage.saveMoodData(filtered);
  },

  getTodayMood: (): { mood: number | null; emoji: string } => {
    const today = new Date().toISOString().split('T')[0];
    const data = storage.getMoodData();
    const todayData = data.find(d => d.date === today);
    return {
      mood: todayData?.mood || null,
      emoji: todayData?.moodEmoji || '',
    };
  },
};
