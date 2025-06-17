import { Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { usePreguntas } from "../hooks/usePregunta.js";

function Preguntas({ id_cuestionario }) {
    const {cuestionario, preguntas,darkMode, loading, error, colores, Responder} = usePreguntas(id_cuestionario);

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