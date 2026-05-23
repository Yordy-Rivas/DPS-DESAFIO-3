import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert
} from "react-native";

import {
  collection,
  addDoc,
  query,
  where,
  onSnapshot,
  deleteDoc,
  doc
} from "firebase/firestore";

import { useState, useEffect } from "react";

import { auth, db } from "../services/firebaseConfig";

import { LinearGradient } from "expo-linear-gradient";