// Example: /category/comedy.js

import { StyleSheet, Text, View } from 'react-native';

const Mystry = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Comedy Category</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 22, fontWeight: 'bold' },
});

export default Mystry;
