import React, {useState, useEffect} from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, Switch, StyleSheet, Image, Alert, ImageBackground } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import weatherData from '../../weatherData.json';

const weatherIcons = {
  sunny: require('../../assets/sun.png'),
  cloudy: require('../../assets/cloud.png'),
  rain: require('../../assets/heavyrain.png'),
};

const containerBg = require('../../assets/bg.png');

const getWeatherIcon = condition => {
  if (!condition) return null;
  condition = condition.toLowerCase();
  if (condition.includes('sunny')) return weatherIcons.sunny;
  if (condition.includes('cloud')) return weatherIcons.cloudy;
  if (condition.includes('rain')) return weatherIcons.rain;
  return null;
};

const WeatherScreen = ({navigation, route}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [weather, setWeather] = useState(null);
  const [recentSearches, setRecentSearches] = useState([]);
  const [isCelsius, setIsCelsius] = useState(true);
  const [favorites, setFavorites] = useState([]);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    loadRecentSearch();
    checkDarkMode();
    loadFavorites();
  }, []);

  useEffect(() => {
    if (route.params?.city) {
      searchWeather(route.params.city);
    }
  }, [route.params?.city]);

  const searchWeather = async cityName => {
    const city = weatherData.cities.find(
      c => c.name.toLowerCase() === cityName.toLowerCase(),
    );
    if (city) {
      setWeather(city);
      saveRecentSearch(city.name);
      AsyncStorage.setItem('lastSearched', JSON.stringify(city));
    } else {
      Alert.alert('City Not Found', 'Please enter a valid city name.');
    }
  };

  const saveRecentSearch = async city => {
    let updatedSearches = [city, ...recentSearches.filter(c => c !== city)];
    setRecentSearches(updatedSearches);
    await AsyncStorage.setItem(
      'recentSearches',
      JSON.stringify(updatedSearches),
    );
  };

  const loadRecentSearch = async () => {
    const searches = await AsyncStorage.getItem('recentSearches');
    if (searches) {
      setRecentSearches(JSON.parse(searches));
    }

    const lastCity = await AsyncStorage.getItem('lastSearched');
    if (lastCity) {
      setWeather(JSON.parse(lastCity));
    }
  };

  const toggleTempUnit = () => setIsCelsius(!isCelsius);

  const loadFavorites = async () => {
    const favs = await AsyncStorage.getItem('favorites');
    if (favs) {
      setFavorites(JSON.parse(favs));
    }
  };


  const toggleFavorite = city => {
    let updatedFavorites = favorites.includes(city)
      ? favorites.filter(c => c !== city)
      : [...favorites, city];

    setFavorites(updatedFavorites);
    AsyncStorage.setItem('favorites', JSON.stringify(updatedFavorites));
  };

  const checkDarkMode = () => {
    const hour = new Date().getHours();
    setDarkMode(hour >= 18 || hour < 6);
  };

  return (
    <View style={[styles.container, darkMode && styles.darkBackground]}>
      <TextInput
        style={styles.input}
        placeholder="Enter city name"
        value={searchQuery}
        onChangeText={setSearchQuery}
        onSubmitEditing={() => searchWeather(searchQuery)}
      />

      {weather && (
        <ImageBackground
          source={containerBg}
          style={styles.weatherCard}
          imageStyle={{borderRadius: 10}}>
          <Text style={styles.cityName}>{weather.name}</Text>

          <Image
            source={getWeatherIcon(weather.weather)}
            style={styles.weatherImage}
            resizeMode="contain"
          />

          <Text style={styles.weatherDesc}>{weather.weather}</Text>
          <Text style={styles.temp}>
            {isCelsius
              ? weather.temperature
              : (weather.temperature * 9) / 5 + 32}
            ° {isCelsius ? 'C' : 'F'}
          </Text>
          <Text style={styles.info}>Humidity: {weather.humidity}%</Text>
          <Text style={styles.info}>Wind Speed: {weather.wind_speed} km/h</Text>
          <TouchableOpacity onPress={() => toggleFavorite(weather.name)}>
            <Text style={styles.favorite}>
              {favorites.includes(weather.name)
                ? '★ Favorite'
                : '☆ Mark as Favorite'}
            </Text>
          </TouchableOpacity>
        </ImageBackground>
      )}

      <View style={styles.switchContainer}>
        <Text style={{ fontSize: 16, fontWeight: 'bold', color: darkMode ? '#fff' : '#000' }}>°C</Text>
        <Switch value={!isCelsius} onValueChange={toggleTempUnit} />
        <Text style={{ fontSize: 16, fontWeight: 'bold', color: darkMode ? '#fff' : '#000' }}>°F</Text>
      </View>

      <Text style={{ fontSize: 18, fontWeight: 'bold', marginTop: 10, marginBottom: 15, color: darkMode ? '#fff' : '#333' }}>Recent Searches</Text>
      <FlatList
        data={recentSearches}
        renderItem={({item}) => (
          <TouchableOpacity style={styles.recentContainer} onPress={() => searchWeather(item)}>
            <Text style={styles.recentText}>{item}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  darkBackground: {
    backgroundColor: '#121212',
  },
  input: {
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    marginBottom: 10,
  },
  weatherCard: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  cityName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  weatherImage: {
    width: 100,
    height: 100,
    marginVertical: 10,
  },
  weatherDesc: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 5,
  },
  info: {
    color: '#fff',
  },
  temp: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  favorite: {
    color: 'gold',
    marginTop: 10,
    fontWeight: 'bold',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  recentContainer: { 
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
  recentText: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: '#333' 
  }
});
export default WeatherScreen;