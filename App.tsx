import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './src/screens/HomeScreen';
import AddGroceryScreen from './src/screens/AddGroceryScreen';
import OrderScreen from './src/screens/OrderScreen';
import SalesReportScreen from './src/screens/SalesReportScreen';
import BillingScreen from './src/screens/BillingScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="AddGrocery" component={AddGroceryScreen} />
        <Stack.Screen name="Order" component={OrderScreen} />
        <Stack.Screen name="SalesReport" component={SalesReportScreen} />
        <Stack.Screen name="Billing" component={BillingScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
