import { View } from 'react-native';
import { Redirect } from 'expo-router';
import Sidebar from '../components/sidebar';

export default function Index() {
  return (
    <View style={{ flex: 1, flexDirection: 'row', padding: 0 }}>
      <Sidebar />
      <View style={{ flex: 1 }}>
        <Redirect href="/(pages)/home" />
      </View>
    </View>
  );
}