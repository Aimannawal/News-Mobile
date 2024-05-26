import React, { useEffect, useState } from "react";
import {
  Image,
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  Modal,
  TouchableOpacity,
  ScrollView,
  Button,
  TextInput,
} from "react-native";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useFonts } from "@expo-google-fonts/poppins";

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
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchValue, setSearchValue] = useState('');

  const baseURL = "https://dewalaravel.com";

  const [loaded] = useFonts({
    PoppinsRegular: require("../../assets/fonts/Poppins-Regular.ttf"),
    PoppinsBold: require("../../assets/fonts/Poppins-Bold.ttf"),
    PoppinsMedium: require("../../assets/fonts/Poppins-Medium.ttf"),
    PoppinsSemibold: require("../../assets/fonts/Poppins-SemiBold.ttf"),
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

    fetch(`${baseURL}/api/places`)
      .then((response) => response.json())
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

  const openCategoryModal = () => {
    setCategoryModalVisible(true);
  };

  const closeCategoryModal = () => {
    setCategoryModalVisible(false);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    closeCategoryModal();
  };

  const handleSearchChange = (text: string) => {
    setSearchValue(text);
  };

  const filteredPlaces = places.filter(place => {
    const nameMatch = place.name.toLowerCase().includes(searchValue.toLowerCase());
    const categoryMatch = !selectedCategory || place.category.name === selectedCategory || selectedCategory === "All";
    return nameMatch && categoryMatch;
  });

  const getImageSource = (photo: string) => {
    if (photo.startsWith("http") || photo.startsWith("https")) {
      return photo;
    } else {
      return `${baseURL}${photo}`;
    }
  };

  if (!loaded) {
    return <ActivityIndicator size="large" color="#008DDA" />;
  }

  return (
    <ParallaxScrollView>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title" style={styles.titleText}>
          Find your destination
        </ThemedText>
      </ThemedView>
      <TextInput
        style={styles.searchInput}
        placeholder="Search your destination"
        placeholderTextColor="#31363F"
        onChangeText={handleSearchChange}
      />
      <TouchableOpacity onPress={openCategoryModal}>
        <View style={styles.filterContainer}>
          <Text style={styles.selectedCategory}>
            {selectedCategory ? selectedCategory : "All"}
          </Text>
        </View>
      </TouchableOpacity>
      <Modal
        transparent={true}
        visible={categoryModalVisible}
        onRequestClose={closeCategoryModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Category</Text>
            {categories.map((category, index) => (
              <TouchableOpacity
                key={index}
                style={styles.categoryItem}
                onPress={() => handleCategoryChange(category.name)}
              >
                <Text style={styles.categoryText}>{category.name}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.closeButton} onPress={closeCategoryModal}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
              <Text style={styles.categoryText}>Category: {selectedPlace.category.name}</Text>
              <ScrollView style={styles.descriptionContainer}>
                <Text style={styles.modalDescription}>
                  {selectedPlace.description}
                </Text>
              </ScrollView>
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
  filterContainer: {
    marginHorizontal: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderRadius: 24,
    backgroundColor: "#fff",
    borderColor: "#FFF",
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
    fontFamily: "PoppinsRegular",
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
    marginBottom: 16,
    color: "#333",
    fontFamily: "PoppinsSemibold",
  },
  categoryItem: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    width: "100%",
  },
  categoryText: {
    fontSize: 16,
    color: "#333",
    fontFamily: "PoppinsRegular",
  },
  closeButton: {
    marginTop: 16,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "#008DDA",
    borderRadius: 12,
  },
  closeButtonText: {
    fontSize: 16,
    color: "#FFF",
    fontFamily: "PoppinsMedium",
  },
  descriptionContainer: {
    maxHeight: 200,
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
    fontFamily: "PoppinsRegular",
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

