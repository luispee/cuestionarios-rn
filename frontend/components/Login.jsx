import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from "react-native";
import { useTheme } from '../context/DarkContext.jsx';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from 'expo-router';

function Login() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { darkMode } = useTheme();

    async function upSubmit() {
        setLoading(true);
        try {
            const response = await fetch(`http://10.13.22.3:3000/usuarios?email=${encodeURIComponent(email)}`);
            const data = await response.json();

            if (data.length > 0) {
                await AsyncStorage.setItem("usuario", JSON.stringify(data[0]));
                router.replace('/cuestionarios');
            } else {
                const regResponse = await fetch('http://10.13.22.3:3000/usuarios', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email })
                });
                const regData = await regResponse.json();
                await AsyncStorage.setItem("usuario", JSON.stringify(regData));
                router.replace('/cuestionarios');
            }
        } catch (error) {
            Alert.alert("Error", "No se pudo iniciar sesión.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <View style={[styles.container, darkMode && styles.containerDark]}>
            <View style={[styles.form, darkMode && styles.formDark]}>
                <Text style={[styles.label, darkMode && styles.labelDark]}>
                    Ingrese correo electrónico
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
                    required
                />
                <TouchableOpacity
                    style={styles.button}
                    onPress={upSubmit}
                    disabled={loading || !email}
                    activeOpacity={0.8}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.buttonText}>Entrar</Text>
                    )}
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fafafa",
        justifyContent: "center",
        alignItems: "center",
    },
    containerDark: {
        backgroundColor: "#222",
    },
    form: {
        width: "90%",
        maxWidth: 400,
        backgroundColor: "#fff",
        padding: 24,
        borderRadius: 12,
        elevation: 3,
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
        borderColor: "#444",
        color: "#fafafa",
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

export default Login;