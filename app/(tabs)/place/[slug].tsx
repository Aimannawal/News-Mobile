import { useLocalSearchParams, useRouter } from "expo-router";
import { useState, useEffect } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const PlaceDetail = () => {
  const { slug } = useLocalSearchParams();
  const router = useRouter();
  const [place, setPlace] = useState<any>(null);

  const getPlace = async () => {
    try {
      const response = await fetch(`https://dewalaravel.com/api/places/${slug}`);
      const placeData = await response.json();
      setPlace(placeData.data);
    } catch (error) {
      console.error("Error fetching place:", error);
    }
  };

  useEffect(() => {
    getPlace();
  }, [slug]);

  if (!place) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="white" />
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>
      <Image source={{ uri: place.photo }} style={styles.image} />
      <Text style={styles.name}>{place.name}</Text>
      <Text style={styles.description}>{place.description}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#1E1E1E', // Optional: to make the background darker and the border stand out more
    flex: 1,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButtonText: {
    color: 'white',
    marginLeft: 5,
    fontSize: 18,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    borderWidth: 5,  // Adding border width
    borderColor: 'white',  // Setting border color to white
  },
  name: {
    marginTop: 10,
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'white',
  },
  description: {
    marginTop: 10,
    fontSize: 16,
    color: 'gray',
    textAlign: 'center',
  },
});

export default PlaceDetail;
