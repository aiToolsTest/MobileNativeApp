import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar, Platform, View, ActivityIndicator, StyleSheet, LogBox } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Provider as PaperProvider, MD3LightTheme } from 'react-native-paper';
import { customTheme, getIconForName } from './src/utils/iconConfig';
import { AuthProvider } from './context/AuthContext';
import { useUser } from './context/UserContext';
import { TransactionProvider } from './context/TransactionContext';
import { UserProvider } from './context/UserContext';
import ProtectedRoute from './components/ProtectedRoute';
import { Text } from 'react-native';

// Disable all error and warning messages on the app screen
// They will still be logged to the console for debugging
LogBox.ignoreAllLogs();

// Screens
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import DashboardScreen from './screens/DashboardScreen';
import TransferScreen from './screens/TransferScreen';
import TransactionsScreen from './screens/TransactionsScreen';
import TransactionDetailScreen from './screens/TransactionDetailScreen';
import ProfileScreen from './screens/ProfileScreen';
import SettingsScreen from './screens/SettingsScreen';
import TransactionScreen from './screens/TransactionScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Tab Navigator
const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          if (route.name === 'Home') {
            return <MaterialIcons name="home" size={size} color={color} />;
          } else if (route.name === 'Transfers') {
            return <MaterialIcons name="swap-horiz" size={size} color={color} />;
          } else if (route.name === 'Profile') {
            return <MaterialIcons name="account-circle" size={size} color={color} />;
          }
          return null;
        },
        tabBarActiveTintColor: '#003E6D',
        tabBarInactiveTintColor: '#6c757d',
        tabBarStyle: {
          height: Platform.OS === 'ios' ? 90 : 70,
          paddingBottom: Platform.OS === 'ios' ? 25 : 10,
          paddingTop: 10,
          borderTopWidth: 1,
          borderTopColor: '#f1f3f5',
          backgroundColor: '#fff',
          elevation: 10,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -5 },
          shadowOpacity: 0.1,
          shadowRadius: 10,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
          marginBottom: 5,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={DashboardScreen} />
      <Tab.Screen name="Transfers" component={TransactionScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

// Main App Component with Navigation
const App = () => {
  const { userId } = useUser();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#4361ee',
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 0,
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontFamily: 'System',
          fontWeight: '500',
          fontSize: 18,
        },
        headerBackTitleVisible: false,
        headerBackTitle: null,
        headerLeftContainerStyle: {
          paddingLeft: 10,
        },
        headerBackImage: () => (
          <Icon 
            name="arrow-back" 
            size={24} 
            color="#fff" 
          />
        ),
      }}
    >
      {!userId ? (
        // Not signed in
        <>
          <Stack.Screen 
            name="Login" 
            component={LoginScreen} 
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="Register" 
            component={RegisterScreen} 
            options={{ title: 'Create Account' }}
          />
        </>
      ) : (
        // Signed in
        <>
          <Stack.Screen 
            name="Main" 
            component={MainTabs} 
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="TransferStack" 
            component={TransferScreen} 
            options={{ title: 'Transfer Money' }}
          />
          <Stack.Screen 
            name="TransactionDetail" 
            component={TransactionDetailScreen} 
            options={{ title: 'Transaction Details' }}
          />
          <Stack.Screen 
            name="Settings" 
            options={{ title: 'Settings' }}
          >
            {() => (
              <ProtectedRoute>
                <SettingsScreen />
              </ProtectedRoute>
            )}
          </Stack.Screen>
          <Stack.Screen 
  name="TransactionScreen" 
  component={TransactionScreen} 
  options={{ title: 'Create Transaction' }} 
/>
<Stack.Screen name="PersonalInfo" options={{ title: 'Personal Info' }}>
  {() => (<View style={{flex:1,justifyContent:'center',alignItems:'center'}}><Text>PersonalInfo Placeholder</Text></View>)}
</Stack.Screen>
<Stack.Screen name="MyCards" options={{ title: 'My Cards' }}>
  {() => (<View style={{flex:1,justifyContent:'center',alignItems:'center'}}><Text>MyCards Placeholder</Text></View>)}
</Stack.Screen>
<Stack.Screen name="Statements" options={{ title: 'Statements' }}>
  {() => (<View style={{flex:1,justifyContent:'center',alignItems:'center'}}><Text>Statements Placeholder</Text></View>)}
</Stack.Screen>
<Stack.Screen name="Security" options={{ title: 'Security' }}>
  {() => (<View style={{flex:1,justifyContent:'center',alignItems:'center'}}><Text>Security Placeholder</Text></View>)}
</Stack.Screen>
<Stack.Screen name="Help" options={{ title: 'Help' }}>
  {() => (<View style={{flex:1,justifyContent:'center',alignItems:'center'}}><Text>Help Placeholder</Text></View>)}
</Stack.Screen>

        </>
      )}
    </Stack.Navigator>
  );
};

// Wrap the main app with providers
const AppWrapper = () => {
  // Create a theme with proper icon provider configuration
  const theme = {
    ...customTheme,
    // Register custom icons for react-native-paper
    icons: {
      // Icon provider for MaterialIcons
      'material': {
        // This function will be used to resolve icon names to components
        getIcon: (name) => getIconForName(name),
      },
    },
  };

  return (
    <PaperProvider theme={theme}>
      <AuthProvider>
        <TransactionProvider>
          <UserProvider>
            <NavigationContainer>
              <StatusBar barStyle="dark-content" backgroundColor="#FFD600" />
              <App />
            </NavigationContainer>
          </UserProvider>
        </TransactionProvider>
      </AuthProvider>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  transferButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#4361ee',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Platform.OS === 'ios' ? 30 : 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});

export default AppWrapper;
