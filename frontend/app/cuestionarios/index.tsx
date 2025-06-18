import { useLayoutEffect } from 'react';
import { useNavigation, useRouter } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Cuestionarios from '@/components/Cuestionario';
import { useTheme } from '../../context/DarkContext';
import { Feather } from '@expo/vector-icons';

export default function CuestionariosScreen() {
  const navigation = useNavigation();
  const router = useRouter();
  const { darkMode, toggleTheme } = useTheme();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity onPress={() => router.replace('/')}>
          <Ionicons
            name="arrow-back"
            size={24}
            color={darkMode ? '#333' : '#333'}
          />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity onPress={toggleTheme} style={{ marginRight: 16 }}>
          <Feather
            name={darkMode ? 'sun' : 'moon'}
            size={22}
            color={darkMode ? '#ffd700' : '#333'}
          />
        </TouchableOpacity>
      ),
      title: 'Cuestionarios',
      headerTitleAlign: 'center',
    });
  }, [navigation, router, toggleTheme, darkMode]);

  return <Cuestionarios />;
}
