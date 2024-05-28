import { useLocalSearchParams, useRouter } from "expo-router";
import { useState, useEffect } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "@/hooks/useColorScheme";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";

const PlaceDetail = () => {
  const { slug } = useLocalSearchParams();
  const router = useRouter();
  const [place, setPlace] = useState<any>(null);
  const [loading, setLoading] = useState(true); 
  const getPlace = async () => {
    try {
      const response = await fetch(`https://dewalaravel.com/api/places/${slug}`);
      const placeData = await response.json();
      setPlace(placeData.data);
    } catch (error) {
      console.error("Error fetching place:", error);
    } finally {
      setLoading(false); 
    }
  };

  useEffect(() => {
    getPlace();
  }, [slug]);

  const handleBackPress = () => {
    router.back();
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#008DDA" style={styles.loading} />;
  }

  return (
    <ParallaxScrollView>
    <View style={[styles.container, { backgroundColor: 'white' }]}> 
      <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
        <Ionicons name="arrow-back" size={24} color="black" /> 
        <Text style={[styles.backButtonText, { color: 'black' }]}>Back</Text>
      </TouchableOpacity>
      {place ? (
        <>
          <Image source={{ uri: place.photo }} style={styles.image} />
          <Text style={[styles.name, { color: 'black' }]}>{place.name}</Text>
          <ThemedText style={[styles.description, { color: 'black' }]}>{place.description}</ThemedText>
        </>
      ) : (
        <Text style={[styles.errorText, { color: 'black' }]}>Error loading place details.</Text>
      )}
    </View>
    </ParallaxScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButtonText: {
    marginLeft: 5,
    fontSize: 18,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  name: {
    marginTop: 10,
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  description: {
    marginTop: 10,
    fontSize: 16,
    textAlign: 'justify',
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    textAlign: 'center',
  },
});

export default PlaceDetail;
