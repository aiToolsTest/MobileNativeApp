import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { format } from 'date-fns';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { LIGHT_YELLOW, PRIMARY_BLUE } from '../src/constants/colors';

// Helper function - consider moving to a utils file
const getCategoryIcon = (category, isSent) => {
  const type = isSent ? 'sent' : 'received';
  switch (category) {
    case 'food': return 'restaurant';
    case 'bills': return 'receipt';
    case 'shopping': return 'shopping-bag';
    case 'entertainment': return 'movie';
    case 'subscription': return 'subscriptions';
    case 'income': return 'account-balance-wallet';
    case 'transfer':
    default:
      return type === 'sent' ? 'arrow-upward' : 'arrow-downward';
  }
};

const AccountDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { accountId, accountName, accountBalance } = route.params;

  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAccountTransactions = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`https://bank-poc-api-func.azurewebsites.net/api/transactions/${accountId}`);
      if (!response.ok) throw new Error(`Failed to fetch transactions. Status: ${response.status}`);
      const data = await response.json();
      const sortedData = [...data].sort((a, b) => new Date(b.date) - new Date(a.date));
      setTransactions(sortedData);
    } catch (err) {
      setError('Failed to load transactions for this account.');
      console.error('[AccountDetail] Error fetching transactions:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (accountId) {
      fetchAccountTransactions();
    }
  }, [accountId]);

  const renderItem = ({ item }) => {
    const isSent = item.sourceAccountId === accountId;
    return (
      <TouchableOpacity
        style={styles.transactionItem}
        onPress={() => navigation.navigate('TransactionReceipt', { // Changed to TransactionReceipt
          transaction: item,
          accountId,
        })}
      >
        <View style={[styles.transactionIcon, { backgroundColor: isSent ? '#ffebee' : '#e8f5e9' }]}>
          <Icon name={getCategoryIcon(item.category, isSent)} size={20} color={isSent ? '#e63946' : '#2ecc71'} />
        </View>
        <View style={styles.transactionDetails}>
          <Text style={styles.transactionTitle} numberOfLines={1}>
            {isSent ? `To: ${item.destinationAccountId}` : `From: ${item.sourceAccountId}`}
          </Text>
          <Text style={styles.transactionDate}>
            {item.date ? format(new Date(item.date), 'MMM d, yyyy - h:mm a') : 'Unknown date'}
          </Text>
        </View>
        <View style={styles.transactionAmount}>
          <Text style={[styles.amountText, { color: isSent ? '#e63946' : '#2ecc71' }]}>
            {isSent ? '-' : '+'}{item.amount} {item.currency}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        pointerEvents="box-none"
        colors={[LIGHT_YELLOW, LIGHT_YELLOW]}
        style={[styles.headerGradient, { paddingTop: 8 }]}
        start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
      >
        <View style={styles.header}>
          <Text style={styles.accountIdHeader}>{accountId}</Text>
          <Text style={styles.headerTitle}>{accountName || 'Account'}</Text>
        </View>
        <View style={styles.accountSummary}>
          <Text style={styles.accountLabel}>Available Balance</Text>
          <Text style={styles.accountBalance}>$ {accountBalance.toFixed(2)}</Text>
          <Text style={styles.transfersLabel}>Transactions</Text>
        </View>
      </LinearGradient>

      {isLoading ? (
        <ActivityIndicator size="large" color={PRIMARY_BLUE} style={{ marginTop: 20 }} />
      ) : error ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.refreshButton} onPress={fetchAccountTransactions}>
            <Text style={styles.refreshButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={transactions}
          renderItem={renderItem}
          keyExtractor={(item) => item.transactionId}
          contentContainerStyle={styles.transactionsList}
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No transactions found for this account.</Text>
            </View>
          )}
        />
      )}
    </View>
  );
};

// Styles copied from TransactionDetailScreen.js
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f6f8' },
  headerGradient: { paddingBottom: 20, borderBottomLeftRadius: 20, borderBottomRightRadius: 20 },
  header: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 10 },
  accountIdHeader: { fontSize: 16, fontWeight: '600', color: '#00456E', opacity: 0.8 },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#00456E' },
  accountSummary: { alignItems: 'flex-start', paddingVertical: 4, paddingHorizontal: 20, },
  accountLabel: { fontSize: 14, color: '#00456E', opacity: 0.7, marginBottom: 4, },
  accountBalance: { fontSize: 24, fontWeight: '700', color: '#00456E', },
  transfersLabel: { fontSize: 16, fontWeight: '600', color: '#00456E', marginTop: 4, },
  transactionsList: { paddingTop: 8, paddingBottom: 16 },
  transactionItem: { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: '#fff', marginHorizontal: 16, marginBottom: 8, borderRadius: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 1, },
  transactionIcon: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginRight: 12, },
  transactionDetails: { flex: 1, },
  transactionTitle: { fontSize: 16, fontWeight: '600', color: '#212529', },
  transactionDate: { fontSize: 14, color: '#6c757d', marginTop: 2, },
  transactionAmount: { alignItems: 'flex-end', },
  amountText: { fontSize: 16, fontWeight: '600', },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, paddingTop: 50 },
  emptyText: { fontSize: 16, color: '#666', textAlign: 'center' },
  errorText: { fontSize: 16, color: '#D32F2F', textAlign: 'center', marginBottom: 10 },
  refreshButton: { paddingVertical: 8, paddingHorizontal: 16, backgroundColor: PRIMARY_BLUE, borderRadius: 4, },
  refreshButtonText: { color: '#fff', fontWeight: '600', },
});

export default AccountDetailScreen;
