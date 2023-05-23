import React, {useState, useRef, useEffect} from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Camera } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { shareAsync } from 'expo-sharing'
import * as MediaLibrary from "expo-media-library"
import {VIDEO_ALBUM_NAME} from "../constants/constants";

const VideoRecorder = ({ navigation, ...props}) => {
    const [videoUri, setVideoUri] = useState(null);
    const [recording, setRecording] = useState(false);
    const [cameraRef, setCameraRef] = useState(null);
    const [cameraType, setCameraType] = useState(Camera.Constants.Type.back);
    const flipCamera = () => {
        setCameraType(
            cameraType === Camera.Constants.Type.back
                ? Camera.Constants.Type.front
                : Camera.Constants.Type.back
        )
    }
    const startRecording = async () => {
        if (cameraRef) {
            setRecording(true);
            const video = await cameraRef.recordAsync();
            setVideoUri(video.uri);
            setRecording(false);
        }
    };
    const stopRecording = () => {
        if (cameraRef) {
            cameraRef.stopRecording();
            setRecording(false);
        }
    };

    useEffect(()=> {
        if (videoUri){
            saveToGallery();
        }
    }, [videoUri])

    const shareVideo = () => {
        shareAsync(videoUri.toString()).then(() => {
            setVideoUri(null);
        })
    }
    const saveToGallery = async () => {
        try {
            const albumName = VIDEO_ALBUM_NAME;
            const asset = await MediaLibrary.createAssetAsync(videoUri.toString());
            const album = await MediaLibrary.getAlbumAsync(albumName);
            if (album == null) {
                await MediaLibrary.createAlbumAsync(albumName, asset, false);
            } else {
                await MediaLibrary.addAssetsToAlbumAsync(asset, album, false);
            }
        } catch (error) {
            console.log('Ошибка при сохранении', error);
        }
        setVideoUri(null);
    };


    return (
        <View style={styles.container}>
            <Camera style={styles.cameraPreview} ref={(ref) => setCameraRef(ref)} type={cameraType}>
                <View style={styles.containerOne}>

                </View>
                <View style={styles.containerTwo}>

                </View>
                <View style={styles.containerThree}>
                    <TouchableOpacity onPress={() => {navigation.navigate("VideoPlayer")}}>
                        <Ionicons name="md-albums-outline" size={40} color="#D3D3D3" />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={recording ? stopRecording : startRecording}>
                        {recording ?
                            <Ionicons name="md-stop-circle-outline" size={75} color="red" />
                            :
                            <Ionicons name="md-radio-button-on" size={75} color="#D3D3D3" />
                        }
                    </TouchableOpacity>

                    <TouchableOpacity onPress={flipCamera}>
                        <Ionicons name="md-sync-circle-outline" size={50} color="#D3D3D3" />
                    </TouchableOpacity>
                </View>
            </Camera>
        </View>
    );
};
// <Ionicons name="md-stop-circle-outline" size={65} color="black" />
// <Ionicons name="camera-reverse-outline" size={24} color="black"/>

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cameraPreview: {
        width: '100%',
        height: '100%',
    },
    containerOne: {
        flex: 5,
        backgroundColor: "gray",
    },
    containerTwo: {
        flex: 82,
        backgroundColor: 'transparent',
    },
    containerThree: {
        flex: 12,
        paddingHorizontal: 30,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: 'green',
    },
});

export default VideoRecorder;
