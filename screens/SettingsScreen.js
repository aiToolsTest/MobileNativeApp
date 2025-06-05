import React, { useState, useContext } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Switch, 
  TouchableOpacity, 
  Alert,
  ActivityIndicator 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useAuth } from '../context/AuthContext';

const SettingsScreen = () => {
  const navigation = useNavigation();
  
  // State for toggles
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [autoUpdate, setAutoUpdate] = useState(true);
  
  const settingsSections = [
    {
      title: 'Account',
      items: [
        { 
          id: 'personal', 
          icon: 'person-outline', 
          title: 'Personal Information',
          onPress: () => navigation.navigate('PersonalInfo')
        },
        { 
          id: 'security', 
          icon: 'lock-outline', 
          title: 'Security',
          onPress: () => navigation.navigate('Security')
        },
        { 
          id: 'privacy', 
          icon: 'shield-outline', 
          title: 'Privacy',
          onPress: () => navigation.navigate('Privacy')
        },
      ]
    },
    {
      title: 'Preferences',
      items: [
        { 
          id: 'notifications', 
          icon: 'notifications-none', 
          title: 'Push Notifications',
          rightComponent: (
            <Switch 
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: '#e9ecef', true: '#4361ee' }}
              thumbColor="#fff"
            />
          )
        },
        { 
          id: 'biometric', 
          icon: 'fingerprint', 
          title: 'Biometric Login',
          subtitle: 'Use your fingerprint or face to log in',
          rightComponent: (
            <Switch 
              value={biometricEnabled}
              onValueChange={setBiometricEnabled}
              trackColor={{ false: '#e9ecef', true: '#4361ee' }}
              thumbColor="#fff"
            />
          )
        },
        { 
          id: 'darkMode', 
          icon: 'dark-mode', 
          title: 'Dark Mode',
          rightComponent: (
            <Switch 
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{ false: '#e9ecef', true: '#4361ee' }}
              thumbColor="#fff"
            />
          )
        },
        { 
          id: 'language', 
          icon: 'language', 
          title: 'Language',
          subtitle: 'English (United States)',
          onPress: () => navigation.navigate('Language')
        },
        { 
          id: 'currency', 
          icon: 'attach-money', 
          title: 'Currency',
          subtitle: 'USD - US Dollar',
          onPress: () => navigation.navigate('Currency')
        },
      ]
    },
    {
      title: 'Support',
      items: [
        { 
          id: 'help', 
          icon: 'help-outline', 
          title: 'Help Center',
          onPress: () => navigation.navigate('HelpCenter')
        },
        { 
          id: 'contact', 
          icon: 'email-outline', 
          title: 'Contact Support',
          onPress: () => navigation.navigate('ContactSupport')
        },
        { 
          id: 'faq', 
          icon: 'help-outline', 
          title: 'FAQs',
          onPress: () => navigation.navigate('FAQ')
        },
      ]
    },
    {
      title: 'About',
      items: [
        { 
          id: 'about', 
          icon: 'info-outline', 
          title: 'About Us',
          onPress: () => navigation.navigate('AboutUs')
        },
        { 
          id: 'terms', 
          icon: 'description', 
          title: 'Terms of Service',
          onPress: () => navigation.navigate('Terms')
        },
        { 
          id: 'privacyPolicy', 
          icon: 'privacy-tip', 
          title: 'Privacy Policy',
          onPress: () => navigation.navigate('PrivacyPolicy')
        },
        { 
          id: 'version', 
          icon: 'update', 
          title: 'Version',
          rightComponent: <Text style={styles.versionText}>1.0.0</Text>,
          onPress: () => {
            if (autoUpdate) {
              Alert.alert('App is up to date', 'You have the latest version of the app.');
            } else {
              Alert.alert('Update Available', 'A new version of the app is available. Would you like to update now?', [
                { text: 'Not Now', style: 'cancel' },
                { text: 'Update', onPress: () => setAutoUpdate(true) }
              ]);
            }
          }
        },
      ]
    },
    {
      title: 'Danger Zone',
      items: [
        { 
          id: 'logout', 
          icon: 'logout', 
          title: 'Log Out',
          titleStyle: styles.logoutText,
          onPress: () => {
            Alert.alert(
              'Log Out',
              'Are you sure you want to log out?',
              [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Log Out', style: 'destructive', onPress: () => navigation.navigate('Login') }
              ]
            );
          }
        },
        { 
          id: 'delete', 
          icon: 'delete-outline', 
          title: 'Delete Account',
          titleStyle: styles.deleteText,
          onPress: () => {
            Alert.alert(
              'Delete Account',
              'This action cannot be undone. All your data will be permanently deleted.',
              [
                { text: 'Cancel', style: 'cancel' },
                { 
                  text: 'Delete', 
                  style: 'destructive', 
                  onPress: () => {
                    // Handle account deletion
                    navigation.navigate('Login');
                  }
                }
              ]
            );
          }
        },
      ]
    },
  ];

  const renderSection = (section) => (
    <View key={section.title} style={styles.section}>
      <Text style={styles.sectionTitle}>{section.title}</Text>
      <Card style={styles.sectionCard}>
        {section.items.map((item, index) => (
          <React.Fragment key={item.id}>
            <TouchableOpacity 
              style={styles.settingItem}
              onPress={item.onPress}
              disabled={!item.onPress}
            >
              <View style={styles.settingLeft}>
                <View style={styles.iconContainer}>
                  <Icon 
                    name={item.icon} 
                    size={22} 
                    color={item.id === 'logout' ? '#e63946' : item.id === 'delete' ? '#e63946' : '#4361ee'} 
                  />
                </View>
                <View>
                  <Text style={[
                    styles.settingTitle,
                    item.titleStyle
                  ]}>
                    {item.title}
                  </Text>
                  {item.subtitle && (
                    <Text style={styles.settingSubtitle}>{item.subtitle}</Text>
                  )}
                </View>
              </View>
              
              {item.rightComponent || (
                <Icon name="chevron-right" size={24} color="#ced4da" />
              )}
            </TouchableOpacity>
            
            {index < section.items.length - 1 && <View style={styles.divider} />}
          </React.Fragment>
        ))}
      </Card>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Settings</Text>
          <View style={styles.headerRight} />
        </View>
        
        <View style={styles.content}>
          {settingsSections.map(section => renderSection(section))}
        </View>
        
        <View style={styles.footer}>
          <Text style={styles.footerText}>Banking App</Text>
          <Text style={styles.copyrightText}>© 2023 Banking App. All rights reserved.</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    paddingTop: 50,
    backgroundColor: '#4361ee',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    marginBottom: 16,
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
    marginLeft: -24,
  },
  headerRight: {
    width: 40,
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6c757d',
    marginBottom: 8,
    marginLeft: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sectionCard: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(67, 97, 238, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  settingTitle: {
    fontSize: 16,
    color: '#212529',
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#6c757d',
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: '#f1f3f5',
    marginLeft: 72,
  },
  versionText: {
    color: '#6c757d',
    fontSize: 14,
  },
  logoutText: {
    color: '#e63946',
    fontWeight: '500',
  },
  deleteText: {
    color: '#e63946',
    fontWeight: '500',
  },
  footer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  footerText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212529',
    marginBottom: 8,
  },
  copyrightText: {
    fontSize: 12,
    color: '#6c757d',
  },
});

export default SettingsScreen;
