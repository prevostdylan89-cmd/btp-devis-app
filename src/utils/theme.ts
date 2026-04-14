import { DefaultTheme } from 'react-native-paper';

export const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#1B5E20',
    accent: '#FF9800',
    background: '#F5F5F5',
    surface: '#FFFFFF',
    error: '#D32F2F',
    text: '#212121',
    textSecondary: '#757575',
    border: '#E0E0E0',
  },
  roundness: 12,
};