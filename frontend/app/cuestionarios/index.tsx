import { useEffect } from 'react';
import { useNavigation, useRouter } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Cuestionarios from '@/components/Cuestionario';

export default function CuestionariosScreen() {
  const navigation = useNavigation();
  const router = useRouter();

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity onPress={() => router.replace('/')}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
      ),
      title: 'Cuestionarios',
      headerTitleAlign: 'center',
    });
  }, []);

  return <Cuestionarios />;
}