import { useLocalSearchParams } from 'expo-router';
import Preguntas from '@/components/Pregunta';

export default function PreguntasScreen() {
  const { id_cuestionario } = useLocalSearchParams();
  return <Preguntas id_cuestionario={id_cuestionario} />;
}