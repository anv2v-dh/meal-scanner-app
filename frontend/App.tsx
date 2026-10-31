import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function App() {
  const [image, setImage] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 1. Pick an image from the gallery
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.5, // Lower quality = smaller Base64 string = faster upload
      base64: true, // We need the Base64 string!
    });

    if (!result.canceled && result.assets[0].base64) {
      setImage(result.assets[0].uri);
      setResult(null);
      setError(null);
      
      // Automatically send to AI after picking
      analyzeImage(result.assets[0].base64, result.assets[0].mimeType || 'image/jpeg');
    }
  };

  // 2. Send the Base64 string to the backend
  const analyzeImage = async (base64: string, mimeType: string) => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3000/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: base64, mimeType }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || 'Failed to analyze');

      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>AI Meal Scanner</Text>

      <TouchableOpacity style={styles.button} onPress={pickImage}>
        <Text style={styles.buttonText}>Pick an Image</Text>
      </TouchableOpacity>

      {image && <Image source={{ uri: image }} style={styles.image} />}

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text>Analyzing your food...</Text>
        </View>
      )}

      {error && <Text style={styles.errorText}>Error: {error}</Text>}

      {result && (
        <View style={styles.resultContainer}>
          <Text style={styles.foodName}>{result.foodName}</Text>
          <Text style={styles.macro}>Calories: {result.calories} kcal</Text>
          <Text style={styles.macro}>Protein: {result.protein}g</Text>
          <Text style={styles.macro}>Carbs: {result.carbs}g</Text>
          <Text style={styles.macro}>Fat: {result.fat}g</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, alignItems: 'center', padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, marginTop: 40 },
  button: { backgroundColor: '#2ab3b1', padding: 15, borderRadius: 10, width: '100%', alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  image: { width: 250, height: 250, marginTop: 20, borderRadius: 10 },
  loadingContainer: { marginTop: 20, alignItems: 'center' },
  errorText: { color: 'red', marginTop: 20, textAlign: 'center' },
  resultContainer: { marginTop: 20, padding: 20, backgroundColor: '#f0f0f0', borderRadius: 10, width: '100%' },
  foodName: { fontSize: 22, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
  macro: { fontSize: 18, marginBottom: 5, textAlign: 'center' },
});
