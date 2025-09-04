import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getLocales } from 'expo-localization';
import { MultilingualText } from '../types/schema';

export type Language = 'hr' | 'sl' | 'en';

const LANGUAGE_STORAGE_KEY = 'user_language';

export const useLanguage = () => {
  const [language, setLanguage] = useState<Language>('hr');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadLanguage();
  }, []);

  const loadLanguage = async () => {
    try {
      // First try to get saved language
      const savedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (savedLanguage && ['hr', 'sl', 'en'].includes(savedLanguage)) {
        setLanguage(savedLanguage as Language);
        setIsLoading(false);
        return;
      }

      // If no saved language, detect from device
      const locales = getLocales();
      const deviceLanguage = locales[0]?.languageCode;
      
      let detectedLanguage: Language = 'hr';
      if (deviceLanguage === 'sl' || deviceLanguage === 'hr' || deviceLanguage === 'en') {
        detectedLanguage = deviceLanguage;
      } else if (deviceLanguage?.startsWith('hr')) {
        detectedLanguage = 'hr';
      } else if (deviceLanguage?.startsWith('sl')) {
        detectedLanguage = 'sl';
      } else {
        detectedLanguage = 'en';
      }

      setLanguage(detectedLanguage);
      await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, detectedLanguage);
    } catch (error) {
      console.error('Error loading language:', error);
      setLanguage('hr');
    } finally {
      setIsLoading(false);
    }
  };

  const changeLanguage = async (newLanguage: Language) => {
    try {
      setLanguage(newLanguage);
      await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, newLanguage);
    } catch (error) {
      console.error('Error saving language:', error);
    }
  };

  const getText = (text: MultilingualText): string => {
    return text[language] || text.hr || text.en || '';
  };

  return {
    language,
    changeLanguage,
    getText,
    isLoading,
  };
};