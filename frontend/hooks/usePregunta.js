// hooks/useRespuestas.js
import { useEffect, useState } from "react";
import { fetchJson } from "../utils/utils.js";
import { useTheme } from '../context/DarkContext.jsx';
import { useRouter } from "expo-router";
export function usePreguntas(id_cuestionario) {
    const [cuestionario, setCuestionario] = useState([]);
    const [preguntas, setPreguntas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const router = useRouter();
    const { darkMode } = useTheme();
    const colores = [
        '#b39ddb', // Lavanda suave
        '#ff8a65', // Naranja melocotón
        '#4db6ac', // Verde azulado claro
        '#f06292', // Rosa fuerte
        '#ba68c8', // Morado pastel
        '#4fc3f7', // Azul cielo
        '#81c784', // Verde menta
        '#ffd54f', // Amarillo dorado
        '#e57373', // Rojo coral claro
        '#7986cb', // Azul grisáceo
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

    const Responder = (id_cuestionario, id_pregunta) => {
        router.push(`/cuestionarios/${id_cuestionario}/pregunta/${id_pregunta}`);
    };

    return {
        cuestionario,
        preguntas,
        darkMode,
        loading,
        error,
        colores,
        Responder
    };
}