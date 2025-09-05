import { MD3LightTheme, MD3DarkTheme, type MD3Theme } from 'react-native-paper';
import { useColorScheme } from 'react-native';

// Colors
export const Colors = {
	greenPrimary: '#366347',
  greenSecondary: '#1C3024',
  greenBright: '#38E07A',
  greenBackground: '#122117',
  lightText: '#ffffff',
  darkText: '#000000',
};

// Fonts
export const Fonts = {
  regular: 'SplineSans-Regular',
  medium: 'SplineSans-Medium',
  bold: 'SplineSans-Bold',
};

// Light theme
export const LightTheme: MD3Theme = {
	...MD3LightTheme,
	colors: {
		...MD3LightTheme.colors,
		primary: Colors.greenPrimary,
		secondary: Colors.greenSecondary,
		tertiary: Colors.greenBright,
		background: Colors.lightText,
		surface: Colors.lightText,
		onSurface: Colors.darkText,
	},
	fonts: {
		...MD3LightTheme.fonts,
		bodyLarge: { ...MD3LightTheme.fonts.bodyLarge, fontFamily: Fonts.regular },
		bodyMedium: { ...MD3LightTheme.fonts.bodyMedium, fontFamily: Fonts.medium },
		bodySmall: { ...MD3LightTheme.fonts.bodySmall, fontFamily: Fonts.regular },
		titleLarge: { ...MD3LightTheme.fonts.titleLarge, fontFamily: Fonts.bold },
		titleMedium: { ...MD3LightTheme.fonts.titleMedium, fontFamily: Fonts.medium },
		titleSmall: { ...MD3LightTheme.fonts.titleSmall, fontFamily: Fonts.medium },
	},
};

// Dark theme
export const DarkThemeCustom: MD3Theme = {
	...MD3DarkTheme,
	colors: {
		...MD3DarkTheme.colors,
		primary: Colors.greenPrimary,
		secondary: Colors.greenSecondary,
		tertiary: Colors.greenBright,
		background: Colors.greenBackground,
		surface: Colors.greenSecondary,
		onSurface: Colors.greenBright,
	},
	fonts: {
		...MD3DarkTheme.fonts,
		bodyLarge: { ...MD3DarkTheme.fonts.bodyLarge, fontFamily: Fonts.regular },
		bodyMedium: { ...MD3DarkTheme.fonts.bodyMedium, fontFamily: Fonts.medium },
		bodySmall: { ...MD3DarkTheme.fonts.bodySmall, fontFamily: Fonts.regular },
		titleLarge: { ...MD3DarkTheme.fonts.titleLarge, fontFamily: Fonts.bold },
		titleMedium: { ...MD3DarkTheme.fonts.titleMedium, fontFamily: Fonts.medium },
		titleSmall: { ...MD3DarkTheme.fonts.titleSmall, fontFamily: Fonts.medium },
	},
};

// Hook to dynamically get theme based on system preference
export const useTheme = () => {
	const scheme = useColorScheme();
	return scheme === 'dark' ? DarkThemeCustom : LightTheme;
};
