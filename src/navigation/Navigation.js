import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import VideoRecorder from "../screens/VideoRecorder";
import VideoPlayer from "../screens/VideoPlayer";

const Stack = createStackNavigator();

export default function Navigation() {


    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="VideoRecorder">
                <Stack.Screen
                    name="VideoRecorder"
                    component={VideoRecorder}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="VideoPlayer"
                    component={VideoPlayer}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
