import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator, TextInput, Alert } from "react-native";
import { useRoute } from "@react-navigation/native";
import { useTheme } from '../context/DarkContext.jsx';
import { fetchJson } from '../components/utils.js';
import AsyncStorage from "@react-native-async-storage/async-storage";

function Respuestas() {
    const [respuestas, setRespuestas] = useState([]);
    const [respuestaPrevias, setRespuestaPrevias] = useState({});
    const [fechaRespuestas, setFechaRespuestas] = useState({});
    const [respuestaMO, setRespuestaMO] = useState(null);
    const [respuestaTP, setRespuestaTP] = useState("");
    const { darkMode } = useTheme();
    const route = useRoute();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const id_cuestionario = route.params?.id_cuestionario;
    const id_pregunta = route.params?.id_pregunta;

    const desfaseHorario = (new Date()).getTimezoneOffset() * 60000;
    const ahora = (new Date(Date.now() - desfaseHorario)).toISOString().slice(0, -1);
    const clave = `${id_cuestionario}-${id_pregunta}`;

    const pregunta = respuestas.find(
        r => String(r.id) === String(id_pregunta) && String(r.id_cuestionario) === String(id_cuestionario)
    );

    const [usuario, setUsuario] = useState(null);

    useEffect(() => {
        const fetchUsuario = async () => {
            const userStr = await AsyncStorage.getItem("usuario");
            if (userStr) setUsuario(JSON.parse(userStr));
        };
        fetchUsuario();
    }, []);

    useEffect(() => {
        const fetchRespuestas = async () => {
            try {
                const dataPreguntas = await fetchJson(`http://localhost:3000/pregunta/`);
                setRespuestas(dataPreguntas);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        const cargarRespuestasUsuario = async () => {
            try {
                const userStr = await AsyncStorage.getItem("usuario");
                const usuario = userStr ? JSON.parse(userStr) : null;
                if (!usuario) throw new Error("Usuario no encontrado en sesión");

                const res = await fetch(`http://localhost:3000/respuesta?id_usuario=${usuario.id}`);
                if (!res.ok) throw new Error("Error al cargar respuestas del usuario");
                const data = await res.json();

                const previas = {};
                const fechas = {};
                data.forEach(r => {
                    const clave = `${r.id_cuestionario}-${r.id_pregunta}`;
                    previas[clave] = r.id_opcion || r.respuesta || "";
                    fechas[clave] = r.fecha_respuesta;
                });
                setRespuestaPrevias(previas);
                setFechaRespuestas(fechas);

                const claveActual = `${id_cuestionario}-${id_pregunta}`;
                if (previas[claveActual]) {
                    const preguntaActual = data.find(p =>
                        String(p.id_pregunta) === String(id_pregunta) &&
                        String(p.id_cuestionario) === String(id_cuestionario)
                    );
                    if (preguntaActual) {
                        if (preguntaActual.id_opcion) setRespuestaMO(preguntaActual.id_opcion);
                        else setRespuestaTP(preguntaActual.respuesta);
                    }
                }
            } catch (error) {
                // No alert, solo log
            }
        };

        fetchRespuestas();
        cargarRespuestasUsuario();
    }, [id_pregunta, id_cuestionario]);

    async function respuestaExistenteGuardada() {
        if (!usuario) return null;
        const checkRes = await fetch(`http://localhost:3000/respuesta?id_usuario=${usuario.id}&id_pregunta=${id_pregunta}`);
        if (!checkRes.ok) throw new Error("No se pudo verificar si la respuesta ya existe");

        const todasRespuestas = await checkRes.json();
        const respuestaExistente = todasRespuestas.find(
            r => r.id_usuario === usuario.id && r.id_pregunta === Number(id_pregunta) && r.id_cuestionario === Number(id_cuestionario)
        );
        return respuestaExistente;
    }

    async function guardarRespuestaMO(idOpcion) {
        try {
            if (!pregunta) throw new Error("Pregunta no encontrada");
            if (!usuario) throw new Error("Usuario no encontrado en sesión");
            const opcionSeleccionada = pregunta.opciones.find(op => op.id === idOpcion);
            const textoRespuesta = opcionSeleccionada ? opcionSeleccionada.texto : "";

            const respuestaExistente = await respuestaExistenteGuardada();

            const url = respuestaExistente
                ? `http://localhost:3000/respuesta/${respuestaExistente.id}`
                : `http://localhost:3000/respuesta`;

            const metodo = respuestaExistente ? "PUT" : "POST";

            const res = await fetch(url, {
                method: metodo,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id_usuario: usuario.id,
                    id_cuestionario: pregunta.id_cuestionario,
                    id_pregunta: pregunta.id,
                    id_opcion: opcionSeleccionada?.id,
                    respuesta: textoRespuesta,
                    fecha_respuesta: ahora,
                }),
            });

            if (!res.ok) {
                const texto = await res.text();
                throw new Error(`Error del servidor: ${res.status} - ${texto}`);
            }

            setRespuestaPrevias(prev => ({ ...prev, [clave]: opcionSeleccionada.id }));
            setFechaRespuestas(prev => ({ ...prev, [clave]: ahora }));
            setRespuestaMO(opcionSeleccionada.id);

        } catch (err) {
            Alert.alert("Error", err.message);
        }
    }

    async function guardarRespuestaTexto(texto) {
        try {
            if (!pregunta) throw new Error("Pregunta no encontrada");
            if (!usuario) throw new Error("Usuario no encontrado en sesión");

            const respuestaExistente = await respuestaExistenteGuardada();

            const url = respuestaExistente
                ? `http://localhost:3000/respuesta/${respuestaExistente.id}`
                : `http://localhost:3000/respuesta`;

            const metodo = respuestaExistente ? "PUT" : "POST";

            const res = await fetch(url, {
                method: metodo,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id_cuestionario: pregunta.id_cuestionario,
                    id_pregunta: pregunta.id,
                    id_usuario: usuario.id,
                    respuesta: texto,
                    fecha_respuesta: ahora
                })
            });

            if (!res.ok) {
                const texto = await res.text();
                throw new Error(`Error del servidor: ${res.status} - ${texto}`);
            }

            setRespuestaPrevias(prev => ({ ...prev, [clave]: texto }));
            setFechaRespuestas(prev => ({ ...prev, [clave]: ahora }));
            setRespuestaTP(texto);

        } catch (err) {
            Alert.alert("Error", err.message);
        }
    }

    const respuestasFiltradas = respuestas.filter(
        r =>
            String(r.id_cuestionario) === String(id_cuestionario) &&
            String(r.id) === String(id_pregunta)
    );

    if (loading) return <ActivityIndicator size="large" color="#6f00ff" style={{ flex: 1, justifyContent: 'center' }} />;
    if (error) return <Text style={styles.error}>Error: {error}</Text>;

    return (
        <ScrollView style={[styles.container, darkMode && styles.containerDark]}>
            {respuestasFiltradas.length > 0 ? (
                respuestasFiltradas.map(respuesta => {
                    const clave = `${respuesta.id_cuestionario}-${respuesta.id}`;
                    return (
                        <View style={styles.respuestaItem} key={respuesta.id}>
                            <Text style={[styles.planteo, darkMode && styles.planteoDark]}>
                                <Text style={{ fontWeight: 'bold' }}>Planteo: </Text>{respuesta.planteo}
                            </Text>

                            {respuesta.tipo === "MO" && (
                                <View>
                                    {respuesta.opciones.map(opcion => (
                                        <TouchableOpacity
                                            key={opcion.id}
                                            style={[
                                                styles.opcion,
                                                (respuestaMO === opcion.id || respuestaPrevias[clave] === opcion.id) && styles.opcionSeleccionada
                                            ]}
                                            onPress={() => {
                                                setRespuestaMO(opcion.id);
                                                setRespuestaPrevias(prev => ({ ...prev, [clave]: opcion.id }));
                                            }}
                                        >
                                            <Text style={styles.opcionTexto}>{opcion.texto}</Text>
                                        </TouchableOpacity>
                                    ))}
                                    <TouchableOpacity
                                        style={[
                                            styles.botonResponder,
                                            !respuestaMO && styles.botonResponderDisabled
                                        ]}
                                        onPress={() => guardarRespuestaMO(respuestaMO)}
                                        disabled={!respuestaMO}
                                        activeOpacity={0.8}
                                    >
                                        <Text style={styles.botonResponderTexto}>Responder</Text>
                                    </TouchableOpacity>
                                </View>
                            )}

                            {respuesta.tipo === "TEXTO" && (
                                <View>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Agregue respuesta"
                                        value={respuestaTP || respuestaPrevias[clave] || ""}
                                        onChangeText={text => {
                                            setRespuestaTP(text);
                                            setRespuestaPrevias(prev => ({ ...prev, [clave]: text }));
                                        }}
                                        placeholderTextColor={darkMode ? "#aaa" : "#888"}
                                    />
                                    <TouchableOpacity
                                        style={[
                                            styles.botonResponder,
                                            !respuestaTP && styles.botonResponderDisabled
                                        ]}
                                        onPress={() => guardarRespuestaTexto(respuestaTP)}
                                        disabled={!respuestaTP}
                                        activeOpacity={0.8}
                                    >
                                        <Text style={styles.botonResponderTexto}>Responder</Text>
                                    </TouchableOpacity>
                                </View>
                            )}

                            {fechaRespuestas[clave] && (
                                <Text style={styles.fechaRespuesta}>
                                    Respondida: {new Date(fechaRespuestas[clave]).toLocaleString()}
                                </Text>
                            )}
                        </View>
                    );
                })
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