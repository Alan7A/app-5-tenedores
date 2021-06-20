import React from 'react';
import { LogBox } from "react-native";
import { firebaseApp } from "./app/utils/firebase";
import BottomNavigation from './app/navigations/BottomNavigation';

LogBox.ignoreLogs(['Setting a timer'])

export default function App() {
  return (
      <BottomNavigation />
  );
}
