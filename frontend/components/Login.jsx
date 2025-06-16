import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../context/DarkContext.jsx";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../config.js";
import { router } from "expo-router";

export default function Login() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const { darkMode } = useTheme();

  const handleLogin = async () => {
    if (!email.includes("@")) {
      Alert.alert("Correo inválido", "Ingrese un correo electrónico válido.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/usuarios?email=${encodeURIComponent(email)}`);
      const data = await response.json();

      let usuario;

      if (data.length > 0) {
        usuario = data[0];
      } else {
        const res = await fetch(`${API_URL}/usuarios`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });
        usuario = await res.json();
      }

      await AsyncStorage.setItem("usuario", JSON.stringify(usuario));
      router.push('/Cuestionarios/');
    } catch (error) {
      Alert.alert("Error", "No se pudo conectar al servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, darkMode && styles.containerDark]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={[styles.form, darkMode && styles.formDark]}>
        <Text style={[styles.label, darkMode && styles.labelDark]}>
          Ingrese su correo electrónico
        </Text>
        <TextInput
          style={[styles.input, darkMode && styles.inputDark]}
          placeholder="Correo electrónico"
          placeholderTextColor={darkMode ? "#aaa" : "#888"}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />
        <TouchableOpacity
          style={[
            styles.button,
            (!email || loading) && { backgroundColor: "#999" },
          ]}
          onPress={handleLogin}
          disabled={!email || loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Entrar</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fafafa",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  containerDark: {
    backgroundColor: "#111",
  },
  form: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 12,
    elevation: 4,
  },
  formDark: {
    backgroundColor: "#333",
  },
  label: {
    fontSize: 16,
    marginBottom: 12,
    color: "#222",
  },
  labelDark: {
    color: "#fafafa",
  },
  input: {
    borderWidth: 1,
    borderColor: "#bbb",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
    color: "#222",
    backgroundColor: "#fafafa",
  },
  inputDark: {
    borderColor: "#555",
    color: "#fff",
    backgroundColor: "#222",
  },
  button: {
    backgroundColor: "#6f00ff",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});