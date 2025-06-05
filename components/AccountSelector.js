import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Text, Menu, Divider } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function AccountSelector({
  label,
  accounts,
  selectedAccountId,
  onSelect,
  testID
}) {
  const [visible, setVisible] = useState(false);
  const selected = accounts.find(acc => acc.id === selectedAccountId);

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
            <View style={{ flex: 1 }}>
              <Text style={styles.accountName} numberOfLines={1}>
                {selected ? selected.accountType : 'Select Account'}
              </Text>
              <Text style={styles.accountNumber} numberOfLines={1}>
                {selected ? selected.id : ''}
              </Text>
            </View>
            <Text style={styles.balance} numberOfLines={1}>
              {selected ? `$${selected.balance.toFixed(2)}` : ''}
            </Text>
            <Icon name="keyboard-arrow-down" size={28} color="#888" style={{ marginLeft: 8 }} />
          </TouchableOpacity>
        }
        contentStyle={{ backgroundColor: '#fff', minWidth: 320 }}
      >
        {accounts.map((acc, idx) => (
          <View key={acc.id}>
            <Menu.Item
              onPress={() => {
                setVisible(false);
                onSelect(acc.id);
              }}
              title={
                <View style={styles.menuRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.accountName, { fontSize: 15 }]}>{acc.accountType}</Text>
                    <Text style={[styles.accountNumber, { fontSize: 11 }]}>{acc.id}</Text>
                  </View>
                  <Text style={[styles.balance, { fontSize: 15 }]}>{`$${acc.balance.toFixed(2)}`}</Text>
                </View>
              }
            />
            {idx < accounts.length - 1 && <Divider />}
          </View>
        ))}
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
    borderColor: '#ddd',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 2,
  },
  accountName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
  },
  accountNumber: {
    fontSize: 13,
    color: '#888',
    marginTop: 2,
  },
  balance: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
    marginLeft: 12,
    minWidth: 90,
    textAlign: 'right',
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 2,
    minHeight: 36,
  },
});
