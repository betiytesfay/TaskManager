import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

const index = () => {
  const router = useRouter();
  const categories = ['comedy', 'mystery', 'romance', 'drama']
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Choose categories </Text>
      {categories.map((category) => (
        <Pressable key={category} style={styles.button} onPress={() => router.push(`/category/${category}`)}>
          <Text style={styles.buttonText}>
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </Text>
        </Pressable>

      ))}
    </View>

  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    fontSize: 28,

  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 10,
    marginVertical: 10,
    alignItems: 'center'
  },
  buttonText: {
    color: '#fff',
    fontSize: 18
  }
})
export default index