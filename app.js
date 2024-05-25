// Di file navigator Anda (misalnya App.js atau file navigator terpisah)
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './HomeScreen'; // Pastikan Anda mengimpor layar HomeScreen
import DetailPlaceScreen from './Detailplacescreen'; // Pastikan Anda mengimpor layar DetailPlaceScreen

const Stack = createStackNavigator();

function AppNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="DetailPlace" component={DetailPlaceScreen} /> {/* Tambahkan rute DetailPlace ke dalam navigator */}
    </Stack.Navigator>
  );
}

export default AppNavigator;
