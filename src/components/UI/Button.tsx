import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle, ActivityIndicator } from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  style,
  textStyle,
}) => {
  const buttonStyle = [
    styles.base,
    styles[variant],
    styles[`size_${size}`],
    disabled && styles.disabled,
    style,
  ];

  const buttonTextStyle = [
    styles.baseText,
    styles[`${variant}Text`],
    styles[`size_${size}Text`],
    disabled && styles.disabledText,
    textStyle,
  ];

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? '#fff' : '#8B4513'} size="small" />
      ) : (
        <Text style={buttonTextStyle}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  primary: {
    backgroundColor: '#8B4513',
    borderColor: '#8B4513',
  },
  secondary: {
    backgroundColor: '#D2B48C',
    borderColor: '#D2B48C',
  },
  outline: {
    backgroundColor: 'transparent',
    borderColor: '#8B4513',
  },
  ghost: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
  },
  disabled: {
    opacity: 0.5,
  },
  size_sm: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  size_md: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  size_lg: {
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  baseText: {
    fontWeight: '600',
    textAlign: 'center',
  },
  primaryText: {
    color: '#fff',
  },
  secondaryText: {
    color: '#8B4513',
  },
  outlineText: {
    color: '#8B4513',
  },
  ghostText: {
    color: '#8B4513',
  },
  disabledText: {
    opacity: 0.5,
  },
  size_smText: {
    fontSize: 14,
  },
  size_mdText: {
    fontSize: 16,
  },
  size_lgText: {
    fontSize: 18,
  },
});