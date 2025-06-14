import React from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { configureFonts, MD3LightTheme } from 'react-native-paper';

// Function to configure Material Icons for react-native-paper
export const getIconForName = (name) => {
  // For MaterialIcons
  return ({ size, color }) => (
    <MaterialIcons name={name} size={size} color={color} />
  );
};

// Create and export a custom theme that uses our icon configuration
export const customTheme = {
  ...MD3LightTheme,
  fonts: configureFonts({ config: {} }),
};
