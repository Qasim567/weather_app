import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';

const FavoritesScreen = ({ navigation }) => {
  const [favorites, setFavorites] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      loadFavorites();
    }
    checkDarkMode();
  }, [isFocused]);

  const loadFavorites = async () => {
    const favs = await AsyncStorage.getItem('favorites');
    if (favs) {
      setFavorites(JSON.parse(favs));
    }
  };

  const checkDarkMode = () => {
    const hour = new Date().getHours();
    setDarkMode(hour >= 18 || hour < 6);
  };

  return (
    <View style={[styles.container, darkMode && styles.darkBackground]}>
      <Text style={{fontSize: 22, fontWeight: 'bold', marginBottom: 10, color: darkMode ? '#fff' : '#000' }}>Favorite Cities</Text>
      {favorites.length === 0 ? (
        <Text style={{fontSize: 16, color: darkMode ? '#fff' : 'gray'}}>No favorite cities added yet.</Text>
      ) : (
        <FlatList
          data={favorites}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.favoriteContainer} 
              onPress={() => navigation.navigate("Home", { city: item })}
            >
              <Text style={styles.favoriteText}>{item}</Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20, 
    backgroundColor: '#f5f5f5' 
  },
  darkBackground: {
    backgroundColor: '#121212',
  },
  favoriteContainer: { 
    backgroundColor: '#e0e0e0', 
    padding: 10, 
    borderRadius: 20, 
    marginBottom: 15, 
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  favoriteText: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: '#333' 
  }
});
export default FavoritesScreen;