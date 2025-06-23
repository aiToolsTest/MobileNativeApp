import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Share,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { Card } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { format, parseISO } from 'date-fns';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { LIGHT_YELLOW, PRIMARY_BLUE } from '../src/constants/colors';

// --- Helper Functions ---

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

// --- Sub-Components ---

/**
 * Displays the list of transactions for a specific account.
 */
const AccountTransactionsView = ({ accountId, accountName, accountBalance }) => {
  const navigation = useNavigation();
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
        onPress={() => navigation.navigate('TransactionDetail', {
          transaction: item,
          accountId,
          accountName,
          accountBalance,
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
          <Text style={styles.accountBalance}>$ {accountBalance ? accountBalance.toFixed(2) : '0.00'}</Text>
          <Text style={styles.transfersLabel}>Transactions</Text>
        </View>
      </LinearGradient>

      <View style={{ flex: 1 }}>
        {isLoading ? (
          <ActivityIndicator style={{ marginTop: 20 }} size="large" color={PRIMARY_BLUE} />
        ) : error ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.refreshButton} onPress={fetchAccountTransactions}>
              <Text style={styles.refreshButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={transactions}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingBottom: 24, paddingHorizontal: 16, paddingTop: 16 }}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No transactions found for this account.</Text>
              </View>
            }
          />
        )}
      </View>
    </View>
  );
};

/**
 * Displays the details of a single transaction.
 */
const SingleTransactionDetailView = ({ transaction, perspectiveAccountId }) => {
  const navigation = useNavigation();
  const isSent = transaction.sourceAccountId === perspectiveAccountId;
  const isPending = transaction.status === 'pending';

  const getStatusColor = () => {
    if (isPending) return '#FFC107'; // Amber
    return isSent ? '#D32F2F' : '#4CAF50'; // Red for sent, Green for received
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Transaction: ${transaction.description || ''} - $${transaction.amount.toFixed(2)}`,
        title: 'Transaction Details',
      });
    } catch (error) {
      console.error('Error sharing:', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[LIGHT_YELLOW, LIGHT_YELLOW]}
        style={styles.headerGradient}
        start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 8 }}>
            <Icon name="arrow-back" size={24} color={PRIMARY_BLUE} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Details</Text>
          <TouchableOpacity onPress={handleShare} style={{ padding: 8 }}>
            <Icon name="share" size={24} color={PRIMARY_BLUE} />
          </TouchableOpacity>
        </View>
        <View style={styles.amountContainer}>
          <View style={[styles.amountIcon, { backgroundColor: `${getStatusColor()}20` }]}>
            <Icon name={getCategoryIcon(transaction.category, isSent)} size={28} color={getStatusColor()} />
          </View>
          <Text style={[styles.amount, { color: getStatusColor() }]}>
            {isSent ? '-' : '+'}{transaction.amount ? transaction.amount.toFixed(2) : '0.00'}
          </Text>
          <Text style={[styles.status, { color: getStatusColor() }]}>
            {isPending ? 'Pending' : isSent ? 'Sent' : 'Received'}
          </Text>
        </View>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.content}>
        <Card style={styles.infoCard}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Description</Text>
            <Text style={styles.infoValue}>{transaction.description}</Text>
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
            <Text style={styles.infoLabel}>Date & Time</Text>
            <Text style={styles.infoValue}>{format(parseISO(transaction.date), 'EEEE, MMMM d, yyyy')}</Text>
          </View>
        </Card>
      </ScrollView>
    </View>
  );
};

// --- Main Screen Component (Router) ---

const TransactionDetailScreen = () => {
  const route = useRoute();
  const { transaction, accountId, accountName, accountBalance } = route.params || {};

  // If a specific transaction is passed, show its detailed view.
  if (transaction) {
    // Use the passed accountId for perspective, otherwise default to the primary account.
    const perspectiveAccountId = accountId || 'ACC001';
    return <SingleTransactionDetailView transaction={transaction} perspectiveAccountId={perspectiveAccountId} />;
  }

  // If an accountId is passed (but no transaction), show the account's transaction list.
  if (accountId) {
    return <AccountTransactionsView accountId={accountId} accountName={accountName} accountBalance={accountBalance} />;
  }

  // Fallback case if no valid params are provided.
  return (
    <View style={styles.container}>
      <Text style={styles.errorText}>Details not available. Please go back.</Text>
    </View>
  );
};

// --- Styles ---

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f6f8' },
  headerGradient: { paddingTop: 50, paddingBottom: 20, paddingHorizontal: 20, borderBottomLeftRadius: 20, borderBottomRightRadius: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: PRIMARY_BLUE },
  accountIdHeader: { fontSize: 14, color: PRIMARY_BLUE, opacity: 0.8 },
  accountSummary: { alignItems: 'center', marginTop: 10 },
  accountLabel: { fontSize: 16, color: PRIMARY_BLUE, opacity: 0.9 },
  accountBalance: { fontSize: 36, fontWeight: 'bold', color: PRIMARY_BLUE, marginVertical: 4 },
  transfersLabel: { fontSize: 18, fontWeight: '600', color: PRIMARY_BLUE, marginTop: 8 },
  transactionItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 12, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2 },
  transactionIcon: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  transactionDetails: { flex: 1 },
  transactionTitle: { fontSize: 16, fontWeight: '600', color: '#333' },
  transactionDate: { fontSize: 12, color: '#999', marginTop: 4 },
  transactionAmount: { alignItems: 'flex-end' },
  amountText: { fontSize: 16, fontWeight: 'bold' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  emptyText: { fontSize: 16, color: '#666', textAlign: 'center' },
  errorText: { fontSize: 16, color: '#D32F2F', textAlign: 'center' },
  refreshButton: { marginTop: 20, backgroundColor: PRIMARY_BLUE, paddingVertical: 10, paddingHorizontal: 20, borderRadius: 20 },
  refreshButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  // Styles for SingleTransactionDetailView
  amountContainer: { alignItems: 'center', paddingVertical: 20 },
  amountIcon: { width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  amount: { fontSize: 36, fontWeight: 'bold', marginBottom: 4 },
  status: { fontSize: 18, fontWeight: '600', textTransform: 'capitalize' },
  content: { padding: 16 },
  infoCard: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 16, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2 },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f3f5',
  },
  infoLabel: { fontSize: 16, color: '#666' },
  infoValue: { fontSize: 16, fontWeight: '600', color: '#333', flex: 1, textAlign: 'right' },
  divider: { height: 1, backgroundColor: '#eee' },
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
