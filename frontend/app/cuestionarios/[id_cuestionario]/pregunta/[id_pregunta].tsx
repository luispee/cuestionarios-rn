import { useEffect } from 'react';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import Respuestas from '@/components/Respuesta';
import { useTheme } from '../../../../context/DarkContext';
import { Feather } from '@expo/vector-icons';
export default function RespuestaScreen() {
  const { id_cuestionario, id_pregunta } = useLocalSearchParams();
  const navigation = useNavigation();
  const router = useRouter();
  const { darkMode, toggleTheme } = useTheme();

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={toggleTheme} style={{ marginRight: 16 }}>
          <Feather
            name={darkMode ? 'sun' : 'moon'}
            size={22}
            color={darkMode ? '#ffd700' : '#333'}
          />
        </TouchableOpacity>
      ),
      title: 'Respuestas',
      headerTitleAlign: 'center',
    });
  }, [darkMode]);

  return <Respuestas id_cuestionario={id_cuestionario} id_pregunta={id_pregunta} />;
}