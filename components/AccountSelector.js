import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Text, Menu, Divider } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function AccountSelector({
  label,
  accounts,
  selectedAccountId,
  onSelect,
  testID,
  filteredAccountIds = [] // New prop to filter out accounts from the dropdown
}) {
  const [visible, setVisible] = useState(false);
  const selected = accounts.find(acc => acc.id === selectedAccountId);
  
  // Filter out accounts that should not be shown
  const availableAccounts = accounts.filter(acc => !filteredAccountIds.includes(acc.id));

  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={styles.label}>{label}</Text>
      <Menu
        visible={visible}
        onDismiss={() => setVisible(false)}
        anchor={
          <TouchableOpacity
            style={styles.selector}
            onPress={() => setVisible(true)}
            activeOpacity={0.7}
            testID={testID}
          >
            <View style={styles.accountDisplay}>
              <Text style={styles.accountName} numberOfLines={1}>
                {selected ? (selected.accountType || selected.name || selected.type || selected.id) : 'Select Account'}
              </Text>
            </View>
            {selected && (
              <View style={styles.balanceContainer}>
                <Text style={styles.balance} numberOfLines={1}>
                  ${selected.balance.toFixed(2)}
                </Text>
                <Icon name="keyboard-arrow-down" size={24} color="#888" style={{ marginLeft: 8 }} />
              </View>
            )}
            {!selected && (
              <Icon name="keyboard-arrow-down" size={24} color="#888" style={{ marginLeft: 8 }} />
            )}
          </TouchableOpacity>
        }
        contentStyle={{ backgroundColor: '#fff', minWidth: 320, borderRadius: 12 }}
        contentContainerStyle={{ borderRadius: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 3 }}
      >
        {availableAccounts.map((acc, idx) => (
          <View key={acc.id}>
            <Menu.Item
              onPress={() => {
                setVisible(false);
                onSelect(acc.id);
              }}
              title={acc.accountType || acc.name || acc.type || acc.id}
              titleStyle={{color: '#003E6D', fontSize: 16, fontWeight: '600'}}
              right={props => <Text style={styles.menuItemBalance}>${acc.balance.toFixed(2)}</Text>}
              
            />
            {idx < availableAccounts.length - 1 && <Divider />}
          </View>
        ))}
        {availableAccounts.length === 0 && (
          <Menu.Item
            title="No accounts available"
            disabled={true}
          />
        )}
      </Menu>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
    marginLeft: 2,
    fontWeight: '600',
  },
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#b0c4de',  // More visible blue-gray border
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  accountName: {
    fontSize: 18,  // Reduced font size as requested
    fontWeight: '600',
    color: '#003E6D',  // Using our navy blue for account names
  },
  accountNumber: {
    fontSize: 13,
    color: '#5A6B79',
    marginTop: 2,
  },
  balance: {
    fontSize: 14,  // Further reduced font size
    fontWeight: '400',  // Further reduced font weight
    color: '#777',  // Even lighter color
    marginLeft: 12,
    minWidth: 70,
    textAlign: 'right',
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingRight: 8,
  },
  menuItemBalance: {
    fontSize: 14,
    color: '#777',
    marginRight: 8,
    fontWeight: '400',
  },
  accountDisplay: {
    flex: 1,
    justifyContent: 'center',
  },
  balanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
});
