import { View } from 'react-native';
import { Redirect } from 'expo-router';
import { useSession } from '@/context/AuthContext';

export default function Index() {
  const { isAuthenticated, isLoading } = useSession();

  if (isLoading) {
    return <View style={{ flex: 1 }} />;
  }

  return (
    <View style={{ flex: 1 }}>
      <Redirect href={isAuthenticated ? "/home" : "/sign-in"} />
    </View>
  );
}