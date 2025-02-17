import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import WeatherScreen from "../screens/WeatherScreen";
import FavouriteScreen from "../screens/FavouriteScreen";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
    return (
      <Tab.Navigator screenOptions={{ 
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: "#174A93",
        tabBarInactiveTintColor: "gray",
      }}
      >
        <Tab.Screen 
          name="Home" 
          component={WeatherScreen} 
          options={{
            tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="home-variant-outline" color={color} size={size} />,
          }} 
        />
        <Tab.Screen 
          name="Favourite" 
          component={FavouriteScreen} 
          options={{
            tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="heart-outline" color={color} size={size} />,
          }} 
        />
      </Tab.Navigator>
    );
  }