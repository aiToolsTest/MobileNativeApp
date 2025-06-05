import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Linking, Share } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { format, parseISO } from 'date-fns';
import Icon from 'react-native-vector-icons/MaterialIcons';

const TransactionDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { transaction: routeTransaction } = route.params || {};
  
  // Default transaction data in case none is passed
  const defaultTransaction = {
    id: 't1',
    type: 'sent',
    amount: 125.50,
    fromAccount: 'Savings',
    toAccount: 'Checking',
    description: 'Dinner at Italian Restaurant',
    date: '2023-06-15T19:30:00',
    status: 'completed',
    category: 'food',
    reference: 'TXN202306151930',
    fee: 0.00,
    account: 'Main Account (••• 1234)',
    location: 'Pasta Palace, New York, NY',
  };
  
  const transaction = routeTransaction || defaultTransaction;
  
  const isSent = transaction.type === 'sent';
  const isPending = transaction.status === 'pending';
  
  const getStatusColor = () => {
    if (isPending) return '#f39c12';
    return isSent ? '#e63946' : '#2ecc71';
  };
  
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
  
  const getCategoryName = () => {
    switch (transaction.category) {
      case 'food':
        return 'Food & Dining';
      case 'bills':
        return 'Bills & Utilities';
      case 'shopping':
        return 'Shopping';
      case 'entertainment':
        return 'Entertainment';
      case 'subscription':
        return 'Subscriptions';
      case 'income':
        return 'Income';
      case 'transfer':
        return isSent ? 'Money Sent' : 'Money Received';
      default:
        return transaction.category || 'Transaction';
    }
  };
  
  const formatDate = (dateString) => {
    const date = parseISO(dateString);
    return format(date, 'EEEE, MMMM d, yyyy \at h:mm a');
  };
  
  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this ${isSent ? 'transfer' : 'transaction'} from ${transaction.fromAccount} to ${transaction.toAccount}: ${transaction.description} - $${transaction.amount.toFixed(2)}`,
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
        colors={['#4361ee', '#3a0ca3']}
        style={styles.headerGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Transaction Details</Text>
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
              name={getCategoryIcon()} 
              size={24} 
              color={getStatusColor()} 
            />
          </View>
          <Text style={styles.amount}>
            {isSent ? '-' : '+'}${transaction.amount.toFixed(2)}
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
            <Text style={styles.infoLabel}>Description</Text>
            <Text style={styles.infoValue} numberOfLines={2}>
              {transaction.description}
            </Text>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>From Account</Text>
            <Text style={styles.infoValue}>{transaction.fromAccount}</Text>
            <Text style={styles.infoLabel}>To Account</Text>
            <Text style={styles.infoValue}>{transaction.toAccount}</Text>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Category</Text>
            <View style={styles.categoryInfo}>
              <View style={[styles.categoryIcon, { backgroundColor: `${getStatusColor()}15` }]}>
                <Icon 
                  name={getCategoryIcon()} 
                  size={16} 
                  color={getStatusColor()} 
                />
              </View>
              <Text style={styles.infoValue}>
                {getCategoryName()}
              </Text>
            </View>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Date & Time</Text>
            <Text style={styles.infoValue}>
              {formatDate(transaction.date)}
            </Text>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Reference ID</Text>
            <View style={styles.referenceContainer}>
              <Text style={styles.referenceText}>
                {transaction.reference || 'N/A'}
              </Text>
              <TouchableOpacity style={styles.copyButton}>
                <Icon name="content-copy" size={16} color="#4361ee" />
              </TouchableOpacity>
            </View>
          </View>
          
          {transaction.fee > 0 && (
            <>
              <View style={styles.divider} />
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Fee</Text>
                <Text style={styles.infoValue}>
                  ${transaction.fee.toFixed(2)}
                </Text>
              </View>
            </>
          )}
          
          <View style={styles.divider} />
          
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Account</Text>
            <Text style={styles.infoValue}>
              {transaction.account || 'Main Account'}
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
                <TouchableOpacity style={styles.mapButton}>
                  <Text style={styles.mapButtonText}>View on Map</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </Card>
        
        {/* Receipt (if available) */}
        <Card style={[styles.receiptCard, { opacity: isPending ? 0.6 : 1 }]}>
          <View style={styles.receiptHeader}>
            <Icon name="receipt" size={20} color="#6c757d" />
            <Text style={styles.receiptTitle}>Receipt</Text>
          </View>
          
          {isPending ? (
            <View style={styles.pendingReceipt}>
              <Text style={styles.pendingReceiptText}>
                Receipt will be available once the transaction is complete
              </Text>
            </View>
          ) : (
            <View style={styles.receiptContent}>
              <Image
                source={require('../assets/receipt-placeholder.png')}
                style={styles.receiptImage}
                resizeMode="contain"
              />
              <TouchableOpacity style={styles.downloadButton}>
                <Text style={styles.downloadButtonText}>Download Receipt</Text>
              </TouchableOpacity>
            </View>
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
    paddingTop: 50,
    paddingBottom: 30,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
    color: '#fff',
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
    marginBottom: 16,
  },
  amount: {
    fontSize: 40,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
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
});

export default TransactionDetailScreen;
