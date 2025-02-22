import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Text, RadioButton } from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';

const AddGroceryScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [unit, setUnit] = useState('kg');

  const handleSave = async () => {
    if (!name || !price) {
      alert("Please enter all details.");
      return;
    }

    try {
      await firestore().collection('groceries').add({
        name,
        price: parseFloat(price),
        unit,
        createdAt: firestore.FieldValue.serverTimestamp(),
      });

      alert("Grocery Item Saved!");
      navigation.goBack();
    } catch (error) {
      console.error("Error saving grocery:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text variant="titleLarge" style={styles.headerText}>Diamond Fresh Mart - Add Grocery</Text>
      <TextInput 
        label="Item Name" 
        value={name} 
        onChangeText={setName} 
        style={styles.input} 
      />
      <TextInput 
        label="Price (£)" 
        value={price} 
        keyboardType="numeric" 
        onChangeText={setPrice} 
        style={styles.input} 
      />

      <Text>Select Unit Type:</Text>
      <RadioButton.Group onValueChange={setUnit} value={unit}>
        <RadioButton.Item label="Kg" value="kg" />
        <RadioButton.Item label="Dozen" value="dozen" />
        <RadioButton.Item label="Grams" value="grams" />
      </RadioButton.Group>

      <Button mode="contained" onPress={handleSave} style={styles.button}>
        Save Item
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
  button: { 
    marginTop: 20 
  },
});

export default AddGroceryScreen;