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
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useFonts } from '@expo-google-fonts/poppins';

interface Place {
  id: number;
  name: string;
  photo: string;
  description: string;
  category: {
    name: string;
  };
}

interface Category {
  name: string;
}

export default function HomeScreen() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
  const [categories, setCategories] = useState<Category[]>([]);
  const baseURL = "https://dewalaravel.com";

  const [loaded] = useFonts({
    PoppinsRegular: require('../../assets/fonts/Poppins-Regular.ttf'),
    PoppinsBold: require('../../assets/fonts/Poppins-Bold.ttf'),
  });

  useEffect(() => {
    fetch(`${baseURL}/api/categories`)
      .then((response) => response.json())
      .then((responseData) => {
        console.log("Fetched categories:", responseData);
        if (Array.isArray(responseData.data)) {
          const allCategories = [{ name: "All" }, ...responseData.data];
          setCategories(allCategories);
        } else {
          console.error("Unexpected data format for categories:", responseData);
        }
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
      });

    // Fetch places
    fetch(`${baseURL}/api/places`)
      .then((response) => response.json())
      .then((responseData) => {
        console.log("Fetched data:", responseData); // Log the fetched data for debugging
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

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const selectCategory = (category: string) => {
    if (category === "All") {
      setSelectedCategory(undefined);
    } else {
      setSelectedCategory(category);
    }
    setModalVisible(false);
  };

  const filteredPlaces = places.filter((place) =>
    (selectedCategory ? place.category.name === selectedCategory : true)
  );

  const getImageSource = (photo: string) => {
    if (photo.startsWith("http") || photo.startsWith("https")) {
      return photo;
    } else {
      return `${baseURL}${photo}`;
    }
  };

  return (
    <ParallaxScrollView>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title" style={styles.titleText}>
          Find your destination
        </ThemedText>
      </ThemedView>
      <TouchableOpacity onPress={openModal}>
        <View style={styles.filterContainer}>
          <Text style={styles.selectedCategory}>
            {selectedCategory ? selectedCategory : "All"}
          </Text>
        </View>
      </TouchableOpacity>
      <Modal
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Category</Text>
            {categories.map((category, index) => (
              <TouchableOpacity
                key={index}
                style={styles.categoryItem}
                onPress={() => selectCategory(category.name)}
              >
                <Text style={styles.categoryText}>{category.name}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={closeModal}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <TextInput
        style={styles.searchInput}
        placeholder="Search your destination"
        placeholderTextColor={"#31363F"}
      />
      {loading ? (
        <ActivityIndicator size="large" color="#008DDA" />
      ) : (
        <View style={styles.placesContainer}>
          {filteredPlaces.length > 0 ? (
            filteredPlaces.map((item) => (
              <TouchableOpacity key={item.id} onPress={() => openModal(item)}>
                <View style={styles.placeContainer}>
                  <Image
                    source={{ uri: getImageSource(item.photo) }}
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
                source={{ uri: getImageSource(selectedPlace.photo) }}
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
    fontFamily: 'PoppinsBold',
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 55,
  },
  filterContainer: {
    marginHorizontal: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderRadius: 24,
    borderColor: "#008DDA",
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 2,
    justifyContent: "center",
    alignItems: "center",
    height: 40,
  },
  selectedCategory: {
    color: "#31363F",
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
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#333",
  },
  categoryItem: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  categoryText: {
    fontSize: 16,
    color: "#333",
  },
  closeButton: {
    marginTop: 16,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "#008DDA",
    borderRadius: 8,
  },
  closeButtonText: {
    fontSize: 16,
    color: "#FFF",
  },
  searchInput: {
    height: 49,
    flexDirection: "row",
    borderWidth: 1,
    marginHorizontal: 16,
    marginBottom: 16,
    paddingHorizontal: 14,
    borderRadius: 24,
    color: "#31363F",
    borderColor: "#FFF",
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 2,
  },
  placesContainer: {
    paddingHorizontal: 16,
  },
  placeContainer: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: "#F5F7F8",
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
    width: 100,
    height: 150,
    borderRadius: 8,
  },
  placeName: {
    marginTop: 8,
    fontSize: 16,
    color: "#333",
    flexShrink: 1,
    fontFamily: 'PoppinsRegular',
  },
  modalImage: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginBottom: 16,
  },
  modalDescription: {
    fontSize: 16,
    color: "#333",
  },
});

