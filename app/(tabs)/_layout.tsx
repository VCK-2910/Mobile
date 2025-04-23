import React from 'react';
import { Tabs } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import Ionicons from '@expo/vector-icons/Ionicons';


export default function TabLayout() {
  return (
    <Tabs screenOptions={{
      tabBarActiveTintColor: "#0B3B5D",
      tabBarInactiveTintColor: "#CDCDE0",
      tabBarShowLabel: false,
      tabBarStyle: {
        backgroundColor: "#fff",
        borderTopWidth: 1,
        borderTopColor: "#ddd",
        height: 60,
        paddingBottom: 10,
      },
    }}>
      <Tabs.Screen name="Home" options={{
          title: 'Home',
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'home' : 'home-outline'} color={color} size={24} />
          ),
        }} />
        <Tabs.Screen name="Booking" options={{
          title: 'Booking',
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'calendar' : 'calendar-outline'} color={color} size={24} />
          ),
        }} />
      
        <Tabs.Screen name="Menu" options={{
          title: 'Menu',
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'restaurant' : 'restaurant-outline'} color={color} size={24} />
          ),
        }} />
      
        <Tabs.Screen name="Cart" options={{
          title: 'Cart',
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'cart' : 'cart-outline'} color={color} size={24} />
          ),
        }} />
      
        <Tabs.Screen name="Profile" options={{
          title: 'Profile',
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'person' : 'person-outline'} color={color} size={24} />
          ),
        }} />
    </Tabs>
  );
};



