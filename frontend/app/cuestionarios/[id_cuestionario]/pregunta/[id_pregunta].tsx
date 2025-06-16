import { useLocalSearchParams } from 'expo-router';
import Respuestas from '@/components/Respuesta';

export default function RespuestaScreen() {
  const { id_cuestionario, id_pregunta } = useLocalSearchParams();
  return <Respuestas id_cuestionario={id_cuestionario} id_pregunta={id_pregunta} />;
}