import React, {useEffect, useState} from 'react';
import {StyleSheet, Text} from 'react-native';
import {SafeAreaView} from "react-native-safe-area-context";
import { Camera } from 'expo-camera';
import * as MediaLibrary from "expo-media-library"

import LoadingPlaceholder from "./src/components/LoadingPlaceholder";
import Navigation from "./src/navigation/Navigation";

export default function App() {
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [hasMicrophonePermission, setHasMicrophonePermission] = useState(null);
  const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState(null)

  useEffect(() => {
    (async () => {
      setHasCameraPermission((await Camera.requestCameraPermissionsAsync())?.status === 'granted');
      setHasMicrophonePermission((await Camera.requestMicrophonePermissionsAsync())?.status === 'granted');
      setHasMediaLibraryPermission((await MediaLibrary.requestPermissionsAsync())?.status === 'granted')
    })()
  }, []);

  if (hasCameraPermission === null || hasMicrophonePermission === null ||
      hasMediaLibraryPermission === null) {
    return <LoadingPlaceholder/>;
  }
  if (hasCameraPermission === false || hasMicrophonePermission === false
      || hasMediaLibraryPermission === false) {
    return <Text>Не удалось получить разрешение на использование камеры или микрофона или запись</Text>;
  }

  return (
      <SafeAreaView style={styles.container}>
        <Navigation/>
      </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
