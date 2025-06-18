// hooks/useRespuestas.js
import React, { use, useLayoutEffect, useState } from "react";
import { useTheme } from '../context/DarkContext.jsx';
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../utils/config.js";
export function useLogin() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { darkMode, toggleTheme } = useTheme();

    async function upSubmit() {
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/usuarios?email=${encodeURIComponent(email)}`);
            const data = await response.json();

            if (data.length > 0) {
                await AsyncStorage.setItem("usuario", JSON.stringify(data[0]));
                router.replace('/cuestionarios');
            } else {
                const regResponse = await fetch(`${API_URL}/usuarios`, {
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

    return {
        email,
        setEmail,
        loading,
        upSubmit,
        darkMode,
        toggleTheme
    };
}