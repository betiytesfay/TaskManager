import { useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

const Category = () => {
  const { name } = useLocalSearchParams();
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{name.charAt(0).toUpperCase() + name.slice(1)} Movies</Text>
    </View>
  )
}

export default Category

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#000',
    fontSize: 24,
  }
})