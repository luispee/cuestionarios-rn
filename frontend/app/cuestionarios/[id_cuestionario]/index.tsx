import { useEffect } from 'react';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Preguntas from '@/components/Pregunta';

export default function PreguntasScreen() {
  const { id_cuestionario } = useLocalSearchParams();
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      title: 'Preguntas',
      headerTitleAlign: 'center',
    });
  }, []);

  return <Preguntas id_cuestionario={id_cuestionario} />;
}
