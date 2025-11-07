import { View } from 'react-native';
import { Redirect } from 'expo-router';

export default function Index() {
  return (
    <View style={{ flex: 1 }}>
      <Redirect href="/(pages)/home" />
    </View>
  );
}