import { useEffect } from 'react';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Preguntas from '@/components/Pregunta';
import { useTheme } from '../../../context/DarkContext';
import { Feather } from '@expo/vector-icons';
export default function PreguntasScreen() {
  const { id_cuestionario } = useLocalSearchParams();
  const navigation = useNavigation();
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
      title: 'Preguntas',
      headerTitleAlign: 'center',
    });
  }, [darkMode]);

  return <Preguntas id_cuestionario={id_cuestionario} />;
}
