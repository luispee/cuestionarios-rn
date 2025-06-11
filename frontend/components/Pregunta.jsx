import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useTheme } from '../context/DarkContext.jsx';
import { fetchJson } from '../components/utils.js';

function Preguntas() {
    const [cuestionario, setCuestionario] = useState(null);
    const [preguntas, setPreguntas] = useState([]);
    const navigation = useNavigation();
    const route = useRoute();
    const { darkMode } = useTheme();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const id_cuestionario = route.params?.id_cuestionario;

    const colores = [
        '#b39ddb', '#9575cd', '#7e57c2', '#6f00ff', '#512da8',
        '#FF6B6B', '#4ECDC4', '#556270', '#C06C84', '#6C5B7B',
        '#355C7D', '#FFA726', '#26A69A', '#5C6BC0', '#EF5350'
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const preguntasData = await fetchJson(`/pregunta?id_cuestionario=${id_cuestionario}`);
                setPreguntas(preguntasData);
                const cuestionarioData = await fetchJson(`/cuestionario?id=${id_cuestionario}`);
                setCuestionario(cuestionarioData[0]);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id_cuestionario]);

    const Responder = (id_cuestionario, id_pregunta, tipo) => {
        navigation.navigate("PreguntaDetalle", { id_cuestionario, id_pregunta, tipo });
    };

    if (loading) return <ActivityIndicator size="large" color="#6f00ff" style={{ flex: 1, justifyContent: 'center' }} />;
    if (error) return <Text style={styles.error}>Error: {error}</Text>;
    if (!cuestionario) return <Text style={styles.error}>No se encontró el cuestionario.</Text>;

    return (
        <ScrollView style={[styles.container, darkMode && styles.containerDark]}>
            <Text style={[styles.title, darkMode && styles.titleDark]}>
                Cuestionario: {cuestionario.nombre}
            </Text>
            <Text style={[styles.desc, darkMode && styles.descDark]}>
                <Text style={{ fontWeight: 'bold' }}>Descripción: </Text>
                {cuestionario.descripcion}
            </Text>
            {preguntas
                .filter(p => String(p.id_cuestionario) === String(id_cuestionario))
                .map((pregunta, idx) => (
                    <TouchableOpacity
                        key={pregunta.id}
                        style={[
                            styles.preguntaItem,
                            { backgroundColor: colores[pregunta.id_cuestionario % colores.length] }
                        ]}
                        onPress={() => Responder(pregunta.id_cuestionario, pregunta.id, pregunta.tipo)}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.preguntaText}>
                            <Text style={{ fontWeight: 'bold' }}>Planteo: </Text>{pregunta.planteo}
                        </Text>
                        <Text style={styles.preguntaTipo}>
                            <Text style={{ fontWeight: 'bold' }}>Tipo: </Text>{pregunta.tipo}
                        </Text>
                    </TouchableOpacity>
                ))}
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
    title: {
        fontSize: 22,
        marginBottom: 8,
        color: "#222",
    },
    titleDark: {
        color: "#fafafa",
    },
    desc: {
        fontSize: 16,
        marginBottom: 16,
        color: "#444",
    },
    descDark: {
        color: "#ccc",
    },
    preguntaItem: {
        borderRadius: 12,
        padding: 18,
        marginBottom: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 2,
    },
    preguntaText: {
        color: "#fff",
        fontSize: 18,
        marginBottom: 4,
    },
    preguntaTipo: {
        color: "#fff",
        fontSize: 15,
    },
    error: {
        color: "red",
        textAlign: "center",
        marginTop: 40,
    }
});

export default Preguntas;