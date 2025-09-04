import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserTreasure, UserAchievement, GameStats } from '../types/schema';

const STORAGE_KEYS = {
  USER_TREASURES: '@treasure_hunt_user_treasures',
  USER_ACHIEVEMENTS: '@treasure_hunt_user_achievements',
  GAME_STATS: '@treasure_hunt_game_stats',
  USER_PROFILE: '@treasure_hunt_user_profile',
};

export class ProgressTracker {
  // Save discovered treasures to local storage
  async saveTreasureProgress(userTreasure: UserTreasure): Promise<void> {
    try {
      const existingTreasures = await this.getUserTreasures();
      const updatedTreasures = existingTreasures.filter(t => t.treasureId !== userTreasure.treasureId);
      updatedTreasures.push(userTreasure);
      
      await AsyncStorage.setItem(STORAGE_KEYS.USER_TREASURES, JSON.stringify(updatedTreasures));
    } catch (error) {
      console.error('Error saving treasure progress:', error);
    }
  }

  // Get user treasures from local storage
  async getUserTreasures(): Promise<UserTreasure[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.USER_TREASURES);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting user treasures:', error);
      return [];
    }
  }

  // Save quiz completion
  async saveQuizCompletion(treasureId: string, score: number, maxScore: number): Promise<void> {
    try {
      const treasures = await this.getUserTreasures();
      const treasureIndex = treasures.findIndex(t => t.treasureId === treasureId);
      
      if (treasureIndex >= 0) {
        treasures[treasureIndex].quizCompleted = true;
        treasures[treasureIndex].quizScore = score;
        
        await AsyncStorage.setItem(STORAGE_KEYS.USER_TREASURES, JSON.stringify(treasures));
        
        // Update game stats
        await this.updateGameStats();
      }
    } catch (error) {
      console.error('Error saving quiz completion:', error);
    }
  }

  // Calculate and save game statistics
  async updateGameStats(): Promise<GameStats> {
    try {
      const treasures = await this.getUserTreasures();
      
      const totalScore = treasures.reduce((sum, treasure) => sum + (treasure.score || 0), 0);
      const treasuresFound = treasures.length;
      const completedQuizzes = treasures.filter(t => t.quizCompleted).length;
      const perfectQuizzes = treasures.filter(t => t.quizCompleted && (t.quizScore === 100)).length;
      
      // Level system: 100 points per level
      const level = Math.floor(totalScore / 100) + 1;
      const experience = totalScore % 100;
      const experienceToNext = 100 - experience;
      
      const stats: GameStats = {
        treasuresFound,
        totalScore,
        level,
        experience,
        experienceToNext,
        completedQuizzes,
        perfectQuizzes,
        achievements: [], // This would be populated from user achievements
      };
      
      await AsyncStorage.setItem(STORAGE_KEYS.GAME_STATS, JSON.stringify(stats));
      return stats;
    } catch (error) {
      console.error('Error updating game stats:', error);
      return {
        treasuresFound: 0,
        totalScore: 0,
        level: 1,
        experience: 0,
        experienceToNext: 100,
        completedQuizzes: 0,
        perfectQuizzes: 0,
        achievements: [],
      };
    }
  }

  // Get game statistics
  async getGameStats(): Promise<GameStats> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.GAME_STATS);
      if (data) {
        return JSON.parse(data);
      } else {
        return await this.updateGameStats();
      }
    } catch (error) {
      console.error('Error getting game stats:', error);
      return await this.updateGameStats();
    }
  }

  // Save achievement unlock
  async unlockAchievement(achievement: UserAchievement): Promise<void> {
    try {
      const existingAchievements = await this.getUserAchievements();
      const alreadyUnlocked = existingAchievements.some(a => a.achievementId === achievement.achievementId);
      
      if (!alreadyUnlocked) {
        existingAchievements.push(achievement);
        await AsyncStorage.setItem(STORAGE_KEYS.USER_ACHIEVEMENTS, JSON.stringify(existingAchievements));
        await this.updateGameStats();
      }
    } catch (error) {
      console.error('Error saving achievement:', error);
    }
  }

  // Get user achievements from local storage
  async getUserAchievements(): Promise<UserAchievement[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.USER_ACHIEVEMENTS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting user achievements:', error);
      return [];
    }
  }

  // Check and unlock achievements based on current progress
  async checkAchievements(): Promise<UserAchievement[]> {
    try {
      const stats = await this.getGameStats();
      const existingAchievements = await this.getUserAchievements();
      const { achievements } = await import('./gameData');
      const newAchievements: UserAchievement[] = [];

      for (const achievement of achievements) {
        const alreadyUnlocked = existingAchievements.some(a => a.achievementId === achievement.id);
        
        if (!alreadyUnlocked) {
          let shouldUnlock = false;
          
          switch (achievement.criteria.type) {
            case 'treasures_found':
              shouldUnlock = stats.treasuresFound >= (achievement.criteria.target || 0);
              break;
            case 'total_score':
              shouldUnlock = stats.totalScore >= (achievement.criteria.target || 0);
              break;
            case 'quiz_perfect':
              shouldUnlock = stats.perfectQuizzes > 0;
              break;
          }

          if (shouldUnlock) {
            const userAchievement: UserAchievement = {
              id: Math.random().toString(36),
              userId: 'demo-user',
              achievementId: achievement.id,
              unlockedAt: new Date(),
            };
            
            newAchievements.push(userAchievement);
            await this.unlockAchievement(userAchievement);
          }
        }
      }

      return newAchievements;
    } catch (error) {
      console.error('Error checking achievements:', error);
      return [];
    }
  }

  // Clear all progress (for testing)
  async clearProgress(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.USER_TREASURES,
        STORAGE_KEYS.USER_ACHIEVEMENTS,
        STORAGE_KEYS.GAME_STATS,
      ]);
    } catch (error) {
      console.error('Error clearing progress:', error);
    }
  }
}

export const progressTracker = new ProgressTracker();