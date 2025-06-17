import { useEffect } from 'react';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import Respuestas from '@/components/Respuesta';

export default function RespuestaScreen() {
  const { id_cuestionario, id_pregunta } = useLocalSearchParams();
  const navigation = useNavigation();
  const router = useRouter();

  useEffect(() => {
    navigation.setOptions({
      title: 'Respuestas',
      headerTitleAlign: 'center',
    });
  }, []);

  return <Respuestas id_cuestionario={id_cuestionario} id_pregunta={id_pregunta} />;
}