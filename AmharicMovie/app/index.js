import { MaterialCommunityIcons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, Easing, FlatList, Image, Linking, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import YoutubePlayer from 'react-native-youtube-iframe';
import MovieCard from '../components/MovieCard';

// Movie item component

function MediaList({ type, keyword }) {
  const [activeTab, setActiveTab] = useState('inApp');

  const [filters, setFilters] = useState({
    year: null,
    rating: null,
    genre: null,
    keyword: '',
  });
  const [showFilter, setShowFilter] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [webviewError, setWebviewError] = useState(false);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [screenWidth, setScreenWidth] = useState(Dimensions.get('window').width);
  const [screenHeight, setScreenHeight] = useState(Dimensions.get('window').height);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [allMovies, setAllMovies] = useState([]);
  const ITEM_WIDTH = 360
  const TOTAL_WIDTH = ITEM_WIDTH * movies.length
  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window: { width, height } }) => {
      setScreenWidth(width);
      setScreenHeight(height);
    });
    return () => subscription?.remove();
  }, []);


  useEffect(() => {
    fetch('https://amharicmovie-backend.onrender.com/trending')
      .then(res => res.json())
      .then(data => {
        console.log('API response:', data); // add this to see what it returns
        const trendingMovies = Array.isArray(data)
          ? data.map(item => item.movie)  // if data is array of { movie }
          : Array.isArray(data.trending)
            ? data.trending.map(item => item.movie)
            : []; // fallback empty array
        setMovies(trendingMovies);
        setLoading(false);
      })
      .catch(err => {
        console.log('Trending fetch error:', err);
        setLoading(false);
      });
  }, []);


  useEffect(() => {
    if (!movies.length) return;
    slideAnim.setValue(0)
    const animation = Animated.timing(slideAnim, {
      toValue: -TOTAL_WIDTH,
      duration: 15000,
      easing: Easing.linear,
      useNativeDriver: true
    })
    Animated.loop(animation, {
      resetBeforeIteration: false,

    }).start();
  }, [movies]);


  const filterMovies = (moviesList) => {
    return moviesList.filter(movie => {
      if (filters.year && movie.year !== Number(filters.year)) return false;
      if (filters.rating && movie.rating < filters.rating) return false;
      if (filters.genre && !movie.genre.includes(filters.genre)) return false;
      if (keyword && !movie.title.toLowerCase().includes(keyword.toLowerCase())) return false;
      return true;
    });
  };

  const openVideo = (movie) => {
    setSelectedMovie(movie); // 
    setWebviewError(false);
  };

  const closeVideo = () => {
    setSelectedMovie(null);
  };

  const openInYouTube = async (url) => {
    try {
      const id = getVideoId(url);
      if (id) {
        const appUrl = `vnd.youtube:${id}`;
        const webUrl = `https://www.youtube.com/watch?v=${id}`;
        const supported = await Linking.canOpenURL(appUrl);
        if (supported) {
          await Linking.openURL(appUrl);
          return;
        }
        await Linking.openURL(webUrl);
        return;
      }
      await Linking.openURL(url);
    } catch (e) {
      console.log('openInYouTube error', e);
      try { await Linking.openURL(url); } catch (err) { console.log('fallback linking error', err); }
    }
  };

  const displayedMovies = filterMovies(
    movies.filter(m =>
      type === 'all' ? true :
        type === 'movie' ? m.type === 'movie' :
          type === 'tvSeries' ? m.type === 'tvSeries' : true
    ).filter(m =>
      activeTab === 'inApp' ? m.source === 'in-app' :
        activeTab === 'youtube' ? m.source === 'youtube' : true
    )
  );
  console.log('MediaList movies count:', movies && movies.length);
  console.log('displayedMovies count:', displayedMovies && displayedMovies.length);

  const [currentIndex, setCurrentIndex] = useState(0);
  const slideAnim = useRef(new Animated.Value(0)).current;

  const scale = useRef(new Animated.Value(1)).current;
  const onPressIn = () => {
    Animated.spring(scale, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start()
  }
  const onPressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true
    }).start()
  }



  return (
    <View style={{ flex: 1, backgroundColor: 'black' }}>

      {/* Tab buttons */}
      <View style={{ flexDirection: 'row' }}>
        <Pressable onPress={() => setActiveTab('inApp')} style={{ margin: 5, padding: 10, backgroundColor: activeTab === 'inApp' ? 'red' : 'black', boxSizing: 20, borderRadius: 10 }}>
          <Text style={{ color: 'white' }}>In App</Text>
        </Pressable>
        <Pressable onPress={() => setActiveTab('youtube')} style={{ margin: 5, padding: 10, backgroundColor: activeTab === 'youtube' ? 'red' : 'black', borderRadius: 10 }}>
          <Text style={{ color: 'white' }}>YouTube Only</Text>
        </Pressable>
        <Pressable onPress={() => setShowFilter(!showFilter)}
          style={{ margin: 5, padding: 10, backgroundColor: 'red', borderRadius: 10, marginLeft: 115 }}>
          <MaterialCommunityIcons name="menu" size={30} color="white" />
        </Pressable>
      </View>
      <ScrollView  >

        <Pressable
          onPressIn={onPressIn}
          onPressOut={onPressOut}
          onPress={() => movies && movies.length > 0 && openVideo(movies[currentIndex])}
        >
          <Animated.View
            style={{
              flexDirection: 'row',
              transform: [{ translateX: slideAnim }],
            }}
          >

            {movies.map((movie, i) => (
              <Image
                key={i}
                source={{ uri: movie.thumbnail }}
                style={{ width: 350, height: 160, borderRadius: 16, marginRight: 10 }}
              />
            ))}
          </Animated.View>
        </Pressable>


        {/* Movie list */}

        {showFilter && (<View style={{ backgroundColor: 'black', padding: 10 }}>
          <Text></Text>
          <Text style={{ color: 'white' }}> Year</Text>
          <Text>year</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {['2025', '2024', '2023', '2022', '2021', '2020', '2019', '2018', '2017', '2016', '2015'].map(year => (
              <Pressable
                key={year}
                onPress={() => setFilters({ ...filters, year })}
                style={{
                  padding: 10,
                  borderRadius: 10,
                  backgroundColor: filters.year === year ? 'red' : '#222',

                }}>
                <Text style={{ color: 'white' }}> {year}</Text>
              </Pressable>
            )
            )}

          </View>
          {/* Genre Filter */}
          <Text style={{ color: 'white', marginVertical: 5 }}>Genre</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {['Action', 'Romance', 'Comedy', 'Drama'].map(genre => (
              <Pressable
                key={genre}
                onPress={() => setFilters({ ...filters, genre })}
                style={{
                  padding: 10,
                  borderRadius: 8,
                  backgroundColor: filters.genre === genre ? 'red' : '#222',
                  margin: 5,
                }}
              >
                <Text style={{ color: 'white' }}>{genre}</Text>
              </Pressable>
            ))}
          </View>

          {/* Apply / Close */}
          <Pressable
            onPress={() => setShowFilter(false)}
            style={{ backgroundColor: 'red', padding: 12, borderRadius: 8, marginTop: 15 }}
          >
            <Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold' }}>Apply Filters</Text>
          </Pressable>
        </View>
        )}

        {!selectedMovie && (
          <LinearGradient colors={['#0a0a0a', '#111', '#222']} style={{ flex: 1 }}>
            <FlatList
              data={displayedMovies}

              keyExtractor={(item, index) => item._id || item.id || item.title ? (item._id || item.id || item.title) : String(index)}
              renderItem={({ item }) => item ? <MovieCard item={item} onPress={openVideo} /> : null}
              numColumns={2}
              columnWrapperStyle={{ justifyContent: 'space-between', marginBottom: 15 }}
              contentContainerStyle={{ padding: 10 }}
            />
          </LinearGradient>
        )}

        {/* Fullscreen video */}
        {selectedMovie && (
          <View
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'black',
              zIndex: 1000,
            }}
          >
            {!webviewError ? (
              <YoutubePlayer
                height={screenHeight}
                width={screenWidth}
                videoId={getVideoId(selectedMovie.url)}
                play={true}
                onError={e => {
                  console.log('YouTube player error:', e);
                  setWebviewError(true); // fallback if video blocked
                }}
                onChangeState={state => console.log('Player state:', state)}
              />

            ) : (
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
                <Text style={{ color: 'white', marginBottom: 20, textAlign: 'center' }}>Video cannot be played inside the app. You can open it in YouTube.</Text>
                <Pressable
                  onPress={() => openInYouTube(selectedMovie.url)}
                  style={{ backgroundColor: 'red', padding: 12, borderRadius: 8, marginBottom: 10 }}
                >
                  <Text style={{ color: 'white' }}>Open in YouTube</Text>
                </Pressable>
                <Pressable
                  onPress={closeVideo}
                  style={{ backgroundColor: 'red', padding: 12, borderRadius: 8 }}
                >
                  <Text style={{ color: 'white' }}>Close</Text>
                </Pressable>
              </View>
            )}

            <Pressable
              onPress={closeVideo}
              style={{
                position: 'absolute',
                top: 40,
                right: 20,
                backgroundColor: 'red',
                padding: 10,
                borderRadius: 8,
              }}
            >
              <Text style={{ color: 'white', textAlign: 'center' }}>Close</Text>
            </Pressable>
          </View>
        )}
      </ScrollView>
    </View>

  );
}

// Screens
function MusicScreen() {
  return (
    <View style={styles.container}>
      <Text>Music</Text>
    </View>
  );
}

function MeScreen() {
  return (
    <View style={styles.container}>
      <Text>Me</Text>
    </View>
  );
}

function DownloadScreen() {
  return (
    <View style={styles.container}>
      <Text>Download</Text>
    </View>
  );
}
function getEmbedUrl(url) {
  if (!url) return '';
  let videoId = null;
  try {
    if (url.includes('watch?v=')) {
      videoId = url.split('watch?v=')[1].split('&')[0];
    } else if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1].split('?')[0];
    } else if (url.includes('embed/')) {
      videoId = url.split('embed/')[1].split('?')[0];
    }
  } catch (e) {
    console.log('getEmbedUrl parse error', e);
  }
  if (!videoId) return url; // fallback
  return `https://www.youtube.com/embed/${videoId}?rel=0&controls=1&autoplay=1`;
}

function getVideoId(url) {
  if (!url) return null;
  try {
    if (url.includes('watch?v=')) return url.split('watch?v=')[1].split('&')[0];
    if (url.includes('youtu.be/')) return url.split('youtu.be/')[1].split('?')[0];
    if (url.includes('embed/')) return url.split('embed/')[1].split('?')[0];
  } catch (e) {
    console.log('getVideoId parse error', e);
  }
  return null;
}

const TopTab = createMaterialTopTabNavigator();

function MoviesTopTabs() {
  const [showSearch, setShowSearch] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'black' }}>
      {/* Header */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10, marginTop: 20 }}>
        <Pressable
          onPress={() => {
            setKeyword('');
            setShowSearch(false);
          }}>
          <Text style={{ color: 'white', fontSize: 22, fontWeight: 'bold' }}>Amflix</Text>
        </Pressable>
        <Pressable onPress={() => setShowSearch(prev => !prev)}>
          <MaterialCommunityIcons name="magnify" size={26} color="white" />
        </Pressable>

      </View>
      {showSearch && (
        <TextInput
          style={{
            height: 40,
            borderColor: 'gray',
            borderWidth: 1,
            margin: 10,
            paddingHorizontal: 8,
            borderRadius: 10,
            color: 'white',
            backgroundColor: '#222',
          }}
          placeholder="Search..."
          placeholderTextColor="lightgray"
          value={keyword}
          onChangeText={text => setKeyword(text)}
        />
      )}

      {/* Top Tabs */}
      <TopTab.Navigator
        screenOptions={{
          tabBarActiveTintColor: 'white',
          tabBarInactiveTintColor: 'gray',
          tabBarStyle: { backgroundColor: 'black' },
          tabBarIndicatorStyle: { backgroundColor: 'red' },
        }}
      >
        <TopTab.Screen name="All" options={{ title: 'All' }}>
          {() => <MediaList type="all" keyword={keyword} />}
        </TopTab.Screen>
        <TopTab.Screen name="Movie" options={{ title: 'Movie' }}>
          {() => <MediaList type="movie" keyword={keyword} />}
        </TopTab.Screen>
        <TopTab.Screen name="TVSeries" options={{ title: 'TV / Series' }}>
          {() => <MediaList type="tvSeries" keyword={keyword} />}
        </TopTab.Screen>
      </TopTab.Navigator>
    </SafeAreaView>
  );
}

// Bottom tab
const Tab = createBottomTabNavigator();
export default function App() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Movies" component={MoviesTopTabs} options={{ headerShown: false }} />
      <Tab.Screen name="Music" component={MusicScreen} />
      <Tab.Screen name="Me" component={MeScreen} />
      <Tab.Screen name="Download" component={DownloadScreen} />
    </Tab.Navigator>
  );
}
const styles = StyleSheet.create({
  thumbnail: { width: 120, height: 70 },
  title: { fontWeight: 'bold', fontSize: 16, marginBottom: 3, color: 'white' },
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  itemContainer: { flexDirection: 'row', marginBottom: 10, },
  textContainer: { flex: 1, justifyContent: 'center', marginLeft: 10 }

});
