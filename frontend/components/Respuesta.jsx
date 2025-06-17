import React from "react";
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator, TextInput, Alert,
} from "react-native";
import { useTheme } from "../context/DarkContext";
import { useRespuestas } from "../hooks/useRespuesta";
//frontend\hooks\useRespuesta.js
function Respuestas({ id_cuestionario, id_pregunta }) {
  const {
    respuestas,
    respuestaPrevias,
    fechaRespuestas,
    respuestaMO,
    respuestaTP,
    loading,
    error,
    setRespuestaMO,
    setRespuestaTP,
    guardarRespuestaMO,
    guardarRespuestaTexto,
  } = useRespuestas(id_cuestionario, id_pregunta);
  const { darkMode } = useTheme();

  const clave = `${id_cuestionario}-${id_pregunta}`;
  const respuestasFiltradas = respuestas.filter(
    r => String(r.id_cuestionario) === String(id_cuestionario) &&
         String(r.id) === String(id_pregunta)
  );

  if (loading) return <ActivityIndicator size="large" color="#6f00ff" style={{ flex: 1 }} />;
  if (error) return <Text style={styles.error}>Error: {error}</Text>;

  return (
    <ScrollView style={[styles.container, darkMode && styles.containerDark]}>
      {respuestasFiltradas.length > 0 ? (
        respuestasFiltradas.map(respuesta => (
          <View style={styles.respuestaItem} key={respuesta.id}>
            <Text style={[styles.planteo, darkMode && styles.planteoDark]}>
              <Text style={{ fontWeight: "bold" }}>Planteo: </Text>{respuesta.planteo}
            </Text>

            {respuesta.tipo === "MO" && (
              <>
                {respuesta.opciones.map(opcion => (
                  <TouchableOpacity
                    key={opcion.id}
                    style={[
                      styles.opcion,
                      (respuestaMO === opcion.id || respuestaPrevias[clave] === opcion.id) && styles.opcionSeleccionada
                    ]}
                    onPress={() => setRespuestaMO(opcion.id)}
                  >
                    <Text style={styles.opcionTexto}>{opcion.texto}</Text>
                  </TouchableOpacity>
                ))}
                <TouchableOpacity
                  style={[styles.botonResponder, !respuestaMO && styles.botonResponderDisabled]}
                  onPress={() => guardarRespuestaMO(respuestaMO).catch(e => Alert.alert("Error", e.message))}
                  disabled={!respuestaMO}
                >
                  <Text style={styles.botonResponderTexto}>Responder</Text>
                </TouchableOpacity>
              </>
            )}

            {respuesta.tipo === "TEXTO" && (
              <>
                <TextInput
                  style={styles.input}
                  placeholder="Agregue respuesta"
                  value={respuestaTP || respuestaPrevias[clave] || ""}
                  onChangeText={text => setRespuestaTP(text)}
                  placeholderTextColor={darkMode ? "#aaa" : "#888"}
                />
                <TouchableOpacity
                  style={[styles.botonResponder, !respuestaTP && styles.botonResponderDisabled]}
                  onPress={() => guardarRespuestaTexto(respuestaTP).catch(e => Alert.alert("Error", e.message))}
                  disabled={!respuestaTP}
                >
                  <Text style={styles.botonResponderTexto}>Responder</Text>
                </TouchableOpacity>
              </>
            )}

            {fechaRespuestas[clave] && (
              <Text style={styles.fechaRespuesta}>
                Respondida: {new Date(fechaRespuestas[clave]).toLocaleString()}
              </Text>
            )}
          </View>
        ))
      ) : (
        <Text style={styles.noPreguntas}>No hay preguntas para mostrar.</Text>
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
    respuestaItem: {
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 18,
        marginBottom: 18,
        elevation: 2,
    },
    planteo: {
        fontSize: 17,
        color: "#222",
        marginBottom: 10,
    },
    planteoDark: {
        color: "#fafafa",
    },
    opcion: {
        backgroundColor: "#eee",
        borderRadius: 8,
        padding: 12,
        marginBottom: 8,
    },
    opcionSeleccionada: {
        backgroundColor: "#6f00ff",
    },
    opcionTexto: {
        color: "#222",
    },
    input: {
        borderWidth: 1,
        borderColor: "#bbb",
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
        fontSize: 16,
        color: "#222",
        backgroundColor: "#fafafa",
    },
    botonResponder: {
        backgroundColor: "#6f00ff",
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: "center",
        marginTop: 8,
    },
    botonResponderDisabled: {
        backgroundColor: "#bbb",
    },
    botonResponderTexto: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 16,
    },
    fechaRespuesta: {
        color: "green",
        fontWeight: "bold",
        fontSize: 13,
        marginTop: 10,
        alignSelf: "flex-end",
    },
    noPreguntas: {
        textAlign: "center",
        color: "#888",
        marginTop: 40,
    },
    error: {
        color: "red",
        textAlign: "center",
        marginTop: 40,
    }
});

export default Respuestas;