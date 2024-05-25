import React, { useEffect, useState } from "react";
import {
  Image,
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  Modal,
  TouchableOpacity,
  Button,
  TextInput,
} from "react-native";
import { useFonts } from "@expo-google-fonts/poppins";
import { HelloWave } from "@/components/HelloWave";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

// Interface Place
interface Place {
  id: number;
  name: string;
  photo: string;
  description: string;
}

export default function HomeScreen() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const baseURL = "https://dewalaravel.com";

  const [loaded] = useFonts({
    PoppinsRegular: require("../../assets/fonts/Poppins-Regular.ttf"),
    PoppinsBold: require("../../assets/fonts/Poppins-Bold.ttf"),
    PoppinsMedium: require("../../assets/fonts/Poppins-Medium.ttf"),
    PoppinsSemibold: require("../../assets/fonts/Poppins-SemiBold.ttf"),
  });

  useEffect(() => {
    fetch(`${baseURL}/api/places`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((responseData) => {
        console.log("Fetched data:", responseData);
        if (Array.isArray(responseData.data)) {
          setPlaces(responseData.data);
        } else {
          console.error("Unexpected data format:", responseData);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, []);

  const openModal = (place: Place) => {
    setSelectedPlace(place);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedPlace(null);
  };

  const filteredPlaces = places.filter((place) =>
    place.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!loaded) {
    return <ActivityIndicator size="large" color="#008DDA" />;
  }

  return (
    <ParallaxScrollView>
      <ThemedView style={styles.titleContainer}>
        <ThemedText style={styles.titleText}>Explore the World!</ThemedText>
      </ThemedView>
      {loading ? (
        <ActivityIndicator size="large" color="#008DDA" />
      ) : (
        <View style={styles.placesContainer}>
          {filteredPlaces.length > 0 ? (
            filteredPlaces.map((item) => (
              <TouchableOpacity key={item.id} onPress={() => openModal(item)}>
                <View style={styles.placeContainer}>
                  <Image
                    source={{ uri: `${item.photo}` }}
                    style={styles.placeImage}
                    onError={(error) =>
                      console.error(
                        "Error loading image:",
                        error.nativeEvent.error
                      )
                    }
                  />
                  <Text style={styles.placeName}>{item.name}</Text>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={{ color: "#31363F" }}>No places available.</Text>
          )}
        </View>
      )}
      {selectedPlace && (
        <Modal
          transparent={true}
          animationType="slide"
          visible={modalVisible}
          onRequestClose={closeModal}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Image
                source={{ uri: `${selectedPlace.photo}` }}
                style={styles.modalImage}
                onError={(error) =>
                  console.error("Error loading image:", error.nativeEvent.error)
                }
              />
              <Text style={styles.modalTitle}>{selectedPlace.name}</Text>
              <Text style={styles.modalDescription}>
                {selectedPlace.description}
              </Text>
              <Button title="Close" onPress={closeModal} />
            </View>
          </View>
        </Modal>
      )}
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleText: {
    color: "#008DDA",
    fontFamily: "PoppinsBold",
    fontSize: 22,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 55,
    marginLeft: 17,
  },
  placesContainer: {
    paddingHorizontal: 16,
  },
  placeContainer: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: "#F7F7F7",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 2,
    flexDirection: "row",
    alignItems: "center",
  },
  placeImage: {
    width: 170,
    height: 150,
    borderRadius: 8,
  },
  placeName: {
    marginLeft: 30,
    fontSize: 16,
    color: "#333",
    flexShrink: 1,
    fontFamily: "PoppinsMedium",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
  },
  modalImage: {
    width: "100%",
    height: 200,
    borderRadius: 8,
  },
  modalTitle: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    fontFamily: "PoppinsBold",
  },
  modalDescription: {
    marginTop: 8,
    fontSize: 16,
    color: "#333",
    fontFamily: "PoppinsRegular",
  },
});
