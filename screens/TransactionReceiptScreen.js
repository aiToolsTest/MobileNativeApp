import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Share,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import { format } from 'date-fns';
import Icon from 'react-native-vector-icons/MaterialIcons';

const TransactionReceiptScreen = () => {
  const route = useRoute();
  const { transaction, accountId } = route.params;

  const isSent = transaction.sourceAccountId === accountId;
  const status = isSent ? 'Sent' : 'Received';
  const amountColor = isSent ? '#e63946' : '#2ecc71';
  const amountPrefix = isSent ? '-' : '+';

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Transaction Details:\n- Amount: ${amountPrefix}${transaction.amount} ${transaction.currency}\n- From: ${transaction.sourceAccountId}\n- To: ${transaction.destinationAccountId}\n- Date: ${format(new Date(transaction.date), 'PPP p')}`,
      });
    } catch (error) {
      console.error('Error sharing transaction:', error.message);
    }
  };

  const InfoRow = ({ label, value }) => (
    <View style={styles.infoItem}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.receiptHeader}>
        <View style={[styles.receiptIcon, { backgroundColor: isSent ? '#ffebee' : '#e8f5e9' }]}>
          <Icon name={isSent ? 'arrow-upward' : 'arrow-downward'} size={32} color={amountColor} />
        </View>
        <Text style={[styles.receiptAmount, { color: amountColor }]}>
          {amountPrefix}{transaction.amount.toFixed(2)}
        </Text>
        <Text style={styles.receiptStatus}>{status}</Text>
      </View>

      <View style={styles.infoCard}>
        <InfoRow label="From Account" value={transaction.sourceAccountId} />
        <InfoRow label="To Account" value={transaction.destinationAccountId} />
        <InfoRow label="Date & Time" value={format(new Date(transaction.date), 'PPPP')} />
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity style={[styles.actionButton, styles.supportButton]} onPress={handleShare}>
          <Icon name="share" size={20} color="#495057" />
          <Text style={[styles.actionButtonText, { color: '#495057' }]}>Share</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionButton, styles.disputeButton]}>
          <Icon name="help-outline" size={20} color="#e63946" />
          <Text style={[styles.actionButtonText, { color: '#e63946' }]}>Dispute</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f6f8',
  },
  receiptHeader: {
    alignItems: 'center',
    paddingVertical: 32,
    backgroundColor: '#fff',
  },
  receiptIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  receiptAmount: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  receiptStatus: {
    fontSize: 16,
    color: '#6c757d',
    marginTop: 4,
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    margin: 16,
    paddingHorizontal: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f3f5',
  },
  infoLabel: {
    fontSize: 16,
    color: '#666',
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
    textAlign: 'right',
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
});

export default TransactionReceiptScreen;
