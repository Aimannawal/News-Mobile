import React from "react";
import { View, Text, Image, StyleSheet, Button } from "react-native";

const DetailPlaceScreen = ({ route, navigation }) => {
  const { place } = route.params;

  const closeModal = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: place.photo }}
        style={styles.placeImage}
        onError={(error) =>
          console.error("Error loading image:", error.nativeEvent.error)
        }
      />
      <Text style={styles.placeName}>{place.name}</Text>
      <Text style={styles.placeDescription}>{place.description}</Text>
      <Button title="Close" onPress={closeModal} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  placeImage: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginBottom: 16,
  },
  placeName: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 8,
  },
  placeDescription: {
    fontSize: 16,
    textAlign: "center",
  },
});

export default DetailPlaceScreen;

