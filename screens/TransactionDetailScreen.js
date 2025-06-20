import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Linking, Share, FlatList } from 'react-native';
import { Card } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { format, parseISO } from 'date-fns';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTransactions } from '../context/TransactionContext';
import { LIGHT_YELLOW, PRIMARY_BLUE } from '../src/constants/colors';

// Helper functions moved outside the component so they're accessible throughout the file
// Format date helper function
const formatDate = (dateString) => {
  const date = parseISO(dateString);
  return format(date, 'EEEE, MMMM d, yyyy');
};

// Get category icon helper function
const getCategoryIcon = (category, type) => {
  switch (category) {
    case 'food':
      return 'restaurant';
    case 'bills':
      return 'receipt';
    case 'shopping':
      return 'shopping-bag';
    case 'entertainment':
      return 'movie';
    case 'subscription':
      return 'subscriptions';
    case 'income':
      return 'account-balance-wallet';
    case 'transfer':
    default:
      return type === 'sent' ? 'arrow-upward' : 'arrow-downward';
  }
};

const TransactionDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { transaction: routeTransaction, accountId, accountName, accountBalance, accountCurrency } = route.params || {};
  const { transactions } = useTransactions();
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  
  // State for loading and error handling
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch transactions for the specific account
  useEffect(() => {
    if (!accountId) return;
    
    const fetchAccountTransactions = async () => {
      console.log(`[AccountDetail] Fetching transactions for account: ${accountId}`);
      setIsLoading(true);
      setError(null);
      
      try {
        // API endpoint for account-specific transactions
        const response = await fetch(`https://bank-poc-api-func.azurewebsites.net/api/transactions/${accountId}`);
        console.log(`[AccountDetail] API response status: ${response.status}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch transactions. Status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log(`[AccountDetail] Received ${data.length} transactions`);
        
        // Sort transactions by date in descending order (latest first)
        const sortedData = [...data].sort((a, b) => {
          try {
            return new Date(b.date) - new Date(a.date);
          } catch (err) {
            console.error('Error sorting dates:', err);
            return 0;
          }
        });
        
        // Process and set the transactions
        setFilteredTransactions(sortedData);
      } catch (err) {
        console.error('[AccountDetail] Error fetching transactions:', err);
        setError('Failed to load transactions for this account');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAccountTransactions();
  }, [accountId]);
  
  // If we're showing account transactions, render the account transactions UI
  if (accountId) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={[LIGHT_YELLOW, LIGHT_YELLOW]}
          style={[styles.headerGradient, { paddingTop: 8 }]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.header}>
            <View>
              <Text style={styles.accountIdHeader}>{accountId}</Text>
              <Text style={styles.headerTitle}>{accountName || 'Account'}</Text>
            </View>
          </View>
          
          <View style={styles.accountSummary}>
            <Text style={styles.accountLabel}>Available Balance</Text>
            <Text style={styles.accountBalance}>$ {accountBalance ? accountBalance.toFixed(2) : '0.00'}</Text>
            <Text style={styles.transfersLabel}>Transfers</Text>
          </View>
        </LinearGradient>
        
        <View style={styles.content}>
          {isLoading ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.loadingText}>Loading transactions...</Text>
            </View>
          ) : error ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity 
                style={styles.refreshButton}
                onPress={() => {
                  if (accountId) {
                    setIsLoading(true);
                    setError(null);
                    fetch(`https://bank-poc-api-func.azurewebsites.net/api/transactions/${accountId}`)
                      .then(response => response.json())
                      .then(data => {
                        // Sort transactions by date in descending order (latest first)
                        const sortedData = [...data].sort((a, b) => {
                          try {
                            return new Date(b.date) - new Date(a.date);
                          } catch (err) {
                            console.error('Error sorting dates:', err);
                            return 0;
                          }
                        });
                        setFilteredTransactions(sortedData);
                        setIsLoading(false);
                      })
                      .catch(err => {
                        console.error('[AccountDetail] Error retrying:', err);
                        setError('Failed to load transactions');
                        setIsLoading(false);
                      });
                  }
                }}
              >
                <Text style={styles.refreshButtonText}>Retry</Text>
              </TouchableOpacity>
            </View>
          ) : filteredTransactions.length > 0 ? (
            <FlatList
              data={filteredTransactions}
              keyExtractor={item => item.id}
              contentContainerStyle={styles.transactionsList}
              renderItem={({ item }) => {
                // Determine if transaction is sent or received
                const isSent = item.sourceAccountId === accountId;
                
                return (
                  <TouchableOpacity 
                    style={styles.transactionItem}
                    onPress={() => navigation.navigate('TransactionDetail', { transaction: item })}
                  >
                    <View style={[
                      styles.transactionIcon, 
                      { backgroundColor: isSent ? '#ffebee' : '#e8f5e9' }
                    ]}>
                      <Icon 
                        name={getCategoryIcon(item.category, isSent ? 'sent' : 'received')}
                        size={20} 
                        color={isSent ? '#e63946' : '#2ecc71'} 
                      />
                    </View>
                    
                    <View style={styles.transactionDetails}>
                      <Text style={styles.transactionTitle} numberOfLines={1}>
                        {isSent ? 
                          `To: ${item.destinationAccountId}` : 
                          `From: ${item.sourceAccountId}`}
                      </Text>
                      <Text style={styles.transactionNote}>{item.note}</Text>
                      <Text style={styles.transactionDate}>
                        {item.date ? format(new Date(item.date), 'MMM d, yyyy - h:mm a') : 'Unknown date'}
                      </Text>
                    </View>
                    <View style={styles.transactionAmount}>
                      <Text 
                        style={[
                          styles.amountText,
                          { color: isSent ? '#e63946' : '#2ecc71' }
                        ]}
                      >
                        {isSent ? '-' : '+'}{item.amount} {item.currency}
                      </Text>
                      {item.status && (
                        <Text 
                          style={[
                            styles.statusText,
                            { color: isSent ? '#e63946' : '#2ecc71' }
                          ]}
                        >
                          {item.status}
                        </Text>
                      )}
                    </View>
                  </TouchableOpacity>
                );
              }}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>No transactions found</Text>
                </View>
              }
            />
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No transactions found for this account</Text>
              <TouchableOpacity 
                style={styles.refreshButton}
                onPress={() => navigation.goBack()}
              >
                <Text style={styles.refreshButtonText}>Go Back</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    );
  }
  
  // If no transaction was passed, we'll redirect back
  if (!routeTransaction) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Transaction details not available.</Text>
      </View>
    );
  }

  // TODO: Fetch user's primary account ID dynamically (e.g., from useUser() context if available).
  const currentUserAccountId = 'ACC001'; // Placeholder, consistent with TransactionsScreen.js
  const isSent = routeTransaction.sourceAccountId === currentUserAccountId;
  const isPending = routeTransaction.status === 'pending';

  const getStatusColor = () => {
    if (isPending) return '#FFC107'; // Amber for pending
    return isSent ? '#D32F2F' : '#4CAF50'; // Red for sent, Green for received
  };

  const transaction = routeTransaction;
  
  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this ${isSent ? 'transfer' : 'transaction'} from ${transaction.fromAccount || ''} to ${transaction.toAccount || ''}: ${transaction.description || ''} - $${(transaction.amount !== undefined && transaction.amount !== null) ? transaction.amount.toFixed(2) : '0.00'}`,
        title: 'Transaction Details',
      });
    } catch (error) {
      console.error('Error sharing:', error.message);
    }
  };
  
  const handleContactSupport = () => {
    // In a real app, this would open a support chat or email
    Linking.openURL('mailto:support@yourbank.com?subject=Question%20about%20transaction');
  };
  
  const handleDispute = () => {
    // In a real app, this would open a dispute form
    navigation.navigate('Dispute', { transactionId: transaction.id });
  };
  
  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={[LIGHT_YELLOW, LIGHT_YELLOW]}
        style={styles.headerGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.header}>
          <View style={{width: 24}} />
          <Text style={styles.headerTitle}></Text>
          <TouchableOpacity 
            style={styles.shareButton}
            onPress={handleShare}
          >
            <Icon name="share" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.amountContainer}>
          <View style={[styles.amountIcon, { backgroundColor: `${getStatusColor()}20` }]}>
            <Icon 
              name={getCategoryIcon('transfer', isSent ? 'sent' : 'received')} 
              size={28} 
              color={getStatusColor()} 
            />
          </View>
          <Text style={[styles.amount, { color: getStatusColor() }]}>
            {isSent ? '-' : '+'}${routeTransaction.amount ? routeTransaction.amount.toFixed(2) : '0.00'}
          </Text>
          <Text style={[styles.status, { color: getStatusColor() }]}>
            {isPending ? 'Pending' : isSent ? 'Sent' : 'Received'}
          </Text>
        </View>
      </LinearGradient>
      
      <ScrollView style={styles.content}>
        {/* Transaction Info */}
        <Card style={styles.infoCard}>
          <View style={styles.infoItem}>
            <Text style={styles.infoValue} numberOfLines={2}>
              {transaction.description}
            </Text>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>From Account</Text>
            <Text style={styles.infoValue}>{transaction.sourceAccountId}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>To Account</Text>
            <Text style={styles.infoValue}>{transaction.destinationAccountId}</Text>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Type</Text>
            <Text style={styles.infoValue}>{isSent ? 'Sent' : 'Received'}</Text>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Date & Time</Text>
            <Text style={styles.infoValue}>
              {formatDate(transaction.date)}
            </Text>
          </View>
          

          
          {transaction.fee > 0 && (
            <>
              <View style={styles.divider} />
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Fee</Text>
                <Text style={styles.infoValue}>
                  ${(transaction.fee !== undefined && transaction.fee !== null) ? transaction.fee.toFixed(2) : '0.00'}
                </Text>
              </View>
            </>
          )}
          
          <View style={styles.divider} />
          
          <View style={styles.infoItem}>
            <Text style={styles.infoValue}>
              {transaction.account || ''}
            </Text>
          </View>
          
          {transaction.location && (
            <>
              <View style={styles.divider} />
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Location</Text>
                <View style={styles.locationContainer}>
                  <Icon name="location-on" size={16} color="#6c757d" style={styles.locationIcon} />
                  <Text style={[styles.infoValue, styles.locationText]}>
                    {transaction.location}
                  </Text>
                </View>
                {/* <TouchableOpacity style={styles.mapButton}>
                  <Text style={styles.mapButtonText}>View on Map</Text>
                </TouchableOpacity> */}
              </View>
            </>
          )}
        </Card>
        
        
        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={[styles.actionButton, styles.supportButton]}
            onPress={handleContactSupport}
          >
            <Icon name="help-outline" size={20} color="#4361ee" />
            <Text style={[styles.actionButtonText, { color: '#4361ee' }]}>
              Contact Support
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionButton, styles.disputeButton]}
            onPress={handleDispute}
            disabled={isPending}
          >
            <Icon name="report-problem" size={20} color="#e63946" />
            <Text style={[styles.actionButtonText, { color: '#e63946' }]}>
              {isPending ? 'Disable Pending' : 'Report an Issue'}
            </Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Need help with this transaction?
          </Text>
          <TouchableOpacity>
            <Text style={styles.footerLink}>Get help</Text>
          </TouchableOpacity>
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
  headerGradient: {
    paddingTop: 20,
    paddingBottom: 15,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#00456E',
  },
  accountIdHeader: {
    fontSize: 14,
    color: '#00456E',
    opacity: 0.8,
    marginBottom: 4,
  },
  shareButton: {
    padding: 8,
  },
  amountContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  amountIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  amount: {
    fontSize: 40,
    fontWeight: '700',
    color: '#00456E',
    marginBottom: 4,
  },
  status: {
    fontSize: 16,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  content: {
    flex: 1,
    marginTop: -16,
    zIndex: 1,
  },
  infoCard: {
    margin: 16,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 2,
  },
  infoItem: {
    padding: 16,
  },
  infoLabel: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    color: '#212529',
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#f1f3f5',
    marginLeft: 16,
  },
  contactInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e9ecef',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#495057',
    fontWeight: '600',
    fontSize: 16,
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
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  categoryIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  referenceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  referenceText: {
    fontSize: 16,
    color: '#212529',
    fontWeight: '500',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  copyButton: {
    padding: 8,
    marginRight: -8,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  locationIcon: {
    marginRight: 8,
  },
  locationText: {
    flex: 1,
  },
  mapButton: {
    marginTop: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderRadius: 8,
    alignItems: 'center',
  },
  mapButtonText: {
    color: '#4361ee',
    fontWeight: '500',
  },
  receiptCard: {
    margin: 16,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 2,
  },
  receiptHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f3f5',
  },
  receiptTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212529',
    marginLeft: 8,
  },
  pendingReceipt: {
    padding: 24,
    alignItems: 'center',
  },
  pendingReceiptText: {
    color: '#6c757d',
    textAlign: 'center',
    lineHeight: 20,
  },
  receiptContent: {
    padding: 16,
    alignItems: 'center',
  },
  receiptImage: {
    width: '100%',
    height: 200,
    marginBottom: 16,
  },
  downloadButton: {
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
  },
  downloadButtonText: {
    color: '#4361ee',
    fontWeight: '600',
  },
  actionButtons: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 24,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  supportButton: {
    backgroundColor: '#f1f3f5',
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  disputeButton: {
    backgroundColor: '#fff5f5',
    borderWidth: 1,
    borderColor: '#ffe3e3',
  },
  actionButtonText: {
    marginLeft: 8,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
  },
  footerText: {
    color: '#6c757d',
    marginRight: 4,
  },
  footerLink: {
    color: '#4361ee',
    fontWeight: '500',
  },
  accountSummary: {
    alignItems: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 20,
  },
  accountLabel: {
    fontSize: 14,
    color: '#00456E',
    opacity: 0.7,
    marginBottom: 4,
  },
  accountBalance: {
    fontSize: 24,
    fontWeight: '700',
    color: '#00456E',
  },
  transfersLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#00456E',
    marginTop: 4,
  },
  transactionsList: {
    paddingTop: 8,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212529',
  },
  transactionDate: {
    fontSize: 14,
    color: '#6c757d',
    marginTop: 2,
  },
  transactionNote: {
    fontSize: 14,
    color: '#6c757d',
    marginTop: 2,
  },
  loadingText: {
    color: '#6c757d',
    marginBottom: 16,
  },
  errorText: {
    color: '#e63946',
    textAlign: 'center',
    marginBottom: 16,
  },
  transactionAmount: {
    alignItems: 'flex-end',
  },
  amountText: {
    fontSize: 16,
    fontWeight: '600',
  },
  statusText: {
    fontSize: 12,
    color: '#6c757d',
    marginTop: 2,
    textTransform: 'capitalize',
  },
  emptyContainer: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    height: 200,
  },
  emptyText: {
    color: '#6c757d',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 16,
  },
  refreshButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: PRIMARY_BLUE,
    borderRadius: 4,
  },
  refreshButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default TransactionDetailScreen;
