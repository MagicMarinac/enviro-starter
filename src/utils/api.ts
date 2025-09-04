import { ApiResponse, User, Treasure, UserTreasure, Achievement, UserAchievement, UserStats, Quiz, QuizSubmission } from '../types/schema';

// Connect to the local development server
const API_BASE_URL = 'http://localhost:5000/api';

class ApiClient {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // User endpoints
  async getUser(userId: string): Promise<User> {
    return this.request<User>(`/user/${userId}`);
  }

  async getUserStats(userId: string): Promise<UserStats> {
    return this.request<UserStats>(`/user/${userId}/stats`);
  }

  // Treasure endpoints
  async getTreasures(): Promise<Treasure[]> {
    return this.request<Treasure[]>('/treasures');
  }

  async getUserTreasures(userId: string): Promise<UserTreasure[]> {
    return this.request<UserTreasure[]>(`/user/${userId}/treasures`);
  }

  async discoverTreasure(userId: string, treasureId: string, location: { latitude: number; longitude: number }): Promise<UserTreasure> {
    return this.request<UserTreasure>(`/user/${userId}/treasures/${treasureId}/discover`, {
      method: 'POST',
      body: JSON.stringify({ location }),
    });
  }

  // Quiz endpoints
  async getQuiz(treasureId: string): Promise<Quiz> {
    return this.request<Quiz>(`/treasures/${treasureId}/quiz`);
  }

  async submitQuiz(userId: string, treasureId: string, submission: QuizSubmission): Promise<{ score: number; maxScore: number }> {
    return this.request<{ score: number; maxScore: number }>(`/user/${userId}/treasures/${treasureId}/quiz`, {
      method: 'POST',
      body: JSON.stringify(submission),
    });
  }

  // Achievement endpoints
  async getAchievements(): Promise<Achievement[]> {
    return this.request<Achievement[]>('/achievements');
  }

  async getUserAchievements(userId: string): Promise<UserAchievement[]> {
    return this.request<UserAchievement[]>(`/user/${userId}/achievements`);
  }
}

export const apiClient = new ApiClient();

// Mock data for development (since we don't have a backend server)
export const mockApiClient = {
  async getUser(userId: string): Promise<User> {
    return {
      id: userId,
      username: 'Istraživač',
      language: 'hr' as const,
      createdAt: new Date(),
    };
  },

  async getUserStats(userId: string): Promise<UserStats> {
    return {
      treasuresFound: 1,
      totalScore: 75,
      achievementsUnlocked: 1,
      currentStreak: 1,
    };
  },

  async getTreasures(): Promise<Treasure[]> {
    // Import the treasures from gameData
    const { treasures } = await import('./gameData');
    return treasures;
  },

  async getUserTreasures(userId: string): Promise<UserTreasure[]> {
    return [
      {
        id: '96ccdb1c-5b5f-4f3e-bbc1-1234567890ab',
        userId,
        treasureId: '0de9d6b9-c969-4ebe-a87e-9e137734c9bc',
        discoveredAt: new Date(),
        score: 75,
        quizCompleted: false,
      },
    ];
  },

  async discoverTreasure(userId: string, treasureId: string, location: { latitude: number; longitude: number }): Promise<UserTreasure> {
    return {
      id: Math.random().toString(36),
      userId,
      treasureId,
      discoveredAt: new Date(),
      score: 100,
      quizCompleted: false,
    };
  },

  async getQuiz(treasureId: string): Promise<Quiz> {
    const { quizzes } = await import('./gameData');
    const quiz = quizzes.find(q => q.treasureId === treasureId);
    if (!quiz) {
      throw new Error('Quiz not found');
    }
    return quiz;
  },

  async submitQuiz(userId: string, treasureId: string, submission: QuizSubmission): Promise<{ score: number; maxScore: number }> {
    const quiz = await this.getQuiz(treasureId);
    let score = 0;
    const maxScore = quiz.questions.length * 10;
    
    quiz.questions.forEach((question, index) => {
      if (submission.answers[index] === question.correctAnswer) {
        score += 10;
      }
    });

    // Save quiz completion status (in a real app this would persist to storage)
    console.log(`Quiz completed for treasure ${treasureId} with score ${score}/${maxScore}`);

    return { score, maxScore };
  },

  async getAchievements(): Promise<Achievement[]> {
    const { achievements } = await import('./gameData');
    return achievements;
  },

  async getUserAchievements(userId: string): Promise<UserAchievement[]> {
    return [
      {
        id: '981f0e27-acb0-4ab4-8ad7-8df9eb4e8e2a-user',
        userId,
        achievementId: '981f0e27-acb0-4ab4-8ad7-8df9eb4e8e2a',
        unlockedAt: new Date(),
      },
    ];
  },
};

// Use mock client for development
export default mockApiClient;