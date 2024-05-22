import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, View, Text, ActivityIndicator } from 'react-native';
import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

interface Place {
  id: number;
  photo: string;
  description: string;
}

export default function HomeScreen() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const baseURL = 'https://dewalaravel.com'; // Base URL for the API

  useEffect(() => {
    fetch(`${baseURL}/api/places`)
      .then(response => response.json())
      .then(responseData => {
        console.log('Fetched data:', responseData); // Log the fetched data for debugging
        if (Array.isArray(responseData.data)) {
          setPlaces(responseData.data);
        } else {
          console.error('Unexpected data format:', responseData);
        }
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  }, []);

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Welcome, Abi Arrasyid!</ThemedText>
        <HelloWave />
      </ThemedView>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <View style={styles.placesContainer}>
          {places.length > 0 ? (
            places.map((item) => (
              <View key={item.id} style={styles.placeContainer}>
                <Image
                  source={{ uri: `${baseURL}${item.photo}` }}
                  style={styles.placeImage}
                  onError={(error) => console.error('Error loading image:', error.nativeEvent.error)}
                />
                <Text style={styles.placeDescription}>{item.description}</Text>
              </View>
            ))
          ) : (
            <Text>No places available.</Text>
          )}
        </View>
      )}
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  placesContainer: {
    paddingHorizontal: 16,
  },
  placeContainer: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  placeImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  placeDescription: {
    marginTop: 8,
    fontSize: 16,
    color: '#333',
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
