import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Tabs } from 'expo-router';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
      tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
      }}>
      <Tabs.Screen
      name="index"
      options={{
        title: 'Inicio',
        tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
      }}
      />
      <Tabs.Screen
      name="login"
      options={{
        title: 'Login',
        tabBarIcon: ({ color }) => <TabBarIcon name="sign-in" color={color} />,
      }}
      />
    </Tabs>
  );
}
