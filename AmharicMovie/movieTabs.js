import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

const TopTab = createMaterialTopTabNavigator();

export default function MovieTabs() {
  return (
    <TopTab.Navigator
      screenOptions={{
        tabBarActiveTintColor: 'white',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: { backgroundColor: 'black' },
        tabBarIndicatorStyle: { backgroundColor: 'purple' },
      }}
    >
      <TopTab.Screen name="All">
        {() => <MediaList type="all" />}
      </TopTab.Screen>

      <TopTab.Screen name="Movie">
        {() => <MediaList type="movie" />}
      </TopTab.Screen>

      <TopTab.Screen name="TVSeries" options={{ title: 'TV / Series' }}>
        {() => <MediaList type="tvSeries" />}
      </TopTab.Screen>


    </TopTab.Navigator>
  );
}
