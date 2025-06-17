import React, { useState, useEffect } from "react";
import { useTheme } from '../context/DarkContext.jsx';
import { useRouter } from 'expo-router';
import { API_URL } from "../utils/config.js";
export function useCuestionario() {
    const [cuestionarios, setCuestionarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const router = useRouter();
    const { darkMode } = useTheme();

    const fetchCuestionarios = async () => {
        try {
            const response = await fetch(`${API_URL}/cuestionario`);
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

    return {
        cuestionarios,
        loading,
        error,
        colores,
        MostrarPreguntas,
        darkMode
    };
}