import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ImageBackground, StatusBar, Button, Image } from 'react-native';
import { useTransactions } from '../context/TransactionContext';
import { LIGHT_YELLOW, PRIMARY_BLUE } from '../src/constants/colors';
import { useUser } from '../context/UserContext';

const DashboardScreen = ({ navigation }) => {
  const { accounts, fullName } = useUser();

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#FFD600" />
      <View style={{ alignItems: 'center', marginTop: 40, marginBottom: 20 }}>
        <Image
          source={require('../assets/a1.png')}
          style={{ width: 90, height: 90 }}
          resizeMode="contain"
        />
      </View>
      <ImageBackground
        source={require('../assets/a1.png')}
        style={styles.background}
        imageStyle={{ opacity: 0.13 }}
      >
        <View style={[styles.overlayContainer, { justifyContent: 'center', alignItems: 'center', flex: 1 }]}>  
          <Text style={styles.header}>Welcome{fullName ? `, ${fullName.split(' ')[0]}` : ''}!</Text>
          <View style={styles.balanceContainer}>
            <Text style={styles.balanceLabel}>Your Accounts:</Text>
            {accounts && accounts.length > 0 ? (
              accounts.map(account => (
                <View key={account.id} style={{ marginBottom: 16, alignItems: 'center' }}>
                  <Text style={{ fontSize: 20, fontWeight: '600', color: PRIMARY_BLUE }}>
                    {account.accountType}
                  </Text>
                  <Text style={{ fontSize: 16, color: '#555' }}>
                    {account.currency} {account.balance.toFixed(2)}
                  </Text>
                  <Text style={{ fontSize: 14, color: '#adb5bd' }}>Account ID: {account.id}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.loadingText}>No accounts found.</Text>
            )}
          </View>
          <View style={styles.buttonContainer}>
            <Button
              title="Create New Transaction"
              onPress={() => navigation.navigate('TransactionScreen')}
              color={PRIMARY_BLUE}
              titleStyle={{ color: PRIMARY_BLUE }}
            />
          </View>
        </View>
      </ImageBackground>
    </>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  overlayContainer: {
    flex: 1,
    padding: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    color: PRIMARY_BLUE, 
    textShadowColor: PRIMARY_BLUE,
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  balanceContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: 30,
    alignItems: 'center',
    minWidth: '80%',
  },
  balanceLabel: {
    fontSize: 18,
    color: '#555',
    marginBottom: 10,
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 300,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    fontStyle: 'italic',
  }
});

export default DashboardScreen;