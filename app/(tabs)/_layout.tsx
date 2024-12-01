import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
import { View, Platform } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: 'green',
        tabBarShowLabel: false, // Hide labels for all tabs
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color }) => (
            <FontAwesome name="map" size={24} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="Microphone"
        options={{
          tabBarIcon: ({ color }) => (
            <View
              style={{
                width: 60,
                height: 60,
                borderRadius: 30,
                backgroundColor: 'white',
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: Platform.OS === 'android' ? 20 : 30,
              }}
            >
              <FontAwesome name="microphone" size={30} color="green" />
            </View>
          ),
          tabBarLabel: '',
        }}
      />

      <Tabs.Screen
        name="Review"
        options={{
          tabBarIcon: ({ color }) => (
            <FontAwesome name="star" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
