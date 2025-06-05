import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Alert,
  ActivityIndicator 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useUser } from '../context/UserContext';
import { PRIMARY_BLUE } from '../src/constants/colors';

const ProfileScreen = () => {
  const navigation = useNavigation();
  const { userId, fullName, accounts, clearUser } = useUser();

  // Logout handler for top-right button
  const handleLogout = () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Log Out',
          onPress: () => {
            clearUser();
            navigation.navigate('Login');
          },
          style: 'destructive',
        },
      ]
    );
  };

  if (!userId) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4361ee" />
      </View>
    );
  }
  
  // Remove logout from menuItems; handled by top-right button
  const menuItems = [
  { id: '1', title: 'Personal Information', screen: 'PersonalInfo' },
  { id: '2', title: 'My Cards', screen: 'MyCards' },
  { id: '3', title: 'Statements', screen: 'Statements' },
  { id: '4', title: 'Security', screen: 'Security' },
  { id: '5', title: 'Help & Support', screen: 'Help' },
  { id: '6', title: 'Settings', screen: 'Settings' },
];

  return (
    <ScrollView style={styles.container}>
      {/* Header with user info */}
      <View style={styles.header}>
        {/* Top-right logout icon */}
        <View style={{ position: 'absolute', top: 16, right: 16, zIndex: 10 }}>
          <TouchableOpacity onPress={handleLogout} style={{ padding: 8 }}>
            <MaterialCommunityIcons name="logout-variant" size={28} color="#e63946" />
          </TouchableOpacity>
        </View>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>
            {fullName ? fullName.charAt(0).toUpperCase() : 'U'}
          </Text>
        </View>
        <Text style={styles.userName}>{fullName || 'User'}</Text>
        <Text style={styles.userEmail}>UserID: {userId}</Text>
        <Text style={styles.userSince}>Member since {new Date().getFullYear()}</Text>
      </View>

      {/* Accounts section */}
      <View style={styles.accountsSection}>
        <Text style={styles.sectionTitle}>My Accounts</Text>
        {accounts && accounts.length > 0 ? (
          accounts.map(account => (
            <View key={account.id} style={styles.accountCard}>
              <View style={styles.accountHeader}>
                <Text style={styles.accountName}>{account.accountType}</Text>
                <Text style={styles.accountNumber}>{account.id}</Text>
              </View>
              <Text style={styles.accountBalance}>
                {account.currency} {account.balance.toFixed(2)}
              </Text>
            </View>
          ))
        ) : (
          <Text style={{ color: '#adb5bd', marginLeft: 8 }}>No accounts found.</Text>
        )}
      </View>

      {/* Menu section */}
      <View style={styles.menuSection}>
        <Text style={styles.sectionTitle}>Account Settings</Text>
        {menuItems.map(item => (
          <TouchableOpacity 
            key={item.id} 
            style={styles.menuItem}
            onPress={() => item.onPress ? item.onPress() : (item.screen ? navigation.navigate(item.screen) : null)}
          >
            <View style={styles.menuItemLeft}>
  <Text style={styles.menuItemText}>{item.title}</Text>
</View>
            
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF9E3',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF9E3',
  },
  header: {
    backgroundColor: '#FFF9E3',
    padding: 24,
    paddingTop: 48,
    alignItems: 'center',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    marginBottom: 24,
    alignItems: 'center',
    padding: 24,
    paddingTop: 48,
    marginBottom: 8,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#e9ecef',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 36,
    fontWeight: '600',
    color: PRIMARY_BLUE,
  },
  cameraButton: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: '#4361ee',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: PRIMARY_BLUE,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: '#a1a1a1',
    marginBottom: 4,
  },
  userSince: {
    fontSize: 14,
    color: '#adb5bd',
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    width: '100%',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#222',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#a1a1a1',
  },
  statDivider: {
    width: 1,
    height: '100%',
    backgroundColor: '#e9ecef',
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222',
    marginBottom: 12,
    marginLeft: 4,
  },
  accountCard: {
    marginBottom: 12,
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  accountHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  accountIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(67, 97, 238, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  accountName: {
    fontSize: 16,
    fontWeight: '600',
    color: PRIMARY_BLUE,
    marginRight: 8,
  },
  accountNumber: {
    fontSize: 14,
    color: '#a1a1a1',
  },
  accountBalance: {
    fontSize: 16,
    fontWeight: '700',
    color: PRIMARY_BLUE,
  },
  addAccountButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderRadius: 12,
    backgroundColor: '#fff',
    marginTop: 8,
  },
  addAccountText: {
    marginLeft: 8,
    color: PRIMARY_BLUE,
    fontWeight: '600',
  },
  menuCard: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(67, 97, 238, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuItemText: {
    fontSize: 16,
    color: PRIMARY_BLUE,
  },
  menuDivider: {
    height: 1,
    backgroundColor: '#f1f3f5',
    marginLeft: 72,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#ffe3e3',
  },
  logoutText: {
    marginLeft: 8,
    color: '#e63946',
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  versionText: {
    fontSize: 12,
    color: '#adb5bd',
  },
});

export default ProfileScreen;
