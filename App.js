import React from 'react';
import { LogBox } from "react-native";
import BottomNavigation from './app/navigations/BottomNavigation';
import { firebaseApp } from "./app/utils/firebase";

LogBox.ignoreLogs(['Setting a timer'])

export default function App() {
  return (
      <BottomNavigation />
  );
}
