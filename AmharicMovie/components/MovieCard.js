import { Image, Pressable, Text } from 'react-native';


export default function MovieCard({ item, onPress }) {
  return (
    <Pressable
      style={{
        flex: 1,
        margin: 5,
        borderRadius: 12,
        overflow: 'hidden',
        backgroundColor: '#000000',


      }}
      onPress={() => onPress(item)}>
      <Image
        source={{ uri: item.thumbnail }}
        style={{
          width: '100%',
          height: 90,
          resizeMode: 'cover',
          borderRadius: 20
        }} />
      <Text
        style={{
          color: 'white',
          fontWeight: 'bold',
          fontSize: 14,
          padding: 6,
        }}
        numberOfLines={2}
      >{item.title}
      </Text>
    </Pressable>

  )
}