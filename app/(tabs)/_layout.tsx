import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: 'green' }}>
      <Tabs.Screen
        name="index"
        options={{
            title: 'Map',
            tabBarIcon: ({ color }) => <FontAwesome size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="Profile"
        options={{
            title: 'Profile',
            tabBarIcon: ({ color }) => <FontAwesome size={24} color={color} />
        }}
      />

      <Tabs.Screen
        name="Review"
        options={{
            title: 'Review',
            tabBarIcon: ({ color }) => <FontAwesome size={24} color={color} />
        }}
      />

      <Tabs.Screen
      name="Voice"
      options={{
        title: 'Voice',
        tabBarIcon: ({ color }) => <FontAwesome size={24} color={color} />
      }}
      />
    </Tabs>
  );
}
