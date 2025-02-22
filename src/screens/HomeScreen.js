import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Text } from 'react-native-paper';

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text variant="titleLarge" style={styles.headerText}>Diamond Fresh Mart</Text>
      
      <Button 
        mode="contained" 
        onPress={() => navigation.navigate('AddGrocery')} 
        style={styles.button}
      >
        Add Grocery Item
      </Button>

      <Button 
        mode="contained" 
        onPress={() => navigation.navigate('Order')} 
        style={styles.button}
      >
        Create Order
      </Button>

      <Button 
        mode="contained" 
        onPress={() => navigation.navigate('SalesReport')} 
        style={styles.button}
      >
        View Sales Report
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: '#f8f8f8' 
  },
  headerText: {
    fontWeight: 'bold',
    fontSize: 24,
    marginBottom: 30
  },
  button: { 
    marginTop: 20, 
    width: 250 
  },
});

export default HomeScreen;