import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, PermissionsAndroid, Platform } from 'react-native';
import { TextInput, Button, Text, List } from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import RNFS from 'react-native-fs';
import Share from 'react-native-share';

const OrderScreen = () => {
  const [customerName, setCustomerName] = useState('');
  const [items, setItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    const fetchGroceries = async () => {
      try {
        const querySnapshot = await firestore().collection('groceries').orderBy('createdAt', 'desc').get();
        const fetchedItems = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setItems(fetchedItems);
      } catch (error) {
        console.error("Error fetching groceries:", error);
      }
    };

    fetchGroceries();
  }, []);

  const addToOrder = (item) => {
    const newItems = [...selectedItems, item];
    setSelectedItems(newItems);
    setTotalAmount(newItems.reduce((sum, item) => sum + item.price, 0));
  };

  const generateBill = async () => {
    if (!customerName || selectedItems.length === 0) {
      alert("Please enter customer name and select items.");
      return;
    }

    try {
      await firestore().collection('orders').add({
        customerName,
        items: selectedItems,
        total: totalAmount,
        createdAt: firestore.FieldValue.serverTimestamp(),
      });

      alert(`Bill Generated for £${totalAmount}`);
      createPDFBill(customerName, selectedItems, totalAmount);
    } catch (error) {
      console.error("Error saving order:", error);
    }
  };

  const createPDFBill = async (customer, orderedItems, total) => {
    const filePath = `${RNFS.DocumentDirectoryPath}/bill_${customer}.txt`;

    let billContent = `Diamond Fresh Mart\nCustomer: ${customer}\n\nItems:\n`;
    orderedItems.forEach((item, index) => {
      billContent += `${index + 1}. ${item.name} - £${item.price}/${item.unit}\n`;
    });

    billContent += `\nTotal Amount: £${total}\nThank you for shopping!`;

    try {
      await RNFS.writeFile(filePath, billContent, 'utf8');
      alert("Bill Saved Successfully!");
      shareBill(filePath);
    } catch (error) {
      console.error("Error creating bill:", error);
    }
  };

  const shareBill = async (filePath) => {
    try {
      await Share.open({
        title: "Share Bill",
        message: "Here is your bill from Diamond Fresh Mart",
        url: `file://${filePath}`,
      });
    } catch (error) {
      console.error("Error sharing bill:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text variant="titleLarge" style={styles.headerText}>Diamond Fresh Mart - Create Order</Text>
      <TextInput 
        label="Customer Name" 
        value={customerName} 
        onChangeText={setCustomerName} 
        style={styles.input} 
      />

      <Text variant="titleMedium">Select Items:</Text>
      <FlatList
        data={items}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <List.Item 
            title={`${item.name} - £${item.price}/${item.unit}`} 
            onPress={() => addToOrder(item)} 
          />
        )}
      />

      <Text variant="titleMedium" style={styles.totalText}>Total: £{totalAmount}</Text>

      <Button mode="contained" onPress={generateBill} style={styles.button}>
        Generate & Share Bill
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20, 
    backgroundColor: '#f8f8f8' 
  },
  headerText: {
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: 'bold'
  },
  input: { 
    marginBottom: 10, 
    backgroundColor: '#ffffff' 
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    textAlign: 'center'
  },
  button: { 
    marginTop: 20 
  },
});

export default OrderScreen;