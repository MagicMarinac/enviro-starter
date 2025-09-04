import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage keys
const STORAGE_KEYS = {
  USER_TREASURES: 'user_treasures',
  USER_ACHIEVEMENTS: 'user_achievements',
  USER_STATS: 'user_stats',
  QUIZ_RESULTS: 'quiz_results',
  USER_PROGRESS: 'user_progress',
};

// User progress tracking
export interface UserProgress {
  userId: string;
  treasuresFound: number;
  totalScore: number;
  achievementsUnlocked: string[];
  lastActiveDate: string;
  completedQuizzes: string[];
  perfectQuizzes: string[];
}

export class LocalStorage {
  // Get user progress
  static async getUserProgress(userId: string): Promise<UserProgress | null> {
    try {
      const data = await AsyncStorage.getItem(`${STORAGE_KEYS.USER_PROGRESS}_${userId}`);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error getting user progress:', error);
      return null;
    }
  }

  // Save user progress
  static async saveUserProgress(userId: string, progress: UserProgress): Promise<void> {
    try {
      await AsyncStorage.setItem(
        `${STORAGE_KEYS.USER_PROGRESS}_${userId}`,
        JSON.stringify(progress)
      );
    } catch (error) {
      console.error('Error saving user progress:', error);
    }
  }

  // Initialize user progress if not exists
  static async initializeUserProgress(userId: string): Promise<UserProgress> {
    let progress = await this.getUserProgress(userId);
    
    if (!progress) {
      progress = {
        userId,
        treasuresFound: 0,
        totalScore: 0,
        achievementsUnlocked: [],
        lastActiveDate: new Date().toISOString(),
        completedQuizzes: [],
        perfectQuizzes: [],
      };
      await this.saveUserProgress(userId, progress);
    }
    
    return progress;
  }

  // Update treasure discovery
  static async discoverTreasure(userId: string, treasureId: string, points: number): Promise<void> {
    try {
      const progress = await this.initializeUserProgress(userId);
      
      // Add treasure if not already discovered
      const treasureData = {
        treasureId,
        userId,
        discoveredAt: new Date().toISOString(),
        points,
      };
      
      // Get existing treasures
      const existingTreasures = await AsyncStorage.getItem(`${STORAGE_KEYS.USER_TREASURES}_${userId}`);
      const treasures = existingTreasures ? JSON.parse(existingTreasures) : [];
      
      // Check if already discovered
      if (!treasures.find((t: any) => t.treasureId === treasureId)) {
        treasures.push(treasureData);
        await AsyncStorage.setItem(`${STORAGE_KEYS.USER_TREASURES}_${userId}`, JSON.stringify(treasures));
        
        // Update progress
        progress.treasuresFound = treasures.length;
        progress.totalScore += points;
        progress.lastActiveDate = new Date().toISOString();
        
        await this.saveUserProgress(userId, progress);
      }
    } catch (error) {
      console.error('Error discovering treasure:', error);
    }
  }

  // Get user treasures
  static async getUserTreasures(userId: string): Promise<any[]> {
    try {
      const data = await AsyncStorage.getItem(`${STORAGE_KEYS.USER_TREASURES}_${userId}`);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting user treasures:', error);
      return [];
    }
  }

  // Complete quiz
  static async completeQuiz(
    userId: string, 
    treasureId: string, 
    score: number, 
    isPerfect: boolean
  ): Promise<void> {
    try {
      const progress = await this.initializeUserProgress(userId);
      
      // Add to completed quizzes
      if (!progress.completedQuizzes.includes(treasureId)) {
        progress.completedQuizzes.push(treasureId);
      }
      
      // Add to perfect quizzes if applicable
      if (isPerfect && !progress.perfectQuizzes.includes(treasureId)) {
        progress.perfectQuizzes.push(treasureId);
      }
      
      // Add bonus points for quiz
      const bonusPoints = Math.round(score * 0.5); // 50% of quiz score as bonus
      progress.totalScore += bonusPoints;
      progress.lastActiveDate = new Date().toISOString();
      
      await this.saveUserProgress(userId, progress);
      
      // Save quiz result
      const quizResult = {
        treasureId,
        userId,
        score,
        isPerfect,
        completedAt: new Date().toISOString(),
        bonusPoints,
      };
      
      const existingResults = await AsyncStorage.getItem(`${STORAGE_KEYS.QUIZ_RESULTS}_${userId}`);
      const results = existingResults ? JSON.parse(existingResults) : [];
      
      // Update existing or add new
      const existingIndex = results.findIndex((r: any) => r.treasureId === treasureId);
      if (existingIndex >= 0) {
        results[existingIndex] = quizResult;
      } else {
        results.push(quizResult);
      }
      
      await AsyncStorage.setItem(`${STORAGE_KEYS.QUIZ_RESULTS}_${userId}`, JSON.stringify(results));
    } catch (error) {
      console.error('Error completing quiz:', error);
    }
  }

  // Unlock achievement
  static async unlockAchievement(userId: string, achievementId: string): Promise<void> {
    try {
      const progress = await this.initializeUserProgress(userId);
      
      if (!progress.achievementsUnlocked.includes(achievementId)) {
        progress.achievementsUnlocked.push(achievementId);
        progress.lastActiveDate = new Date().toISOString();
        
        await this.saveUserProgress(userId, progress);
        
        // Save achievement data
        const achievement = {
          achievementId,
          userId,
          unlockedAt: new Date().toISOString(),
        };
        
        const existingAchievements = await AsyncStorage.getItem(`${STORAGE_KEYS.USER_ACHIEVEMENTS}_${userId}`);
        const achievements = existingAchievements ? JSON.parse(existingAchievements) : [];
        achievements.push(achievement);
        
        await AsyncStorage.setItem(`${STORAGE_KEYS.USER_ACHIEVEMENTS}_${userId}`, JSON.stringify(achievements));
      }
    } catch (error) {
      console.error('Error unlocking achievement:', error);
    }
  }

  // Get user achievements
  static async getUserAchievements(userId: string): Promise<any[]> {
    try {
      const data = await AsyncStorage.getItem(`${STORAGE_KEYS.USER_ACHIEVEMENTS}_${userId}`);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting user achievements:', error);
      return [];
    }
  }

  // Get user stats
  static async getUserStats(userId: string): Promise<any> {
    try {
      const progress = await this.initializeUserProgress(userId);
      return {
        treasuresFound: progress.treasuresFound,
        totalScore: progress.totalScore,
        achievementsUnlocked: progress.achievementsUnlocked.length,
        completedQuizzes: progress.completedQuizzes.length,
        perfectQuizzes: progress.perfectQuizzes.length,
        lastActiveDate: progress.lastActiveDate,
      };
    } catch (error) {
      console.error('Error getting user stats:', error);
      return {
        treasuresFound: 0,
        totalScore: 0,
        achievementsUnlocked: 0,
        completedQuizzes: 0,
        perfectQuizzes: 0,
        lastActiveDate: new Date().toISOString(),
      };
    }
  }

  // Clear all data (for development/testing)
  static async clearAllData(userId: string): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        `${STORAGE_KEYS.USER_PROGRESS}_${userId}`,
        `${STORAGE_KEYS.USER_TREASURES}_${userId}`,
        `${STORAGE_KEYS.USER_ACHIEVEMENTS}_${userId}`,
        `${STORAGE_KEYS.QUIZ_RESULTS}_${userId}`,
      ]);
    } catch (error) {
      console.error('Error clearing data:', error);
    }
  }
}