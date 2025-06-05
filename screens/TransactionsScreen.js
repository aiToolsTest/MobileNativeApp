
// Group transactions by date
const groupTransactionsByDate = (transactions) => {
  const groups = {};
  
  transactions.forEach(transaction => {
    const date = new Date(transaction.date);
    let groupKey;
    
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
    
    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }
    
    groups[groupKey].push(transaction);
  });
  
  return Object.entries(groups).map(([title, data]) => ({
    title,
    data: data.sort((a, b) => new Date(b.date) - new Date(a.date)),
  }));
};

const TransactionItem = ({ transaction, onPress }) => {
  const isSent = transaction.type === 'sent';
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
          name="arrow-back" 
          size={20} 
          color={getCategoryColor()} 
        />
      </View>
      
      <View style={styles.transactionDetails}>
        <Text style={styles.transactionTitle} numberOfLines={1}>
          {transaction.fromAccount && transaction.toAccount ? `${transaction.fromAccount} → ${transaction.toAccount}` : 'Transfer'}
        </Text>
        <Text style={styles.transactionCategory}>
          {transaction.description}
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
          {isSent ? '-' : '+'}${transaction.amount.toFixed(2)}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated, FlatList, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { PRIMARY_BLUE, LIGHT_YELLOW } from '../src/constants/colors';
import { useUser } from '../context/UserContext';

const TransactionsScreen = () => {
  const navigation = useNavigation();
  const { accounts } = useUser();
  const [activeFilter, setActiveFilter] = useState('all');
  // TODO: Replace with real data later
  const [groupedTransactions, setGroupedTransactions] = useState([]);
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
  
  const handleTransactionPress = (transaction) => {
    navigation.navigate('TransactionDetail', { transaction });
  };
  
  const renderTransactionGroup = ({ item: group }) => (
    <View style={styles.transactionGroup} key={group.title}>
      <Text style={styles.groupTitle}>{group.title}</Text>
      <Card style={styles.transactionGroupCard}>
        {group.data.map((transaction, index) => (
          <React.Fragment key={transaction.id}>
            <TransactionItem 
              transaction={transaction} 
              onPress={handleTransactionPress} 
            />
            {index < group.data.length - 1 && <View style={styles.divider} />}
          </React.Fragment>
        ))}
      </Card>
    </View>
  );

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
          colors={['#FFBC18', '#FFBC18']}
          style={styles.headerGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.headerContent}>
            <View style={styles.headerTop}>
              <TouchableOpacity 
                style={styles.backButton}
                onPress={() => navigation.goBack()}
              >
                <MaterialIcons name="arrow-back" size={24} color="#fff" />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Transaction History</Text>
              <TouchableOpacity style={styles.filterButton}>
                <MaterialIcons name="filter-list" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.balanceContainer}>
              <Text style={styles.balanceLabel}>Total Balance</Text>
              <Text style={styles.balanceAmount}>
                ${
                  accounts && accounts.length > 0
                    ? accounts.reduce((sum, acc) => sum + (acc.balance || 0), 0).toFixed(2)
                    : '0.00'
                }
              </Text>
              {/* Optionally, you can remove or update the balanceChange line below if not needed */}
              {/* <Text style={styles.balanceChange}>+2.3% this month</Text> */}
            </View>
            
            <View style={styles.filterContainer}>
              <TouchableOpacity 
                style={[
                  styles.filterButton,
                  activeFilter === 'all' && styles.activeFilterButton
                ]}
                onPress={() => setActiveFilter('all')}
              >
                <Text 
                  style={[
                    styles.filterButtonText,
                    activeFilter === 'all' && styles.activeFilterButtonText
                  ]}
                >
                  All
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[
                  styles.filterButton,
                  activeFilter === 'sent' && styles.activeFilterButton
                ]}
                onPress={() => setActiveFilter('sent')}
              >
                <Text 
                  style={[
                    styles.filterButtonText,
                    activeFilter === 'sent' && styles.activeFilterButtonText
                  ]}
                >
                  Sent
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[
                  styles.filterButton,
                  activeFilter === 'received' && styles.activeFilterButton
                ]}
                onPress={() => setActiveFilter('received')}
              >
                <Text 
                  style={[
                    styles.filterButtonText,
                    activeFilter === 'received' && styles.activeFilterButtonText
                  ]}
                >
                  Received
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>
      </Animated.View>
      
      {/* Transaction List */}
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
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: PRIMARY_BLUE,
  },
  filterButton: {
    padding: 8,
  },
  balanceContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  balanceLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 4,
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: '700',
    color: PRIMARY_BLUE,
    marginBottom: 4,
  },
  balanceChange: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginHorizontal: 20,
    backgroundColor: LIGHT_YELLOW,
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
    backgroundColor: PRIMARY_BLUE,
  },
  filterButtonText: {
    color: PRIMARY_BLUE,
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
});

export default TransactionsScreen;
