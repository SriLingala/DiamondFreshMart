import React from 'react';
import '@react-native-firebase/app';  // Add this line
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider as PaperProvider } from 'react-native-paper';
import HomeScreen from './screens/HomeScreen';
import AddGroceryScreen from './screens/AddGroceryScreen';
import OrderScreen from './screens/OrderScreen';
import SalesReportScreen from './screens/SalesReportScreen';

const Stack = createStackNavigator();

// Add this check to verify Firebase initialization
if (!firebase.apps.length) {
    firebase.initializeApp({
        // Your firebase config here
    });
}

export default function App() {
  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator 
          initialRouteName="Home"
          screenOptions={{
            headerStyle: { backgroundColor: '#6200EE' },
            headerTintColor: '#fff',
            headerTitleAlign: 'center',
          }}
        >
          <Stack.Screen name="Home" component={HomeScreen} options={{ title: "Diamond Fresh Mart" }} />
          <Stack.Screen name="AddGrocery" component={AddGroceryScreen} options={{ title: "Add Grocery Item" }} />
          <Stack.Screen name="Order" component={OrderScreen} options={{ title: "Create Order" }} />
          <Stack.Screen name="SalesReport" component={SalesReportScreen} options={{ title: "Sales Report" }} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}