import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useCuestionario } from "../hooks/useCuestionario.js";
function Cuestionarios() {
    const { cuestionarios, loading, error, colores, MostrarPreguntas, darkMode} = useCuestionario()

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