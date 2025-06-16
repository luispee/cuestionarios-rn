import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from '../context/DarkContext.jsx';
import { useRouter } from 'expo-router';

function Cuestionarios() {
    console.log('Renderizando Cuestionarios');
    const [cuestionarios, setCuestionarios] = useState([]);
    const { darkMode } = useTheme();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const router = useRouter();

    const fetchCuestionarios = async () => {
        try {
            const response = await fetch(`http://10.13.22.3:3000/cuestionario`);
            if (!response.ok) throw new Error("Network response was not ok");
            const data = await response.json();
            setCuestionarios(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const MostrarPreguntas = (id_cuestionario) => {
        router.push(`/cuestionarios/${id_cuestionario}`);
    };

    useEffect(() => {
        fetchCuestionarios();
    }, []);

    const colores = [
        '#b39ddb', '#9575cd', '#7e57c2', '#6f00ff', '#512da8',
        '#FF6B6B', '#4ECDC4', '#556270', '#C06C84', '#6C5B7B',
        '#355C7D', '#FFA726', '#26A69A', '#5C6BC0', '#EF5350'
    ];

    if (loading) return <ActivityIndicator size="large" color="#6f00ff" style={{ flex: 1, justifyContent: 'center' }} />;
    if (error) return <Text style={styles.error}>Error: {error}</Text>;

    return (
        <ScrollView style={[styles.container, darkMode && styles.containerDark]}>
            {cuestionarios.map((cuestionario) =>
                <TouchableOpacity
                    key={cuestionario.id}
                    style={[
                        styles.cuestionarioItem,
                        { backgroundColor: colores[cuestionario.id % colores.length] }
                    ]}
                    onPress={() => MostrarPreguntas(cuestionario.id)}
                    activeOpacity={0.8}
                >
                    <Text style={styles.cuestionarioNombre}>
                        <Text style={{ fontWeight: 'bold' }}>Nombre: </Text>{cuestionario.nombre}
                    </Text>
                    <Text style={styles.cuestionarioDescripcion}>
                        <Text style={{ fontWeight: 'bold' }}>Descripción: </Text>{cuestionario.descripcion}
                    </Text>
                </TouchableOpacity>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fafafa",
        padding: 16,
    },
    containerDark: {
        backgroundColor: "#222",
    },
    cuestionarioItem: {
        borderRadius: 12,
        padding: 18,
        marginBottom: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 2,
    },
    cuestionarioNombre: {
        color: "#fff",
        fontSize: 18,
        marginBottom: 8,
    },
    cuestionarioDescripcion: {
        color: "#fff",
        fontSize: 15,
    },
    error: {
        color: "red",
        textAlign: "center",
        marginTop: 40,
    }
});

export default Cuestionarios;