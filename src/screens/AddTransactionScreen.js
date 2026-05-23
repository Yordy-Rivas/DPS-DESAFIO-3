import { useState, useEffect } from "react";

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  StatusBar
} from "react-native";

import { auth, db }
from "../services/firebaseConfig";

import {
  collection,
  addDoc,
  serverTimestamp,
  updateDoc,
  doc,
  query,
  where,
  getDocs
} from "firebase/firestore";

import { LinearGradient }
from "expo-linear-gradient";

import { Ionicons }
from "@expo/vector-icons";

import { Picker }
from "@react-native-picker/picker";