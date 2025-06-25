// Group transactions by date
const groupTransactionsByDate = (transactions) => {
  console.log('---------- DIAGNOSTIC LOGS ----------');
  console.log('[groupTransactionsByDate] START with transaction count:', transactions?.length);
  console.log('[groupTransactionsByDate] First transaction sample:', transactions?.[0] ? JSON.stringify(transactions[0]) : 'none');
  
  if (!transactions || transactions.length === 0) {
    console.log('[groupTransactionsByDate] No transactions to group - returning empty array');
    return [];
  }
  
  const groups = {};
  
  transactions.forEach(transaction => {
    // Check if date exists and format correctly
    if (!transaction.date) {
      console.log('Transaction missing date:', transaction);
      return;
    }
    
    const date = new Date(transaction.date);
    console.log('Processing date:', transaction.date, 'parsed as:', date);
    
    let groupKey;
    try {
      if (isToday(date)) {
        groupKey = 'Today';
      } else if (isYesterday(date)) {
        groupKey = 'Yesterday';
      } else if (isThisWeek(date, { weekStartsOn: 1 })) {
        groupKey = 'This Week';
      } else if (isThisMonth(date)) {
        groupKey = 'This Month';
      } else {
        groupKey = format(date, 'MMMM yyyy');
      }
    } catch (error) {
      console.error('Error processing date:', error);
      groupKey = 'Unknown';
    }
    
    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }
    
    groups[groupKey].push(transaction);
  });
  
  const result = Object.entries(groups).map(([title, data]) => ({
    title,
    data: data.sort((a, b) => {
      try {
        return new Date(b.date) - new Date(a.date);
      } catch (err) {
        console.error('Error sorting dates:', err);
        return 0;
      }
    }),
  }));
  
  console.log('Grouped transactions result:', JSON.stringify(result));
  // Sort the groups to ensure latest transactions appear first
  result.sort((a, b) => {
    // Custom sorting order: Today, Yesterday, This Week, This Month, then by date
    const order = {
      'Today': 0,
      'Yesterday': 1,
      'This Week': 2,
      'This Month': 3
    };
    
    // If both titles are in our predefined order
    if (order[a.title] !== undefined && order[b.title] !== undefined) {
      return order[a.title] - order[b.title];
    }
    // If only a is in predefined order, it comes first
    else if (order[a.title] !== undefined) {
      return -1;
    }
    // If only b is in predefined order, it comes first
    else if (order[b.title] !== undefined) {
      return 1;
    }
    // Otherwise sort by date (most recent month first)
    else {
      // Parse month names like "January 2023" and compare
      try {
        const dateA = new Date(a.title);
        const dateB = new Date(b.title);
        return dateB - dateA;
      } catch (err) {
        console.error('Error comparing group dates:', err);
        return 0;
      }
    }
  });
  
  return result;
};

const TransactionItem = ({ transaction, onPress, userAccountIds = [] }) => {
  console.log('Rendering transaction item with user accounts:', userAccountIds, JSON.stringify(transaction));
  // Determine if the transaction is sent from one of the user's accounts
  const isSent = userAccountIds.includes(transaction.sourceAccountId);
  const isPending = transaction.status === 'pending';
  
  const getCategoryIcon = () => {
    switch (transaction.category) {
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
        return isSent ? 'arrow-upward' : 'arrow-downward';
    }
  };
  
  const getCategoryColor = () => {
    if (isPending) return LIGHT_YELLOW;
    return isSent ? LIGHT_YELLOW : LIGHT_YELLOW;
  };
  
  const getCategoryBackground = () => {
    const color = getCategoryColor();
    return `${color}20`; // 20% opacity
  };

  return (
    <TouchableOpacity 
      style={styles.transactionItem}
      onPress={() => onPress(transaction)}
      activeOpacity={0.8}
    >
      <View style={[styles.transactionIcon, { backgroundColor: getCategoryBackground() }]}>
        <MaterialIcons 
          name={isSent ? "arrow-upward" : "arrow-downward"} 
          size={20} 
          color={getCategoryColor()} 
        />
      </View>
      
      <View style={styles.transactionDetails}>
        <Text style={styles.transactionTitle} numberOfLines={1}>
          {`${transaction.sourceAccountId} → ${transaction.destinationAccountId}`}
        </Text>
        <Text style={styles.transactionCategory}>
          {transaction.note || 'Transfer'}
          {isPending && ' • Pending'}
        </Text>
      </View>
      
      <View style={styles.transactionAmountContainer}>
        <Text 
          style={[
            styles.transactionAmount,
            { color: getCategoryColor() }
          ]}
        >
          {isSent ? '-' : '+'}${parseFloat(transaction.amount).toFixed(2)} {transaction.currency}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Animated, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { PRIMARY_BLUE, LIGHT_YELLOW } from '../src/constants/colors';
import { useUser } from '../context/UserContext';
import { format, isToday, isYesterday, isThisWeek, isThisMonth } from 'date-fns';

const TransactionsScreen = () => {
  const navigation = useNavigation();
  const { accounts } = useUser();
  const [activeFilter, setActiveFilter] = useState('all');
  const [transactions, setTransactions] = useState([]);
  const [groupedTransactions, setGroupedTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const scrollY = useRef(new Animated.Value(0)).current;
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });
  
  const headerTranslateY = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, -50],
    extrapolate: 'clamp',
  });

  // Fetch transactions from API
  useEffect(() => {
    fetchTransactions();
  }, []);

  // Update grouped transactions when transactions change or filter changes
  useEffect(() => {
    console.log('[groupingEffect] Transactions state or filter changed');
    console.log('[groupingEffect] -> Current transactions array length:', transactions.length);
    console.log('[groupingEffect] -> Current filter:', activeFilter);
    
    // Always process transactions, even if empty (to handle cleared data)
    let filteredTransactions = [...transactions];
    
    // Apply filters
    switch (activeFilter) {
      case 'sent':
        console.log('[groupingEffect] Filtering for sent transactions');
        filteredTransactions = transactions.filter(t => {
          console.log('[groupingEffect] Checking transaction:', JSON.stringify(t));
          const isSent = t.sourceAccountId === 'ACC001';
          console.log('[groupingEffect] -> isSent:', isSent, 'sourceAccountId:', t.sourceAccountId);
          return isSent;
        });
        console.log('[groupingEffect] Filtered sent count:', filteredTransactions.length);
        break;
      case 'received':
        console.log('[groupingEffect] Filtering for received transactions');
        filteredTransactions = transactions.filter(t => {
          const isReceived = t.destinationAccountId === 'ACC001';
          console.log('[groupingEffect] -> isReceived:', isReceived, 'destAccountId:', t.destinationAccountId);
          return isReceived;
        });
        console.log('[groupingEffect] Filtered received count:', filteredTransactions.length);
        break;
      default:
        console.log('[groupingEffect] No filtering applied (all transactions)');
    }
    
    console.log('[groupingEffect] Calling groupTransactionsByDate with filtered transactions');
    const grouped = groupTransactionsByDate(filteredTransactions);
    console.log('[groupingEffect] Grouped result object count:', grouped?.length || 0);
    console.log('[groupingEffect] Setting groupedTransactions state');
    setGroupedTransactions(grouped);
  }, [transactions, activeFilter]);

  const fetchTransactions = async () => {
    console.log('Fetching transactions from API');
    setIsLoading(true);
    setError(null);
    try {
      console.log('[fetchTransactions] Starting API fetch to endpoint: https://bank-poc-api-func.azurewebsites.net/api/transactions/ACC001');
      const response = await fetch('https://bank-poc-api-func.azurewebsites.net/api/transactions/ACC001');
      
      console.log('[fetchTransactions] API Response status:', response.status);
      if (!response.ok) {
        console.log('[fetchTransactions] Response NOT OK');      
        throw new Error(`API request failed with status ${response.status}`);
      }
      
      const text = await response.text();
      console.log('[fetchTransactions] Response text length:', text.length);
      console.log('[fetchTransactions] Response first 100 chars:', text.substring(0, 100));
      
      try {
        const data = JSON.parse(text);
        console.log('[fetchTransactions] JSON parsed successfully. Type:', Array.isArray(data) ? 'Array' : typeof data);
        console.log('[fetchTransactions] Data length:', Array.isArray(data) ? data.length : 'N/A');
        
        if (!data || !Array.isArray(data)) {
          console.log('[fetchTransactions] Invalid data format (not an array)');
          throw new Error('API returned invalid data format');
        }
        
        if (data.length === 0) {
          console.log('[fetchTransactions] API returned empty array');
        } else {
          console.log(`[fetchTransactions] API returned ${data.length} transactions`);
          console.log('[fetchTransactions] First transaction:', JSON.stringify(data[0]));
        }
        
        console.log('[fetchTransactions] Setting transactions state');
        setTransactions(data);
      } catch (jsonErr) {
        console.error('[fetchTransactions] JSON parsing error:', jsonErr);
        setError('Failed to parse transaction data. Invalid format.');
        setTransactions([]);
      }
    } catch (err) {
      console.error('[fetchTransactions] Network or fetching error:', err.message);
      setError('Failed to load transactions. Please try again later.');
      setTransactions([]);
    } finally {
      console.log('[fetchTransactions] Request completed, setting isLoading to false');
      setIsLoading(false);
    }  
  };
  
  const handleTransactionPress = (transaction) => {
    console.log('Transaction pressed:', transaction.transactionId);
    if (!accounts || accounts.length === 0) {
      console.error("Cannot handle transaction press: accounts not loaded.");
      return;
    }

    const userAccountIds = accounts.map(acc => acc.accountId);
    const isFromUser = userAccountIds.includes(transaction.sourceAccountId);
    let accountForContext = null;

    // The account providing context is the one involved in the transaction
    if (isFromUser) {
      accountForContext = accounts.find(acc => acc.accountId === transaction.sourceAccountId);
    } else {
      // If it wasn't sent from a user account, it must have been received by one
      accountForContext = accounts.find(acc => acc.accountId === transaction.destinationAccountId);
    }

    if (accountForContext) {
      console.log('Navigating with account context:', accountForContext.accountId);
      navigation.navigate('AccountDetail', {
        transaction,
        accountId: accountForContext.accountId,
        accountName: accountForContext.accountName,
        accountBalance: accountForContext.balance,
        accountCurrency: accountForContext.currency,
      });
    } else {
      // This case should be rare if the transaction belongs to the user
      console.warn('Could not determine a user account for this transaction. Navigating without full context.', transaction.transactionId);
      navigation.navigate('AccountDetail', {
        transaction,
        // Pass the primary account ID as a fallback
        accountId: accounts.length > 0 ? accounts[0].accountId : null,
      });
    }
  };
  
  const renderTransactionGroup = ({ item: group }) => {
    console.log('[renderTransactionGroup] Rendering group:', group.title);
    console.log('[renderTransactionGroup] Group data count:', group.data?.length || 0);
    return (
      <View style={styles.transactionGroup} key={group.title}>
        <Text style={styles.groupTitle}>{group.title}</Text>
        <View style={styles.transactionGroupCard}>
          {group.data.map((transaction, index) => {
            console.log('[renderTransactionGroup] Rendering transaction item:', transaction.id);
            return (
              <React.Fragment key={transaction.id}>
                <TransactionItem
                  transaction={transaction}
                  onPress={() => handleTransactionPress(transaction)}
                  userAccountIds={accounts.map(acc => acc.accountId)}
                />
                {index < group.data.length - 1 && <View style={styles.divider} />}
              </React.Fragment>
            );
          })}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Fixed Header */}
      <Animated.View 
        style={[
          styles.header,
          { 
            opacity: headerOpacity,
            transform: [{ translateY: headerTranslateY }] 
          }
        ]}
      >
        <LinearGradient
          colors={[LIGHT_YELLOW, LIGHT_YELLOW]}
          style={styles.headerGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.headerContent}>
            <View style={styles.headerTop}>
              <View style={{width: 24}} />
              <Text style={styles.headerTitle}>Transaction History</Text>
              <TouchableOpacity style={styles.filterButton}>
                <MaterialIcons name="filter-list" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.balanceContainer}>
              <Text style={styles.balanceLabel}>Total Balance</Text>
              <Text style={styles.balanceAmount}>${
                  accounts && accounts.length > 0
                    ? accounts.reduce((sum, acc) => sum + (acc.balance || 0), 0).toFixed(2)
                    : '0.00'
                }</Text>
              {/* Optionally, you can remove or update the balanceChange line below if not needed */}
              {/* <Text style={styles.balanceChange}>+2.3% this month</Text> */}
            </View>
            
            <View style={styles.filterContainer}>
              <TouchableOpacity
                style={[
                  styles.filterButton,
                  activeFilter === 'all' && styles.activeFilterButton,
                ]}
                onPress={() => setActiveFilter('all')}
              >
                <Text
                  style={[
                    styles.filterButtonText,
                    activeFilter === 'all' && styles.activeFilterButtonText,
                  ]}
                >
                  All
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.filterButton,
                  activeFilter === 'sent' && styles.activeFilterButton,
                ]}
                onPress={() => setActiveFilter('sent')}
              >
                <Text
                  style={[
                    styles.filterButtonText,
                    activeFilter === 'sent' && styles.activeFilterButtonText,
                  ]}
                >
                  Sent
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.filterButton,
                  activeFilter === 'received' && styles.activeFilterButton,
                ]}
                onPress={() => setActiveFilter('received')}
              >
                <Text
                  style={[
                    styles.filterButtonText,
                    activeFilter === 'received' && styles.activeFilterButtonText,
                  ]}
                >
                  Received
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>
      </Animated.View>
      
      {/* Use a function to determine what to render based on state */}
      {(() => {
        console.log('[render] Rendering UI with current state:');
        console.log('[render] -> isLoading:', isLoading);
        console.log('[render] -> error:', error);
        console.log('[render] -> groupedTransactions.length:', groupedTransactions?.length || 0);
        console.log('[render] -> transactions.length:', transactions?.length || 0);
        
        if (isLoading) {
          console.log('[render] Showing loading state');
          return (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={PRIMARY_BLUE} />
              <Text style={styles.loadingText}>Loading transactions...</Text>
            </View>
          );
        } 
        
        if (error) {
          console.log('[render] Showing error state:', error);
          return (
            <View style={styles.errorContainer}>
              <MaterialIcons name="error-outline" size={48} color={PRIMARY_BLUE} />
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity 
                style={styles.retryButton}
                onPress={fetchTransactions}
              >
                <Text style={styles.retryButtonText}>Retry</Text>
              </TouchableOpacity>
            </View>
          );
        } 
        
        if (groupedTransactions.length === 0) {
          console.log('[render] Showing empty state - no grouped transactions');
          return (
            <View style={styles.emptyContainer}>
              <MaterialIcons name="account-balance-wallet" size={48} color={PRIMARY_BLUE} />
              <Text style={styles.emptyText}>No transactions found</Text>
              <TouchableOpacity 
                style={styles.retryButton}
                onPress={fetchTransactions}
              >
                <Text style={styles.retryButtonText}>Refresh</Text>
              </TouchableOpacity>
            </View>
          );
        }
        
        // If we reach here, we have data to display
        console.log('[render] Rendering FlatList with grouped transactions');
        return (
          <Animated.FlatList
            data={groupedTransactions}
            renderItem={renderTransactionGroup}
            keyExtractor={(item) => item.title}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { y: scrollY } } }],
              { useNativeDriver: true }
            )}
            scrollEventThrottle={16}
            ListHeaderComponent={<View style={styles.listHeader} />}
            ListFooterComponent={<View style={styles.listFooter} />}
          />
        );
      })()} {/* Immediately invoke the function */}
      
      {/* Fixed Filter Bar (shown when scrolling) */}
      <Animated.View 
        style={[
          styles.fixedFilterBar,
          { 
            opacity: scrollY.interpolate({
              inputRange: [100, 150],
              outputRange: [0, 1],
              extrapolate: 'clamp',
            }),
            transform: [
              { 
                translateY: scrollY.interpolate({
                  inputRange: [100, 150],
                  outputRange: [20, 0],
                  extrapolate: 'clamp',
                })
              }
            ]
          }
        ]}
      >
        <Text style={styles.fixedFilterTitle}>Transaction History</Text>
        <View style={styles.fixedFilterButtons}>
          <TouchableOpacity 
            style={[
              styles.smallFilterButton,
              activeFilter === 'all' && styles.activeSmallFilterButton
            ]}
            onPress={() => setActiveFilter('all')}
          >
            <Text 
              style={[
                styles.smallFilterButtonText,
                activeFilter === 'all' && styles.activeSmallFilterButtonText
              ]}
            >
              All
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[
              styles.smallFilterButton,
              activeFilter === 'sent' && styles.activeSmallFilterButton
            ]}
            onPress={() => setActiveFilter('sent')}
          >
            <Text 
              style={[
                styles.smallFilterButtonText,
                activeFilter === 'sent' && styles.activeSmallFilterButtonText
              ]}
            >
              Sent
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[
              styles.smallFilterButton,
              activeFilter === 'received' && styles.activeSmallFilterButton
            ]}
            onPress={() => setActiveFilter('received')}
          >
            <Text 
              style={[
                styles.smallFilterButtonText,
                activeFilter === 'received' && styles.activeSmallFilterButtonText
              ]}
            >
              Received
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF9E3',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    elevation: 10,
  },
  headerGradient: {
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    paddingBottom: 24,
  },
  headerContent: {
    paddingTop: 50,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#00456E',
    textAlign: 'center',
  },
  filterButton: {
    padding: 8,
  },
  balanceContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  balanceLabel: {
    fontSize: 14,
    color: '#00456E',
    opacity: 0.8,
    marginBottom: 4,
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: '700',
    color: '#00456E',
    marginBottom: 4,
  },
  balanceChange: {
    fontSize: 14,
    color: '#00456E',
    opacity: 0.8,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 4,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  activeFilterButton: {
    backgroundColor: '#00456E',
  },
  filterButtonText: {
    color: '#00456E',
    fontWeight: '500',
  },
  activeFilterButtonText: {
    color: LIGHT_YELLOW,
    fontWeight: '600',
  },
  listContent: {
    paddingTop: 280,
    paddingBottom: 30,
  },
  listHeader: {
    height: 16,
  },
  listFooter: {
    height: 30,
  },
  transactionGroup: {
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  groupTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6c757d',
    marginBottom: 12,
    marginLeft: 4,
  },
  transactionGroupCard: {
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 2,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  transactionIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  transactionDetails: {
    flex: 1,
    marginRight: 12,
  },
  transactionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: PRIMARY_BLUE,
    marginBottom: 2,
  },
  transactionCategory: {
    fontSize: 13,
    color: '#6c757d',
  },
  transactionAmountContainer: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: PRIMARY_BLUE,
  },
  divider: {
    height: 1,
    backgroundColor: '#f1f3f5',
    marginLeft: 72,
  },
  fixedFilterBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    paddingTop: 50,
    paddingBottom: 12,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f3f5',
    zIndex: 5,
    elevation: 5,
  },
  fixedFilterTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#212529',
  },
  fixedFilterButtons: {
    flexDirection: 'row',
    backgroundColor: '#f1f3f5',
    borderRadius: 8,
    padding: 2,
  },
  smallFilterButton: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  activeSmallFilterButton: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  smallFilterButtonText: {
    fontSize: 13,
    color: '#6c757d',
    fontWeight: '500',
  },
  activeSmallFilterButtonText: {
    color: '#FFBC18',
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: PRIMARY_BLUE,
    fontWeight: '500',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
    paddingHorizontal: 20,
  },
  errorText: {
    marginTop: 16,
    fontSize: 16,
    color: PRIMARY_BLUE,
    fontWeight: '500',
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 24,
    paddingVertical: 10,
    paddingHorizontal: 24,
    backgroundColor: PRIMARY_BLUE,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: PRIMARY_BLUE,
    fontWeight: '500',
  },
});

export default TransactionsScreen;
