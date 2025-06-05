import React from 'react';
import { 
  TouchableOpacity, 
  TouchableNativeFeedback, 
  Text, 
  StyleSheet, 
  View, 
  ActivityIndicator,
  Platform,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { ViewPropTypes } from 'deprecated-react-native-prop-types';
import Icon from 'react-native-vector-icons/MaterialIcons';
import colors from '../src/constants/colors';
import PropTypes from 'prop-types';

const Button = ({
  title,
  onPress,
  mode = 'contained',
  disabled = false,
  loading = false,
  icon,
  color,
  labelColor,
  style,
  contentStyle,
  labelStyle,
  children,
  uppercase = true,
  accessibilityLabel,
  ...rest
}) => {
  
  
  const isContained = mode === 'contained';
  const isOutlined = mode === 'outlined';
  const isText = mode === 'text';
  
  const buttonColor = color || '#4361ee';
  const textColor = labelColor || 
    (isContained ? '#fff' : buttonColor);
  const borderColor = isOutlined ? buttonColor : 'transparent';
  const backgroundColor = isContained ? buttonColor : '#fff';
  
  const rippleColor = isContained 
    ? 'rgba(255, 255, 255, 0.32)' 
    : 'rgba(0, 0, 0, 0.1)';
    
  const borderless = !isContained;
  
  const borderRadius = 8;
  
  const Touchable = Platform.OS === 'android' ? TouchableNativeFeedback : TouchableOpacity;
  
  const renderContent = () => (
    <View 
      style={[
        styles.content,
        {
          paddingVertical: 12,
          paddingHorizontal: 16,
          borderRadius,
          backgroundColor,
          borderWidth: isOutlined ? 1 : 0,
          borderColor,
          opacity: disabled ? 0.6 : 1,
        },
        contentStyle,
      ]}
    >
      {icon ? (
        <View style={styles.iconContainer}>
          {typeof icon === 'string' ? (
            <Icon name={icon} size={20} color={'#222'} />
          ) : (
            React.cloneElement(icon, {
              size: 20,
              color: '#222',
            })
          )}
        </View>
      ) : null}
      
      {loading ? (
        <ActivityIndicator 
          size="small" 
          color={isContained ? '#fff' : '#4361ee'} 
          style={styles.loader} 
        />
      ) : null}
      
      <Text
        style={[
          styles.label,
          {
            color: disabled ? colors.disabledText : textColor,
            marginLeft: icon || loading ? 8 : 0,
            fontWeight: '600',
            textTransform: uppercase ? 'uppercase' : 'none',
            fontFamily: 'System',
          },
          labelStyle,
        ]}
        numberOfLines={1}
      >
        {title || children}
      </Text>
    </View>
  );

  if (disabled) {
    return (
      <View 
        style={[
          styles.container, 
          { opacity: 0.6 },
          style
        ]}
        accessibilityRole="button"
        accessibilityState={{ disabled: true }}
      >
        {renderContent()}
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      <Touchable
        onPress={onPress}
        disabled={disabled || loading}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel || title}
        accessibilityState={{ disabled: disabled || loading }}
        {...rest}
        {...(Platform.OS === 'android' && {
          background: TouchableNativeFeedback.Ripple(rippleColor, borderless),
        })}
      >
        {renderContent()}
      </Touchable>
    </View>
  );
};

Button.propTypes = {
  title: PropTypes.string,
  onPress: PropTypes.func,
  mode: PropTypes.oneOf(['text', 'outlined', 'contained']),
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  icon: PropTypes.element,
  color: PropTypes.string,
  labelColor: PropTypes.string,
  style: ViewPropTypes.style,
  contentStyle: ViewPropTypes.style,
  labelStyle: PropTypes.object,
  children: PropTypes.node,
  uppercase: PropTypes.bool,
  accessibilityLabel: PropTypes.string,
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 4,
    overflow: 'hidden',
    marginVertical: 4,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    marginRight: 8,
  },
  loader: {
    marginRight: 8,
  },
  label: {
    fontSize: 14,
    textAlign: 'center',
  },
});

export default Button;