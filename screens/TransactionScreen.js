import React, { useState } from 'react';
import { useTransactions } from '../context/TransactionContext';
import { useUser } from '../context/UserContext';
import { View, Text, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Menu, Provider as PaperProvider } from 'react-native-paper';
import AccountSelector from '../components/AccountSelector';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Button as CustomButton, Card } from '../components';
import { TextInput } from 'react-native-paper';
import { LIGHT_YELLOW, PRIMARY_BLUE } from '../src/constants/colors';


const TransactionScreen = () => {
  const navigation = useNavigation();
  
  
  const { accounts } = useUser();
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    fromAccount: accounts && accounts.length > 0 ? accounts[0].id : '',
    toAccount: accounts && accounts.length > 1 ? accounts[1].id : '',
    category: 'transfer',
  });
// thanks for the help

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
      description: '',
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
    
    // Find the account details for display
    const fromAccount = accounts.find(acc => acc.id === formData.fromAccount) || {};
    const toAccount = accounts.find(acc => acc.id === formData.toAccount) || {};
    // Show confirmation dialog before finalizing
    Alert.alert(
      'Confirm Transfer',
      `Transfer $${formData.amount} from ${fromAccount.accountType || 'account'} to ${toAccount.accountType || 'account'}${formData.description ? ` for "${formData.description}"` : ''}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: () => {
            setIsLoading(true);
            setTimeout(() => {
              addTransaction({
                type: 'transfer',
                amount: parseFloat(formData.amount),
                fromAccount: formData.fromAccount,
                toAccount: formData.toAccount,
                description: formData.description,
                category: 'transfer',
              });
              setIsLoading(false);
              Alert.alert('Success', 'Transfer completed!', [
                { text: 'OK', onPress: () => navigation.goBack() },
              ]);
            }, 1000);
          },
        },
      ]
    );
  };

  return (
    <KeyboardAvoidingView 
      style={[styles.container, { backgroundColor: LIGHT_YELLOW }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <View style={{ flex: 1, backgroundColor: '#FFF9E3' }}>
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center', paddingBottom: 90 }}>
          <Card style={[styles.card, { width: '90%', padding: 24, backgroundColor: '#FFF9E3' }]}>    
            <Text style={[styles.sectionTitle, { color: PRIMARY_BLUE, textAlign: 'center', marginBottom: 32 }]}>Add New Transaction</Text>

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
/>

            {/* Amount Input (required) */}
            <TextInput
              label="Amount*"
              value={formData.amount}
              onChangeText={(text) => handleInputChange('amount', text.replace(/[^0-9.]/g, ''))}
              keyboardType="numeric"
              placeholder="0.00 (required)"
              style={[styles.input, { color: PRIMARY_BLUE }]}
              mode="outlined"
              theme={{
                colors: {
                  primary: LIGHT_YELLOW,
                  text: PRIMARY_BLUE,
                  placeholder: '#a1a1a1',
                  background: '#FFF9E3',
                },
                roundness: 8,
              }}
            />

            {/* Reason Input (optional) */}
            <TextInput
              label="Reason (optional)"
              value={formData.description}
              onChangeText={(text) => handleInputChange('description', text)}
              placeholder="Reason for transfer (optional)"
              style={[styles.input, { color: PRIMARY_BLUE }]}
              mode="outlined"
              theme={{
                colors: {
                  primary: LIGHT_YELLOW,
                  text: PRIMARY_BLUE,
                  placeholder: '#a1a1a1',
                  background: '#FFF9E3',
                },
                roundness: 8,
              }}
            />
          </Card>
        </ScrollView>
        {/* Action buttons at the very bottom */}
        <View style={styles.buttonRow}>
          <CustomButton
            mode="contained"
            onPress={handleClear}
            style={[styles.actionButton, styles.clearButton]}
            labelStyle={styles.actionButtonLabel}
          >
            Clear
          </CustomButton>
          <CustomButton
            mode="contained"
            onPress={handleCreateTransaction}
            style={[styles.actionButton, styles.sendButton]}
            labelStyle={styles.actionButtonLabel}
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
    color: PRIMARY_BLUE,
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
    fontSize: 16,
    marginRight: 8,
    fontWeight: '500',
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
    borderColor: LIGHT_YELLOW,
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
    justifyContent: 'space-between',
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
    backgroundColor: '#4361ee',
    elevation: 2,
  },
  sendButton: {
    alignSelf: 'flex-end',
  },
  clearButton: {
    alignSelf: 'flex-start',
  },
  actionButtonLabel: {
    color: '#FFD600',
    fontWeight: 'bold',
    fontSize: 18,
    letterSpacing: 1,
  },
});

export default TransactionScreen;