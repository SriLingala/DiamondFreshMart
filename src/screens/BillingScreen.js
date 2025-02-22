import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Button, List } from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import RNFS from 'react-native-fs';
import Share from 'react-native-share';
import RNPrint from 'react-native-print';

const BillingScreen = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const querySnapshot = await firestore()
          .collection('orders')
          .orderBy('createdAt', 'desc')
          .limit(10)
          .get();

        const fetchedOrders = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        setOrders(fetchedOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);

  const generateInvoice = async (order) => {
    if (!order) {
      alert("Please select an order first.");
      return;
    }

    const filePath = `${RNFS.DocumentDirectoryPath}/invoice_${order.customerName}.txt`;

    let invoiceContent = `Diamond Fresh Mart\nInvoice\n\nCustomer: ${order.customerName}\n\nItems:\n`;
    order.items.forEach((item, index) => {
      invoiceContent += `${index + 1}. ${item.name} - £${item.price}/${item.unit}\n`;
    });

    invoiceContent += `\nTotal Amount: £${order.total}\nThank you for shopping with us!`;

    try {
      await RNFS.writeFile(filePath, invoiceContent, 'utf8');
      alert("Invoice generated successfully!");
      shareInvoice(filePath);
    } catch (error) {
      console.error("Error generating invoice:", error);
    }
  };

  const shareInvoice = async (filePath) => {
    try {
      await Share.open({
        title: "Share Invoice",
        message: "Here is your invoice from Diamond Fresh Mart",
        url: `file://${filePath}`,
      });
    } catch (error) {
      console.error("Error sharing invoice:", error);
    }
  };

  const printInvoice = async () => {
    if (!selectedOrder) {
      alert("Please select an order first.");
      return;
    }

    const htmlContent = `
      <html>
        <body>
          <h1>Diamond Fresh Mart Invoice</h1>
          <p><strong>Customer:</strong> ${selectedOrder.customerName}</p>
          <p><strong>Total:</strong> £${selectedOrder.total}</p>
          <h2>Items:</h2>
          <ul>
            ${selectedOrder.items.map(item => `<li>${item.name} - £${item.price}/${item.unit}</li>`).join('')}
          </ul>
          <p>Thank you for shopping with us!</p>
        </body>
      </html>
    `;

    try {
      await RNPrint.print({ html: htmlContent });
    } catch (error) {
      console.error("Print Error:", error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text variant="titleLarge" style={styles.headerText}>Diamond Fresh Mart - Billing</Text>

      <Text>Select an Order to Generate Invoice:</Text>
      {orders.map(order => (
        <List.Item
          key={order.id}
          title={`Customer: ${order.customerName} - £${order.total}`}
          onPress={() => setSelectedOrder(order)}
          style={selectedOrder?.id === order.id ? styles.selectedItem : null}
        />
      ))}

      {selectedOrder && (
        <>
          <Text variant="titleMedium" style={styles.orderDetails}>Order Details:</Text>
          {selectedOrder.items.map((item, index) => (
            <Text key={index}>{`${index + 1}. ${item.name} - £${item.price}/${item.unit}`}</Text>
          ))}
          <Text variant="titleLarge" style={styles.totalText}>Total: £{selectedOrder.total}</Text>

          <Button mode="contained" onPress={() => generateInvoice(selectedOrder)} style={styles.button}>
            Generate & Share Invoice
          </Button>

          <Button mode="contained" onPress={printInvoice} style={styles.button}>
            Print Invoice
          </Button>
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f8f8f8' },
  headerText: { textAlign: 'center', marginBottom: 20, fontWeight: 'bold' },
  orderDetails: { marginTop: 20, fontWeight: 'bold' },
  totalText: { fontSize: 18, fontWeight: 'bold', marginTop: 20, textAlign: 'center' },
  selectedItem: { backgroundColor: '#d3d3d3' },
  button: { marginTop: 20 },
});

export default BillingScreen;