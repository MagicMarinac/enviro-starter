import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MaterialIcons } from '@expo/vector-icons';

import { Button } from '../components/UI/Button';
import { Card } from '../components/UI/Card';
import { useLanguage } from '../hooks/useLanguage';
import { RootStackParamList } from '../../App';
import { Quiz, QuizQuestion } from '../types/schema';
import { quizzes } from '../utils/gameData';
import apiClient from '../utils/api';
import * as Haptics from 'expo-haptics';

type QuizScreenNavigationProp = StackNavigationProp<RootStackParamList>;
type QuizScreenRouteProp = {
  params: {
    treasureId: string;
  };
};

const { width } = Dimensions.get('window');

const QuizScreen = () => {
  const navigation = useNavigation<QuizScreenNavigationProp>();
  const route = useRoute<QuizScreenRouteProp>();
  const { getText, language } = useLanguage();
  const { treasureId } = route.params;
  
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const treasureQuiz = quizzes.find(q => q.treasureId === treasureId);
    if (treasureQuiz) {
      setQuiz(treasureQuiz);
    }
  }, [treasureId]);

  const currentQuestion = quiz?.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === (quiz?.questions.length || 0) - 1;

  const handleAnswerSelect = (answerIndex: number) => {
    const newSelectedAnswers = [...selectedAnswers];
    newSelectedAnswers[currentQuestionIndex] = answerIndex;
    setSelectedAnswers(newSelectedAnswers);
  };

  const handleNextQuestion = () => {
    if (isLastQuestion) {
      finishQuiz();
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const finishQuiz = async () => {
    if (!quiz) return;

    let correctAnswers = 0;
    quiz.questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correctAnswer) {
        correctAnswers++;
      }
    });

    const finalScore = Math.round((correctAnswers / quiz.questions.length) * 100);
    setScore(finalScore);
    setShowResult(true);

    // Save quiz results
    try {
      await apiClient.submitQuiz('demo-user', treasureId, {
        answers: selectedAnswers,
        score: finalScore,
        completed: true
      });

      // Haptic feedback
      if (finalScore === 100) {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      } else {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    } catch (error) {
      console.error('Error saving quiz results:', error);
    }

    // Show completion alert
    const isPerfect = finalScore === 100;
    const bonusPoints = finalScore >= 80 ? Math.round(finalScore / 10) * 5 : 0;
    
    Alert.alert(
      language === 'hr' ? 'Kviz završen!' : language === 'sl' ? 'Kviz končan!' : 'Quiz Completed!',
      language === 'hr' 
        ? `Vaš rezultat: ${finalScore}%\n${correctAnswers}/${quiz.questions.length} točnih odgovora${bonusPoints > 0 ? `\n+${bonusPoints} bonus bodova!` : ''}${isPerfect ? '\n🎉 Savršeno!' : ''}`
        : language === 'sl'
        ? `Vaš rezultat: ${finalScore}%\n${correctAnswers}/${quiz.questions.length} pravilnih odgovorov${bonusPoints > 0 ? `\n+${bonusPoints} bonus točk!` : ''}${isPerfect ? '\n🎉 Popolno!' : ''}`
        : `Your score: ${finalScore}%\n${correctAnswers}/${quiz.questions.length} correct answers${bonusPoints > 0 ? `\n+${bonusPoints} bonus points!` : ''}${isPerfect ? '\n🎉 Perfect!' : ''}`,
      [
        {
          text: language === 'hr' ? 'Završi' : language === 'sl' ? 'Končaj' : 'Finish',
          onPress: () => navigation.goBack()
        }
      ]
    );
  };

  if (!quiz || !currentQuestion) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <MaterialIcons name="help" size={80} color="#8B4513" />
          <Text style={styles.noQuizText}>
            {language === 'hr' ? 'Kviz nije dostupan' : language === 'sl' ? 'Kviz ni na voljo' : 'Quiz not available'}
          </Text>
          <Button
            title={language === 'hr' ? 'Nazad' : language === 'sl' ? 'Nazaj' : 'Back'}
            onPress={() => navigation.goBack()}
            variant="outline"
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>
            {language === 'hr' ? 'Povijesni kviz' : language === 'sl' ? 'Zgodovinski kviz' : 'Historical Quiz'}
          </Text>
          <View style={styles.progressContainer}>
            <Text style={styles.progressText}>
              {language === 'hr' 
                ? `Pitanje ${currentQuestionIndex + 1} od ${quiz.questions.length}`
                : language === 'sl'
                ? `Vprašanje ${currentQuestionIndex + 1} od ${quiz.questions.length}`
                : `Question ${currentQuestionIndex + 1} of ${quiz.questions.length}`}
            </Text>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: `${((currentQuestionIndex + 1) / quiz.questions.length) * 100}%` }
                ]} 
              />
            </View>
          </View>
        </View>

        {/* Question Card */}
        <View style={styles.questionContainer}>
          <Card style={styles.questionCard}>
            <View style={styles.questionHeader}>
              <MaterialIcons name="help" size={24} color="#8B4513" />
              <Text style={styles.questionText}>
                {getText(currentQuestion.question)}
              </Text>
            </View>

            {/* Answer Options */}
            <View style={styles.answersContainer}>
              {currentQuestion.answers.map((answer, index) => {
                const isSelected = selectedAnswers[currentQuestionIndex] === index;
                return (
                  <Button
                    key={index}
                    title={getText(answer)}
                    onPress={() => handleAnswerSelect(index)}
                    variant={isSelected ? 'primary' : 'outline'}
                    style={[
                      styles.answerButton,
                      isSelected && styles.selectedAnswer
                    ]}
                    textStyle={styles.answerText}
                  />
                );
              })}
            </View>

            {/* Navigation */}
            <View style={styles.navigationContainer}>
              <Button
                title={language === 'hr' ? 'Nazad' : language === 'sl' ? 'Nazaj' : 'Back'}
                onPress={() => navigation.goBack()}
                variant="ghost"
                size="sm"
              />
              
              <Button
                title={isLastQuestion 
                  ? (language === 'hr' ? 'Završi kviz' : language === 'sl' ? 'Končaj kviz' : 'Finish Quiz')
                  : (language === 'hr' ? 'Sljedeće' : language === 'sl' ? 'Naprej' : 'Next')
                }
                onPress={handleNextQuestion}
                disabled={selectedAnswers[currentQuestionIndex] === undefined}
                style={styles.nextButton}
              />
            </View>
          </Card>
        </View>

        {/* Historical Info */}
        {showResult && (
          <View style={styles.resultContainer}>
            <Card style={styles.resultCard}>
              <View style={styles.resultHeader}>
                <MaterialIcons name="school" size={24} color="#8B4513" />
                <Text style={styles.resultTitle}>
                  {language === 'hr' ? 'Objašnjenje' : language === 'sl' ? 'Razlaga' : 'Explanation'}
                </Text>
              </View>
              <Text style={styles.explanationText}>
                {getText(currentQuestion.explanation)}
              </Text>
            </Card>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8DC',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  noQuizText: {
    fontSize: 18,
    color: '#8B4513',
    textAlign: 'center',
    marginVertical: 20,
  },
  header: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#8B4513',
    textAlign: 'center',
    marginBottom: 20,
  },
  progressContainer: {
    alignItems: 'center',
  },
  progressText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  progressBar: {
    width: width - 40,
    height: 6,
    backgroundColor: '#E0E0E0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#8B4513',
    borderRadius: 3,
  },
  questionContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  questionCard: {
    padding: 20,
  },
  questionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  questionText: {
    fontSize: 18,
    color: '#333',
    fontWeight: '600',
    lineHeight: 26,
    marginLeft: 12,
    flex: 1,
  },
  answersContainer: {
    marginBottom: 20,
  },
  answerButton: {
    marginBottom: 12,
    padding: 16,
  },
  selectedAnswer: {
    borderWidth: 2,
    borderColor: '#8B4513',
  },
  answerText: {
    fontSize: 16,
    textAlign: 'left',
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  nextButton: {
    minWidth: 120,
  },
  resultContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  resultCard: {
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#8B4513',
    marginLeft: 8,
  },
  explanationText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
});

export default QuizScreen;