import React, {useState, useEffect} from 'react';
import {Provider} from 'react-redux'
import store from './store/index.js'
import Game from './pages/Game'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from './pages/Home'
import Finish from './pages/Finish'

const Stack = createStackNavigator();

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="HomeScreen" component={Home} />
          <Stack.Screen name="GameScreen" component={Game} />
          <Stack.Screen name="FinishScreen" component={Finish} />
        </Stack.Navigator>
    </NavigationContainer>
    </Provider>   
  );
}