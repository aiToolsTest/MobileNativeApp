import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Button, Card } from '../components';
import { useTransactions } from '../context/TransactionContext';
import { TextInput } from 'react-native-paper';
import { PRIMARY, ACCENT, NEUTRAL, SEMANTIC } from '../src/constants/colors';

const TransferScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const { type = 'send' } = route.params || {};
  
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [selectedContact, setSelectedContact] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [contacts, setContacts] = useState([
    { id: '1', name: 'John Doe', phone: '(555) 123-4567', avatar: 'JD' },
    { id: '2', name: 'Jane Smith', phone: '(555) 987-6543', avatar: 'JS' },
    { id: '3', name: 'Alex Johnson', phone: '(555) 456-7890', avatar: 'AJ' },
    { id: '4', name: 'Sarah Wilson', phone: '(555) 234-5678', avatar: 'SW' },
    { id: '5', name: 'Mike Brown', phone: '(555) 876-5432', avatar: 'MB' },
  ]);
  
  const recentTransactions = [
    { id: 't1', name: 'John Doe', amount: 125.50, date: '2023-06-15', type: 'sent' },
    { id: 't2', name: 'Jane Smith', amount: 85.00, date: '2023-06-10', type: 'received' },
    { id: 't3', name: 'Alex Johnson', amount: 200.00, date: '2023-06-05', type: 'sent' },
  ];

  const handleAmountChange = (text) => {
    // Allow only numbers and one decimal point
    const cleanedText = text.replace(/[^0-9.]/g, '');
    
    // Ensure only one decimal point
    const decimalCount = (cleanedText.match(/\./g) || []).length;
    if (decimalCount > 1) return;
    
    // Format as currency
    if (cleanedText === '') {
      setAmount('');
      return;
    }
    
    // Add decimal places if needed
    let formattedAmount = cleanedText;
    if (decimalCount === 0 && cleanedText.length > 0) {
      formattedAmount = (parseFloat(cleanedText) / 100).toFixed(2);
    } else if (decimalCount === 1) {
      const parts = cleanedText.split('.');
      if (parts[1].length > 2) {
        parts[1] = parts[1].substring(0, 2);
        formattedAmount = parts.join('.');
      }
    }
    
    setAmount(formattedAmount);
  };

  const handleContactSelect = (contact) => {
    setSelectedContact(contact);
  };

  const { addTransaction } = useTransactions();
const handleContinue = () => {
    if (!selectedContact) {
      Alert.alert('Error', 'Please select a contact');
      return;
    }
    
    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }
    
    // Show confirmation before transfer
    Alert.alert(
      'Confirm Transfer',
      `Send $${amount} to ${selectedContact?.name || ''}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: () => {
            setIsLoading(true);
            setTimeout(() => {
              addTransaction({
                type: 'sent',
                amount: parseFloat(amount),
                recipient: selectedContact?.name || '',
                description: note || '',
                category: 'transfer',
              });
              setIsLoading(false);
              Alert.alert('Success', 'Transfer complete!', [
                { text: 'OK', onPress: () => navigation.navigate('Main', { screen: 'Home' }) },
              ]);
            }, 1000);
          },
        },
      ]
    );
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <LinearGradient
        colors={['#f8f9fa', '#e9ecef']}
        style={styles.background}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Icon name="arrow-back" size={24} color="#4361ee" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>
              {type === 'send' ? 'Send Money' : 'Request Money'}
            </Text>
            <View style={styles.headerRight} />
          </View>
          
          {/* Amount Input */}
          <Card style={styles.amountCard}>
            <View style={styles.amountContainer}>
              <Text style={styles.amountLabel}>
                {type === 'send' ? 'You send' : 'You request'}
              </Text>
              <View style={styles.amountInputContainer}>
                <Text style={styles.currencySymbol}>$</Text>
                <TextInput
                  style={styles.amountInput}
                  value={amount}
                  onChangeText={handleAmountChange}
                  placeholder="0.00"
                  placeholderTextColor="#a1a1a1"
                  keyboardType="decimal-pad"
                  returnKeyType="done"
                  autoFocus={!selectedContact}
                />
              </View>
              <Text style={styles.balanceText}>
                Available: {formatCurrency(5420.50)}
              </Text>
            </View>
          </Card>
          
          {/* Selected Contact */}
          {selectedContact ? (
            <Card style={styles.selectedContactCard}>
              <View style={styles.selectedContactContainer}>
                <View style={styles.avatarContainer}>
                  <Text style={styles.avatarText}>{selectedContact.avatar}</Text>
                </View>
                <View style={styles.contactInfo}>
                  <Text style={styles.contactName}>{selectedContact.name}</Text>
                  <Text style={styles.contactPhone}>{selectedContact.phone}</Text>
                </View>
                <TouchableOpacity 
                  style={styles.changeButton}
                  onPress={() => setSelectedContact(null)}
                >
                  <Text style={styles.changeButtonText}>Change</Text>
                </TouchableOpacity>
              </View>
            </Card>
          ) : (
            <>
              {/* Search Contacts */}
              <Card style={styles.searchCard}>
                <TextInput
                  placeholder="Search name, @username, or email"
                  left={
                    <TextInput.Icon 
                      icon={(props) => (
                        <Icon name="search" size={20} color="#a1a1a1" />
                      )}
                    />
                  }
                  style={styles.searchInput}
                  mode="outlined"
                  outlineColor="transparent"
                  activeOutlineColor="#4361ee"
                  theme={{
                    colors: {
                      background: "#fff",
                      text: "#222",
                      placeholder: "#a1a1a1",
                    },
                  }}  
                  roundness={8}
                />
              </Card>
              
              {/* Recent Transactions */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Recent</Text>
                <ScrollView 
                  horizontal 
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.recentScroll}
                >
                  {recentTransactions.map((txn) => (
                    <TouchableOpacity 
                      key={txn.id}
                      style={styles.recentContact}
                      onPress={() => {
                        const contact = contacts.find(c => c.name === txn.name);
                        if (contact) handleContactSelect(contact);
                      }}
                    >
                      <View style={[
                        styles.recentAvatar,
                        txn.type === 'sent' ? styles.sentAvatar : styles.receivedAvatar
                      ]}>
                        <Icon 
                          name={txn.type === 'sent' ? 'arrow-upward' : 'arrow-downward'} 
                          size={16} 
                          color="#fff" 
                        />
                      </View>
                      <Text style={styles.recentName} numberOfLines={1}>
                        {txn.name.split(' ')[0]}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
              
              {/* All Contacts */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>All Contacts</Text>
                <Card style={styles.contactsCard}>
                  {contacts.map((contact) => (
                    <TouchableOpacity
                      key={contact.id}
                      style={styles.contactItem}
                      onPress={() => handleContactSelect(contact)}
                    >
                      <View style={styles.contactAvatar}>
                        <Text style={styles.contactAvatarText}>{contact.avatar}</Text>
                      </View>
                      <View style={styles.contactDetails}>
                        <Text style={styles.contactName}>{contact.name}</Text>
                        <Text style={styles.contactPhone}>{contact.phone}</Text>
                      </View>
                      <Icon name="chevron-right" size={24} color="#ced4da" />
                    </TouchableOpacity>
                  ))}
                </Card>
              </View>
            </>
          )}
          
          {/* Note Input */}
          {selectedContact && (
            <Card style={styles.noteCard}>
              <TextInput
                label="Add a note (optional)"
                placeholder="What's it for?"
                value={note}
                onChangeText={setNote}
                left={
                  <TextInput.Icon 
                    icon={(props) => (
                      <Icon name="note" size={20} color="#a1a1a1" />
                    )}
                  />
                }
                style={styles.noteInput}
                mode="outlined"
                multiline
                numberOfLines={2}
                outlineColor="transparent"
                activeOutlineColor="#4361ee"
                theme={{
                  colors: {
                    background: "#fff",
                    text: "#222",
                    placeholder: "#a1a1a1",
                  },
                }}  
                roundness={8}
              />
            </Card>
          )}
          
          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <Button
              title={selectedContact ? 'Continue' : 'Skip for now'}
              onPress={selectedContact ? handleContinue : () => {}}
              disabled={selectedContact && !amount}
              loading={isLoading}
              icon={<Icon name="arrow-forward" size={20} color="#fff" />}
              iconPosition="right"
              style={styles.continueButton}
            />
          </View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  background: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 30,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    paddingTop: 50,
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#212529',
    flex: 1,
    textAlign: 'center',
    marginLeft: -40,
  },
  headerRight: {
    width: 40,
  },
  amountCard: {
    marginHorizontal: 20,
    marginTop: 10,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 2,
  },
  amountContainer: {
    padding: 24,
    alignItems: 'center',
  },
  amountLabel: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 8,
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  currencySymbol: {
    fontSize: 32,
    fontWeight: '700',
    color: '#212529',
    marginRight: 4,
    marginTop: -4,
  },
  amountInput: {
    fontSize: 40,
    fontWeight: '700',
    color: '#212529',
    padding: 0,
    margin: 0,
    minWidth: 120,
    textAlign: 'center',
  },
  balanceText: {
    fontSize: 14,
    color: '#6c757d',
  },
  selectedContactCard: {
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 2,
  },
  selectedContactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#4361ee',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212529',
    marginBottom: 2,
  },
  contactPhone: {
    fontSize: 14,
    color: '#6c757d',
  },
  changeButton: {
    padding: 8,
  },
  changeButtonText: {
    color: '#4361ee',
    fontWeight: '600',
    fontSize: 14,
  },
  searchCard: {
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 2,
  },
  searchInput: {
    marginBottom: 0,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212529',
    marginLeft: 20,
    marginBottom: 12,
  },
  recentScroll: {
    paddingHorizontal: 16,
  },
  recentContact: {
    alignItems: 'center',
    marginRight: 16,
    width: 60,
  },
  recentAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  sentAvatar: {
    backgroundColor: '#e63946',
  },
  receivedAvatar: {
    backgroundColor: '#2ecc71',
  },
  recentName: {
    fontSize: 12,
    color: '#495057',
    textAlign: 'center',
  },
  contactsCard: {
    marginHorizontal: 20,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 2,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f3f5',
  },
  contactAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e9ecef',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  contactAvatarText: {
    color: '#495057',
    fontWeight: '600',
    fontSize: 14,
  },
  contactDetails: {
    flex: 1,
  },
  noteCard: {
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 2,
  },
  noteInput: {
    marginBottom: 0,
  },
  buttonContainer: {
    paddingHorizontal: 20,
    marginTop: 24,
  },
  continueButton: {
    marginBottom: 16,
  },
});

export default TransferScreen;
