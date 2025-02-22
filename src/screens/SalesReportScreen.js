import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { Text } from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import { LineChart } from 'react-native-chart-kit';

const SalesReportScreen = () => {
  const [salesData, setSalesData] = useState([]);
  const [labels, setLabels] = useState([]);

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const querySnapshot = await firestore()
          .collection('orders')
          .orderBy('createdAt', 'desc')
          .limit(10)
          .get();

        const fetchedSales = querySnapshot.docs.map(doc => ({
          total: doc.data().total,
          date: doc.data().createdAt?.toDate().toLocaleDateString() || "Unknown Date"
        }));

        setSalesData(fetchedSales.map(sale => sale.total));
        setLabels(fetchedSales.map(sale => sale.date));

      } catch (error) {
        console.error("Error fetching sales data:", error);
      }
    };

    fetchSalesData();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Text variant="titleLarge" style={styles.headerText}>Diamond Fresh Mart - Sales Report</Text>

      {salesData.length > 0 ? (
        <LineChart
          data={{
            labels: labels,
            datasets: [{ data: salesData }]
          }}
          width={Dimensions.get("window").width - 40}
          height={250}
          yAxisLabel="£"
          chartConfig={{
            backgroundColor: "#f5f5f5",
            backgroundGradientFrom: "#f5f5f5",
            backgroundGradientTo: "#f5f5f5",
            decimalPlaces: 2,
            color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          }}
          style={styles.chart}
        />
      ) : (
        <Text style={styles.noDataText}>No Sales Data Available</Text>
      )}
    </ScrollView>
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
  chart: { 
    marginVertical: 10 
  },
  noDataText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: 'gray'
  }
});

export default SalesReportScreen;