import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ImageBackground, StatusBar, Button, Image, TouchableOpacity } from 'react-native';
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
                <TouchableOpacity 
                  key={account.id} 
                  style={styles.accountItem}
                  onPress={() => navigation.navigate('TransactionDetail', { 
                    accountId: account.id, 
                    accountName: account.accountType,
                    accountBalance: account.balance,
                    accountCurrency: account.currency
                  })}
                  activeOpacity={0.7}
                >
                  <Text style={styles.accountName}>
                    {account.accountType}
                  </Text>
                  <Text style={styles.accountBalance}>
                    {account.currency} {account.balance.toFixed(2)}
                  </Text>
                  <Text style={styles.accountId}>Account ID: {account.id}</Text>
                </TouchableOpacity>
              ))
            ) : (
              <Text style={styles.loadingText}>No accounts found.</Text>
            )}
          </View>
          {/* Button removed in favor of Transfers tab */}
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
  accountItem: {
    width: '100%',
    marginBottom: 16,
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  accountName: {
    fontSize: 20,
    fontWeight: '600',
    color: PRIMARY_BLUE,
  },
  accountBalance: {
    fontSize: 16,
    color: '#555',
    marginTop: 4,
  },
  accountId: {
    fontSize: 14,
    color: '#adb5bd',
    marginTop: 4,
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