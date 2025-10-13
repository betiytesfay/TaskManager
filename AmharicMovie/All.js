import { useEffect, useState } from 'react';
import { Image, Pressable, Text, View } from 'react-native';

// Assume MovieItem is imported or copied
const MovieItem = ({ item, onPress }) => (
  <Pressable style={{ flexDirection: 'row', marginBottom: 10 }} onPress={() => onPress(item)}>
    <Image source={{ uri: item.thumbnail }} style={{ width: 120, height: 70 }} />
    <View style={{ flex: 1, justifyContent: 'center', marginLeft: 10 }}>
      <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>{item.title}</Text>
    </View>
  </Pressable>
);

export default function All() {
  const [activeTab, setActiveTab] = useState('inApp');
  const [filters, setFilters] = useState({ year: null, rating: null, genre: null, keyword: '' });
  const [showFilter, setShowFilter] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://192.168.1.3:3000/movies')
      .then(res => res.json())
      .then(data => {
        // Filter only TV/Series content
        const tvSeries = data.filter(m => m.type === 'tvSeries');
        setMovies(tvSeries);
        setLoading(false);
      })
      .catch(err => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  const filterMovies = list =>
    list.filter(movie => {
      if (filters.year && movie.year !== filters.year) return false;
      if (filters.rating && movie.rating < filters.rating) return false;
      if (filters.genre && !movie.genre.includes(filters.genre)) return false;
      if (filters.keyword && !movie.title.toLowerCase().includes(filters.keyword.toLowerCase())) return false;
      return true;
    });

  const openVideo = movie => setSelectedMovie(movie);
  const closeVideo = () => setSelectedMovie(null);

  if (loading) return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><Text>Loading...</Text></View>;

  const displayedMovies = filterMovies(activeTab === 'inApp' ? movies : movies.filter(m));

  return (
    <View style={{ flex: 1 }}>
      {/* You can copy your search bar, toggle buttons, FlatList, filters, WebView logic here */}
    </View>
  );
}

