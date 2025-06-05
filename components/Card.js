import React from 'react';
import { 
  View, 
  StyleSheet, 
  TouchableOpacity, 
  TouchableNativeFeedback, 
  Platform,
  StyleProp,
  ViewStyle,
  TouchableWithoutFeedbackProps,
  ViewProps
} from 'react-native';

import PropTypes from 'prop-types';
import { ViewPropTypes } from 'deprecated-react-native-prop-types';

interface CardProps extends ViewProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  elevation?: number;
  borderRadius?: number;
  margin?: number | string;
  marginVertical?: number | string;
  marginHorizontal?: number | string;
  padding?: number | string;
  paddingVertical?: number | string;
  paddingHorizontal?: number | string;
}

const Card = ({
  children,
  style,
  onPress,
  elevation = 2,
  borderRadius = 8,
  margin = 0,
  marginVertical = 8,
  marginHorizontal = 0,
  padding = 16,
  paddingVertical = 16,
  paddingHorizontal = 16,
  ...rest
}: CardProps) => {
  
  const Touchable = Platform.OS === 'android' ? TouchableNativeFeedback : TouchableOpacity;
  
  // Enhanced ripple effect for Android
  const rippleColor = '#4361ee' || 'rgba(0, 0, 0, 0.1)';
  const borderless = false;
  
  const cardStyle = [
    styles.card,
    {
      backgroundColor: '#fff',
      borderRadius: borderRadius,
      margin,
      marginVertical,
      marginHorizontal,
      padding,
      paddingVertical,
      paddingHorizontal,
      elevation,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: elevation },
      shadowOpacity: 0.1,
      shadowRadius: elevation * 2,
    },
    style,
  ];

  if (onPress) {
    return (
      <Touchable 
        onPress={onPress}
        background={Platform.OS === 'android' ? 
          TouchableNativeFeedback.Ripple(rippleColor, borderless) : undefined}
        useForeground={Platform.OS === 'android' && Platform.Version >= 21}
        accessibilityRole="button"
        {...rest}
      >
        <View style={cardStyle}>
          {children}
        </View>
      </Touchable>
    );
  }


  return (
    <View style={cardStyle} {...rest}>
      {children}
    </View>
  );
};

Card.propTypes = {
  children: PropTypes.node,
  style: ViewPropTypes.style,
  onPress: PropTypes.func,
  elevation: PropTypes.number,
  borderRadius: PropTypes.number,
  margin: PropTypes.number,
  marginVertical: PropTypes.number,
  marginHorizontal: PropTypes.number,
  padding: PropTypes.number,
  paddingVertical: PropTypes.number,
  paddingHorizontal: PropTypes.number,
};

const styles = StyleSheet.create({
  card: {
    width: '100%',
    overflow: 'hidden',
  },
});

export default Card;