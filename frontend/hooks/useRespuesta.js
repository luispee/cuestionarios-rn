// hooks/useRespuestas.js
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchJson } from "../utils/utils.js";
import { API_URL } from "../utils/config.js";
export function useRespuestas(id_cuestionario, id_pregunta) {
  const [respuestas, setRespuestas] = useState([]);
  const [respuestaPrevias, setRespuestaPrevias] = useState({});
  const [fechaRespuestas, setFechaRespuestas] = useState({});
  const [respuestaMO, setRespuestaMO] = useState(null);
  const [respuestaTP, setRespuestaTP] = useState("");
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const desfaseHorario = new Date().getTimezoneOffset() * 60000;
  const ahora = new Date(Date.now() - desfaseHorario).toISOString().slice(0, -1);
  const clave = `${id_cuestionario}-${id_pregunta}`;

  const pregunta = respuestas.find(
    r => String(r.id) === String(id_pregunta) && String(r.id_cuestionario) === String(id_cuestionario)
  );

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
        const dataPreguntas = await fetchJson(`/pregunta/`);
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

        const res = await fetch(`${API_URL}/respuesta?id_usuario=${usuario.id}`);
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
        const preguntaActual = data.find(
          p => String(p.id_pregunta) === String(id_pregunta) &&
               String(p.id_cuestionario) === String(id_cuestionario)
        );
        if (preguntaActual) {
          if (preguntaActual.id_opcion) setRespuestaMO(preguntaActual.id_opcion);
          else setRespuestaTP(preguntaActual.respuesta);
        }
      } catch (error) {
        // Solo log
        console.error(error.message);
      }
    };

    fetchRespuestas();
    cargarRespuestasUsuario();
  }, [id_pregunta, id_cuestionario]);

  const guardarRespuestaMO = async (idOpcion) => {
    if (!pregunta || !usuario) return;

    const opcion = pregunta.opciones.find(op => op.id === idOpcion);
    const textoRespuesta = opcion?.texto || "";

    const respuestaExistente = await respuestaExistenteGuardada();
    const url = respuestaExistente
      ? `${API_URL}/respuesta/${respuestaExistente.id}`
      : `${API_URL}/respuesta`;

    const metodo = respuestaExistente ? "PUT" : "POST";

    const res = await fetch(url, {
      method: metodo,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id_usuario: usuario.id,
        id_cuestionario: pregunta.id_cuestionario,
        id_pregunta: pregunta.id,
        id_opcion: idOpcion,
        respuesta: textoRespuesta,
        fecha_respuesta: ahora,
      }),
    });

    if (!res.ok) throw new Error("Error al guardar respuesta MO");

    setRespuestaMO(idOpcion);
    setRespuestaPrevias(prev => ({ ...prev, [clave]: idOpcion }));
    setFechaRespuestas(prev => ({ ...prev, [clave]: ahora }));
  };

  const guardarRespuestaTexto = async (texto) => {
    if (!pregunta || !usuario) return;

    const respuestaExistente = await respuestaExistenteGuardada();
    const url = respuestaExistente
      ? `${API_URL}/respuesta/${respuestaExistente.id}`
      : `${API_URL}/respuesta`;

    const metodo = respuestaExistente ? "PUT" : "POST";

    const res = await fetch(url, {
      method: metodo,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id_usuario: usuario.id,
        id_cuestionario: pregunta.id_cuestionario,
        id_pregunta: pregunta.id,
        respuesta: texto,
        fecha_respuesta: ahora,
      }),
    });

    if (!res.ok) throw new Error("Error al guardar respuesta texto");

    setRespuestaTP(texto);
    setRespuestaPrevias(prev => ({ ...prev, [clave]: texto }));
    setFechaRespuestas(prev => ({ ...prev, [clave]: ahora }));
  };

  async function respuestaExistenteGuardada() {
    if (!usuario) return null;

    const res = await fetch(`${API_URL}/respuesta?id_usuario=${usuario.id}&id_pregunta=${id_pregunta}`);
    if (!res.ok) return null;

    const data = await res.json();
    return data.find(
      r =>
        r.id_usuario === usuario.id &&
        r.id_pregunta === Number(id_pregunta) &&
        r.id_cuestionario === Number(id_cuestionario)
    );
  }

  return {
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
  };
}
