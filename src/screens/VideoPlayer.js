import React, { useState, useEffect } from 'react';
import {View, Text, FlatList, TouchableOpacity, Image, StyleSheet, Modal} from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import { Video } from 'expo-av';
import {VIDEO_ALBUM_NAME} from "../constants/constants";
import {Asset} from "expo-asset";
import {Ionicons} from "@expo/vector-icons";


const getVideosFromAlbum = async (albumName) => {
    const albums = await MediaLibrary.getAlbumsAsync();
    const album = albums.find((a) => a.title === albumName);

    return await MediaLibrary.getAssetsAsync({ album: album.id, mediaType: 'video' });
};

const VideoPlayer = () => {
    const [videos, setVideos] = useState([]);
    const [selectedVideo, setSelectedVideo] = useState(null);

    useEffect(() => {
        (async () => {
            const media = await getVideosFromAlbum(VIDEO_ALBUM_NAME);
            const assets = media.assets !== null ? media.assets : [];
            setVideos(assets);
        })();
    }, []);


    const renderVideo = ({ item }) => {
        return (
            <TouchableOpacity style={styles.videoContainer}
                              onPress={() => setSelectedVideo(item)}>
                <Image source={{ uri: item?.uri }} style={styles.videoThumbnail} />
                <Text>{item?.filename?.substring(0,15)}</Text>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            {selectedVideo
                ?
                <Modal animationType='slide' visible={selectedVideo !== null}>
                    <View style={styles.videoPlayer}>
                        <Video style={{width: "100%", height: "100%"}} source={{ uri: selectedVideo?.uri }} resizeMode="contain" shouldPlay />
                        <TouchableOpacity style={styles.closeButton}
                                          onPress={() => setSelectedVideo(null)}>
                            <Ionicons name='close' size={40} color='white' />
                        </TouchableOpacity>
                    </View>
                </Modal>
                :
                <FlatList
                    data={videos}
                    renderItem={renderVideo}
                    numColumns={2}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.contentContainer}
                />
            }
        </View>

    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    contentContainer: {
        width: "100%",
        padding: 4,
        justifyContent: "space-around",
        alignItems: "flex-start",
    },
    videoContainer: {
        margin: 10,
        padding: 10,
        alignItems: "center"
    },
    videoThumbnail: {
        width: 120,
        height: 120,
        margin: 3,
        borderRadius: 7,
    },
    videoPlayer: {
        width: "100%",
        height: "100%",
        backgroundColor: "gray",
    },
    closeButton: {
        position: 'absolute',
        top: 20,
        left: 20,
        color: "dark",
    }

});

export default VideoPlayer;
