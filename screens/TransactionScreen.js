import React, { useState } from 'react';
import { useTransactions } from '../context/TransactionContext';
import { useUser } from '../context/UserContext';
import { View, Text, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator } from 'react-native';
import { Menu, Provider as PaperProvider } from 'react-native-paper';
import AccountSelector from '../components/AccountSelector';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Button as CustomButton, Card } from '../components';
import { TextInput } from 'react-native-paper';
import { PRIMARY, ACCENT, NEUTRAL, SEMANTIC } from '../src/constants/colors';
import { postMoveFunds } from '../src/services/apiService';


const TransactionScreen = () => {
  const navigation = useNavigation();
  
  const { accounts } = useUser();
  const [formData, setFormData] = useState({
    amount: '',
    fromAccount: accounts && accounts.length > 0 ? accounts[0].id : '',
    toAccount: accounts && accounts.length > 1 ? accounts[1].id : '',
    category: 'transfer',
  });
// ther are many new changes in the code.
  // Menu state for dropdowns
  const [fromMenuVisible, setFromMenuVisible] = useState(false);
  const [toMenuVisible, setToMenuVisible] = useState(false);

  // Helper to get a display name for an account by ID
  const getAccountDisplayName = (id) => {
    if (!id) return 'Select Account';
    const acc = accounts.find(a => a.id === id);
    return acc ? `${acc.accountType} (${acc.id.slice(-4)}) - $${acc.balance.toFixed(2)}` : 'Select Account';
  };


  // Handler to clear all fields
  const handleClear = () => {
    setFormData({
      amount: '',
      fromAccount: accounts && accounts.length > 0 ? accounts[0].id : '',
      toAccount: accounts && accounts.length > 1 ? accounts[1].id : '',
      category: 'transfer',
    });
  };
  const [isLoading, setIsLoading] = useState(false);

  const categories = [
    { id: 'food', name: 'Food & Dining' },
    { id: 'shopping', name: 'Shopping' },
    { id: 'bills', name: 'Bills & Utilities' },
    { id: 'transfer', name: 'Transfer' },
    { id: 'entertainment', name: 'Entertainment' },
    { id: 'other', name: 'Other' },
  ];

  const handleInputChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const { addTransaction } = useTransactions();

  const handleCreateTransaction = () => {
    if (!formData.fromAccount || !formData.toAccount || !formData.amount) {
      Alert.alert('Error', 'Please select both accounts and enter an amount.');
      return;
    }
    
    if (formData.fromAccount === formData.toAccount) {
      Alert.alert('Error', 'From and To accounts must be different.');
      return;
    }
    
    // Parse amount as float for validation
    const amountValue = parseFloat(formData.amount);
    if (isNaN(amountValue) || amountValue <= 0) {
      Alert.alert('Error', 'Please enter a valid amount greater than zero.');
      return;
    }
    
    // Find the account details for display and validation
    const fromAccount = accounts.find(acc => acc.id === formData.fromAccount) || {};
    const toAccount = accounts.find(acc => acc.id === formData.toAccount) || {};
    
    // Check for insufficient funds
    if (fromAccount.balance < amountValue) {
      Alert.alert('Insufficient Funds', `You don't have enough funds in ${fromAccount.accountType}. Available balance: $${fromAccount.balance.toFixed(2)}`);
      return;
    }
    
    // Show confirmation dialog before finalizing
    Alert.alert(
      'Confirm Transfer',
      `Transfer $${formData.amount} from ${fromAccount.accountType || 'account'} to ${toAccount.accountType || 'account'}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: () => {
            setIsLoading(true);
            
            // Call the API to move funds between accounts
            postMoveFunds(
              formData.fromAccount, 
              formData.toAccount, 
              formData.amount
            )
            .then(response => {
              // API call succeeded
              console.log('Transfer successful:', response);
              
              // Add local transaction record
              addTransaction({
                type: 'transfer',
                amount: parseFloat(formData.amount),
                fromAccount: formData.fromAccount,
                toAccount: formData.toAccount,
                date: new Date().toISOString(),
                status: 'completed',
                notes: `Transfer to ${toAccount.accountType || 'account'}`
              });
              
              // Clear form data
              handleClear();
              
              // Show success message
              Alert.alert(
                'Transfer Successful',
                `$${formData.amount} has been transferred successfully.`,
                [
                  {
                    text: 'OK',
                    onPress: () => {
                      // Navigate to transactions screen or detail screen
                      navigation.navigate('TransactionDetailScreen', {
                        transaction: {
                          type: 'transfer',
                          amount: parseFloat(formData.amount),
                          fromAccount: formData.fromAccount,
                          toAccount: formData.toAccount,
                          date: new Date().toISOString(),
                          status: 'completed'
                        }
                      });
                    }
                  }
                ]
              );
            })
            .catch(error => {
              // API call failed
              console.error('Transfer error:', error);
              Alert.alert(
                'Transfer Failed',
                'There was an error processing your transfer. Please try again later.',
                [{ text: 'OK' }]
              );
            })
            .finally(() => {
              setIsLoading(false);
            });
          }
        }
      ]
    );
  };

  return (
    <KeyboardAvoidingView 
      style={[styles.container, { backgroundColor: ACCENT.LIGHT }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <View style={{ flex: 1, backgroundColor: '#FFF9E3' }}>
        {isLoading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color={PRIMARY.MAIN} />
            <Text style={styles.loadingText}>Processing transaction...</Text>
          </View>
        )}
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center', paddingBottom: 90 }}>
          <Card style={[styles.card, { width: '90%', padding: 24, backgroundColor: '#FFF9E3' }]}>    
            <Text style={[styles.sectionTitle, { color: PRIMARY.MAIN, textAlign: 'center', marginBottom: 32 }]}>Move Between Accounts</Text>

            <AccountSelector
              label="From Account*"
              accounts={accounts}
              selectedAccountId={formData.fromAccount}
              onSelect={id => handleInputChange('fromAccount', id)}
              testID="from-account-selector"
            />
            <AccountSelector
              label="To Account*"
              accounts={accounts}
              selectedAccountId={formData.toAccount}
              onSelect={id => handleInputChange('toAccount', id)}
              testID="to-account-selector"
              filteredAccountIds={[formData.fromAccount]}
            />

            <View style={styles.amountInputContainer}>
              <TextInput
                label="Amount*"
                value={formData.amount}
                onChangeText={(text) => handleInputChange('amount', text.replace(/[^0-9.]/g, ''))}
                keyboardType="numeric"
                placeholder="0.00"
                style={[styles.input, { color: '#000', backgroundColor: '#fff' }]}
                mode="outlined"
                theme={{
                  colors: {
                    primary: PRIMARY.MAIN,
                    text: '#000',
                    placeholder: '#777',
                    background: '#fff',
                    outline: PRIMARY.MAIN,
                  },
                  roundness: 12,
                }}
                outlineStyle={{ borderWidth: 2 }}
                left={<TextInput.Affix text="$" textStyle={styles.currencySymbol} />}
              />
            </View>
          </Card>
        </ScrollView>
        {/* Action button centered at the bottom */}
        <View style={styles.buttonRow}>
          <CustomButton
            mode="contained"
            onPress={handleCreateTransaction}
            style={[styles.actionButton, styles.sendButton]}
            color="#003E6D"
            labelStyle={styles.actionButtonLabel}
            disabled={isLoading}
          >
            Send
          </CustomButton>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  card: {
    margin: 16,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 20,
    color: PRIMARY.MAIN,
  },
  input: {
    marginBottom: 16,
    backgroundColor: 'transparent',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: 12,
  },
  currencySymbol: {
    fontSize: 18,
    marginRight: 8,
    fontWeight: '600',
    color: '#000',
  },
  amountInputContainer: {
    width: '100%',
    marginBottom: 16,
  },
  inputIcon: {
    marginRight: 8,
  },
  section: {
    marginTop: 8,
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
    fontWeight: '500',
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  categoryButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: ACCENT.LIGHT,
    marginRight: 8,
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 14,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
  },
  // Remove submitButton, use actionButton styles for new layout
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    position: 'absolute',
    bottom: 0,
    left: 0,
    paddingHorizontal: 24,
    paddingBottom: 16,
    backgroundColor: 'transparent',
  },
  actionButton: {
    width: '45%',
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#003E6D',
    elevation: 2,
  },
  sendButton: {
    // Uses parent's justifyContent: 'center'
  },
  actionButtonLabel: {
    color: ACCENT.MAIN,
    fontWeight: '500',
    fontSize: 20,
    letterSpacing: 0.5,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: `${ACCENT.LIGHT}CC`,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  loadingText: {
    marginTop: 10,
    color: PRIMARY.MAIN,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default TransactionScreen;