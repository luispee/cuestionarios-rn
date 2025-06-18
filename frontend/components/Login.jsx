import React, { use, useLayoutEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { useLogin } from "../hooks/useLogin.js";

function Login() {
    const { email, setEmail, loading, upSubmit, darkMode, toggleTheme } = useLogin();
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
        backgroundColor: "#f4f4f4",
        justifyContent: "center",
        alignItems: "center",
        padding: 100,
    },
    containerDark: {
        backgroundColor: "#1e1e1e",
    },
    form: {
        width: "100%",
        maxWidth: 360,
        backgroundColor: "#ffffff",
        padding: 24,
        borderRadius: 16,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 8,
        elevation: 6,
    },
    formDark: {
        backgroundColor: "#2b2b2b",
        shadowColor: "#000",
    },
    label: {
        fontSize: 18,
        marginBottom: 8,
        color: "#333333",
        fontWeight: "500",
    },
    labelDark: {
        color: "#e0e0e0",
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 10,
        padding: 14,
        marginBottom: 20,
        fontSize: 16,
        backgroundColor: "#f9f9f9",
        color: "#333",
    },
    inputDark: {
        backgroundColor: "#1c1c1c",
        borderColor: "#444",
        color: "#f1f1f1",
    },
    button: {
        backgroundColor: "#6f00ff",
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: "center",
        shadowColor: "#6f00ff",
        shadowOpacity: 0.3,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 6,
    },
    buttonText: {
        color: "#ffffff",
        fontSize: 16,
        fontWeight: "bold",
    },
});

export default Login;