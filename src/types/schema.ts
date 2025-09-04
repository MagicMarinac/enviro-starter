import { z } from 'zod';

// Base multilingual text interface
export const multilingualTextSchema = z.object({
  hr: z.string(),
  sl: z.string(),
  en: z.string(),
});

export type MultilingualText = z.infer<typeof multilingualTextSchema>;

// Quiz question schema
export const quizQuestionSchema = z.object({
  id: z.string(),
  question: multilingualTextSchema,
  answers: z.array(multilingualTextSchema),
  correctAnswer: z.number(),
  explanation: multilingualTextSchema,
});

export type QuizQuestion = z.infer<typeof quizQuestionSchema>;

// Quiz schema
export const quizSchema = z.object({
  treasureId: z.string(),
  questions: z.array(quizQuestionSchema),
});

export type Quiz = z.infer<typeof quizSchema>;

// Treasure schema
export const treasureSchema = z.object({
  id: z.string(),
  name: multilingualTextSchema,
  description: multilingualTextSchema,
  location: z.object({
    latitude: z.number(),
    longitude: z.number(),
  }),
  discoveryRadius: z.number().default(50), // meters
  points: z.number(),
  unlockOrder: z.number(),
  imageUrl: z.string().optional(),
  historicalInfo: multilingualTextSchema,
});

export type Treasure = z.infer<typeof treasureSchema>;

// User schema
export const userSchema = z.object({
  id: z.string(),
  username: z.string(),
  language: z.enum(['hr', 'sl', 'en']).default('hr'),
  createdAt: z.date().default(() => new Date()),
});

export type User = z.infer<typeof userSchema>;

// User treasure schema (for tracking discovered treasures)
export const userTreasureSchema = z.object({
  id: z.string(),
  userId: z.string(),
  treasureId: z.string(),
  discoveredAt: z.date(),
  score: z.number(),
  quizCompleted: z.boolean().default(false),
  quizScore: z.number().optional(),
});

export type UserTreasure = z.infer<typeof userTreasureSchema>;

// Achievement schema
export const achievementSchema = z.object({
  id: z.string(),
  name: multilingualTextSchema,
  description: multilingualTextSchema,
  criteria: z.object({
    type: z.enum(['treasures_found', 'total_score', 'quiz_perfect', 'first_discovery']),
    target: z.number().optional(),
    treasureId: z.string().optional(),
  }),
  points: z.number(),
  iconName: z.string(),
});

export type Achievement = z.infer<typeof achievementSchema>;

// User achievement schema
export const userAchievementSchema = z.object({
  id: z.string(),
  userId: z.string(),
  achievementId: z.string(),
  unlockedAt: z.date(),
});

export type UserAchievement = z.infer<typeof userAchievementSchema>;

// User stats schema
export const userStatsSchema = z.object({
  treasuresFound: z.number(),
  totalScore: z.number(),
  achievementsUnlocked: z.number(),
  currentStreak: z.number(),
});

export type UserStats = z.infer<typeof userStatsSchema>;

// Point of Interest schema
export const pointOfInterestSchema = z.object({
  id: z.string(),
  name: multilingualTextSchema,
  description: multilingualTextSchema,
  location: z.object({
    latitude: z.number(),
    longitude: z.number(),
  }),
  category: z.enum(['monument', 'museum', 'park', 'historical']),
  historicalInfo: multilingualTextSchema,
});

export type PointOfInterest = z.infer<typeof pointOfInterestSchema>;

// Game stats schema for enhanced gamification
export const gameStatsSchema = z.object({
  treasuresFound: z.number(),
  totalScore: z.number(),
  level: z.number(),
  experience: z.number(),
  experienceToNext: z.number(),
  completedQuizzes: z.number(),
  perfectQuizzes: z.number(),
  achievements: z.array(z.string()),
});

export type GameStats = z.infer<typeof gameStatsSchema>;

// API Response schemas
export const apiResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    success: z.boolean(),
    data: dataSchema,
    message: z.string().optional(),
  });

export type ApiResponse<T> = {
  success: boolean;
  data: T;
  message?: string;
};

// Location schema for geolocation
export const locationSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
  accuracy: z.number().optional(),
  timestamp: z.number().optional(),
});

export type Location = z.infer<typeof locationSchema>;

// Quiz submission schema
export const quizSubmissionSchema = z.object({
  answers: z.array(z.number()),
  score: z.number().optional(),
  completed: z.boolean().optional(),
});

export type QuizSubmission = z.infer<typeof quizSubmissionSchema>;

// Insert schemas for form validation
export const userInsertSchema = userSchema.omit({ id: true, createdAt: true });
export const treasureInsertSchema = treasureSchema.omit({ id: true });
export const userTreasureInsertSchema = userTreasureSchema.omit({ id: true, discoveredAt: true });
export const userAchievementInsertSchema = userAchievementSchema.omit({ id: true, unlockedAt: true });

// Types for inserts
export type UserInsert = z.infer<typeof userInsertSchema>;
export type TreasureInsert = z.infer<typeof treasureInsertSchema>;
export type UserTreasureInsert = z.infer<typeof userTreasureInsertSchema>;
export type UserAchievementInsert = z.infer<typeof userAchievementInsertSchema>;