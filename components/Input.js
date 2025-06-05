import React from 'react';
import { View, TextInput, StyleSheet, Text, TouchableOpacity } from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';
import colors from '../src/constants/colors';

const Input = ({
  label,
  error,
  errorText,
  left,
  right,
  containerStyle,
  inputStyle,
  labelStyle,
  errorStyle,
  onClear,
  ...props
}) => {
  
  const [isFocused, setIsFocused] = React.useState(false);
  
  const borderColor = error 
    ? '#ff0000' 
    : isFocused 
      ? '#4361ee' 
      : '#fff';

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text style={[
          styles.label, 
          { 
            color: '#222',
            fontFamily: 'System',
          },
          labelStyle
        ]}>
          {label}
        </Text>
      )}
      <View 
        style={[
          styles.inputContainer, 
          { 
            borderColor,
            backgroundColor: props.editable === false ? colors.disabled : colors.surface,
          }
        ]}
      >
        {left && (
          <View style={styles.leftIcon}>
            {left}
          </View>
        )}
        <TextInput
          style={[
            styles.input, 
            { 
              color: '#222',
              fontFamily: 'System',
              paddingLeft: left ? 12 : 16,
              paddingRight: right || onClear ? 12 : 16,
            },
            inputStyle,
          ]}
          placeholder={label}
          placeholderTextColor={'#a1a1a1'}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
        {(right || onClear) && (
          <View style={styles.rightIcon}>
            {onClear && props.value ? (
              <TouchableOpacity onPress={onClear}>
                <Icon name="close" size={20} color={'#a1a1a1'} />
              </TouchableOpacity>
            ) : right ? (
              right
            ) : null}
          </View>
        )}
      </View>
      {error && errorText && (
        <Text style={[
          styles.error, 
          { 
            color: colors.error,
            fontFamily: 'System',
          },
          errorStyle
        ]}>
          {errorText}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    height: 50,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    paddingVertical: 0,
  },
  leftIcon: {
    marginLeft: 12,
  },
  rightIcon: {
    marginRight: 12,
  },
  error: {
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
});

export default Input;