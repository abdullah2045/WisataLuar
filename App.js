import React, {
  useState,
  createContext,
  useContext,
  useEffect,
  useRef,
} from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  FlatList,
  Dimensions,
  StyleSheet,
  Animated,
  SafeAreaView,
  Platform,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "@expo/vector-icons/Ionicons";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 44) / 2;

// ======= 1. STATE MANAGEMENT (CONTEXT) =======
const TravelContext = createContext();

// Syarat: 10 Destinasi BARU dengan id, name, location, price, image yang dijamin muncul
const travelData = [
  {
    id: "1",
    name: "Cappadocia",
    location: "Turki",
    price: "₺ 2.500",
    description:
      "Nikmati pengalaman magis terbang menggunakan balon udara di atas lanskap bebatuan unik berbentuk cerobong peri.",
    rating: "4.9",
    image:
      "https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&w=500&q=60",
  },
  {
    id: "2",
    name: "Machu Picchu",
    location: "Peru",
    price: "S/ 150",
    description:
      "Situs bersejarah suku Inca yang menakjubkan, terletak tinggi di atas Pegunungan Andes dengan pemandangan awan yang dramatis.",
    rating: "4.8",
    image:
      "https://images.unsplash.com/photo-1587595431973-160d0d94add1?auto=format&fit=crop&w=500&q=60",
  },
  {
    id: "3",
    name: "Colosseum",
    location: "Roma, Italia",
    price: "€ 16",
    description:
      "Amfiteater kuno terbesar di dunia, tempat para gladiator bertarung. Simbol abadi dari kekaisaran Romawi.",
    rating: "4.7",
    image:
      "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=500&q=60",
  },
  {
    id: "4",
    name: "Tembok Besar",
    location: "Beijing, China",
    price: "¥ 40",
    description:
      "Keajaiban dunia arsitektur raksasa yang membentang ribuan kilometer melintasi pegunungan dan hutan yang indah.",
    rating: "4.8",
    image:
      "https://images.unsplash.com/photo-1508804185872-d7bad8000454?auto=format&fit=crop&w=500&q=60",
  },
  {
    id: "5",
    name: "Taj Mahal",
    location: "Agra, India",
    price: "₹ 1.100",
    description:
      "Mausoleum marmer putih gading yang dibangun sebagai simbol cinta abadi, sangat indah saat matahari terbit.",
    rating: "4.9",
    image:
      "https://images.unsplash.com/photo-1564507592208-02df560db60c?auto=format&fit=crop&w=500&q=60",
  },
  {
    id: "6",
    name: "Grand Canyon",
    location: "Arizona, USA",
    price: "$ 35",
    description:
      "Ngarai raksasa dengan lapisan batuan merah yang memukau, menawarkan pemandangan matahari terbenam terbaik di Amerika.",
    rating: "4.9",
    image:
      "https://images.unsplash.com/photo-1615729947596-a598e5de0ab3?auto=format&fit=crop&w=500&q=60",
  },
  {
    id: "7",
    name: "Piramida Giza",
    location: "Kairo, Mesir",
    price: "E£ 200",
    description:
      "Satu-satunya keajaiban dunia kuno yang masih berdiri kokoh hingga hari ini, dijaga oleh patung Sphinx yang misterius.",
    rating: "4.6",
    image:
      "https://images.unsplash.com/photo-1539650116574-8efeb43e2b50?auto=format&fit=crop&w=500&q=60",
  },
  {
    id: "8",
    name: "Victoria Falls",
    location: "Zambia & Zimbabwe",
    price: "$ 30",
    description:
      'Air terjun raksasa yang sangat spektakuler, dikenal dengan sebutan "Asap yang Menggelegar" karena debit airnya yang masif.',
    rating: "4.8",
    image:
      "https://images.unsplash.com/photo-1603228254119-e6a4d081f427?auto=format&fit=crop&w=500&q=60",
  },
  {
    id: "9",
    name: "Sydney Opera",
    location: "Sydney, Australia",
    price: "$ 42",
    description:
      "Gedung pertunjukan seni dengan arsitektur berbentuk cangkang yang ikonik, terletak di tepi pelabuhan Sydney yang biru.",
    rating: "4.7",
    image:
      "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=500&q=60",
  },
  {
    id: "10",
    name: "Gunung Fuji",
    location: "Tokyo, Jepang",
    price: "¥ 0 (Free)",
    description:
      "Gunung berapi suci dengan puncak bersalju yang sangat estetik, terutama saat musim bunga sakura mekar di musim semi.",
    rating: "4.9",
    image:
      "https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?auto=format&fit=crop&w=500&q=60",
  },
];

export function TravelProvider({ children }) {
  const [favorites, setFavorites] = useState([]);

  const toggleFavorite = (id) => {
    if (favorites.includes(id)) {
      setFavorites(favorites.filter((favId) => favId !== id));
    } else {
      setFavorites([...favorites, id]);
    }
  };

  return (
    <TravelContext.Provider
      value={{ destinations: travelData, favorites, toggleFavorite }}
    >
      {children}
    </TravelContext.Provider>
  );
}

// ======= 2. ANIMASI BACKGROUND =======
function GreenShimmerBackground() {
  const moveAnim = useRef(new Animated.Value(-1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(moveAnim, {
        toValue: 1,
        duration: 4000,
        useNativeDriver: true,
      }),
    ).start();
  }, [moveAnim]);

  const translateX = moveAnim.interpolate({
    inputRange: [-1, 1],
    outputRange: [-width, width * 1.5],
  });

  return (
    <View style={StyleSheet.absoluteFillObject}>
      <View style={{ flex: 1, backgroundColor: "#f0fdf4" }} />
      <Animated.View
        style={[
          styles.shimmerFlash,
          { transform: [{ translateX }, { skewX: "-30deg" }] },
        ]}
      />
    </View>
  );
}

// ======= 3. KOMPONEN KARTU WISATA =======
function TravelCard({ item, navigation }) {
  const { favorites, toggleFavorite } = useContext(TravelContext);
  const isFav = favorites.includes(item.id);

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.8}
      onPress={() => navigation.navigate("Detail", { destination: item })}
    >
      <Image source={{ uri: item.image }} style={styles.cardImage} />
      <TouchableOpacity
        style={styles.heartBtn}
        onPress={() => toggleFavorite(item.id)}
      >
        <Ionicons
          name={isFav ? "heart" : "heart-outline"}
          size={22}
          color={isFav ? "#ff4757" : "#fff"}
        />
      </TouchableOpacity>
      <View style={styles.cardContent}>
        <Text style={styles.cardLocation} numberOfLines={1}>
          {item.location}
        </Text>
        <Text style={styles.cardTitle} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.cardPrice}>{item.price}</Text>
      </View>
    </TouchableOpacity>
  );
}

// ======= 4. HALAMAN APLIKASI =======
function HomeScreen({ navigation }) {
  const { destinations } = useContext(TravelContext);

  return (
    <SafeAreaView style={styles.screen}>
      <GreenShimmerBackground />
      <View style={styles.headerBox}>
        <Text style={styles.headerTitle}>Destinations</Text>
        <Text style={styles.headerSubtitle}>
          Temukan perjalanan impianmu ✈️
        </Text>
      </View>
      <FlatList
        data={destinations}
        renderItem={({ item }) => (
          <TravelCard item={item} navigation={navigation} />
        )}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.gridRow}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={
          <View style={styles.creditFooter}>
            <Text style={styles.creditText}>
              M Abdul Nizham N • 243303621284
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

function DetailScreen({ route, navigation }) {
  const { destination } = route.params;
  const { favorites, toggleFavorite } = useContext(TravelContext);
  const isFav = favorites.includes(destination.id);

  return (
    <View style={styles.screen}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <Image source={{ uri: destination.image }} style={styles.detailImage} />

        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={26} color="#fff" />
        </TouchableOpacity>

        <View style={styles.detailSheet}>
          <View style={styles.detailRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.detailLoc}>{destination.location}</Text>
              <Text style={styles.detailName}>{destination.name}</Text>
            </View>
            <TouchableOpacity
              onPress={() => toggleFavorite(destination.id)}
              style={styles.detailFavBtn}
            >
              <Ionicons
                name={isFav ? "heart" : "heart-outline"}
                size={28}
                color={isFav ? "#ff4757" : "#00b894"}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.priceRow}>
            <Ionicons name="pricetag" size={18} color="#00b894" />
            <Text style={styles.detailPriceText}>
              {" "}
              Estimasi Biaya: {destination.price}
            </Text>
          </View>

          <View style={styles.detailRatingBox}>
            <Ionicons name="star" size={18} color="#f1c40f" />
            <Text style={styles.detailRatingText}>
              {" "}
              {destination.rating} Rating Wisatawan
            </Text>
          </View>

          <Text style={styles.detailDescTitle}>Deskripsi</Text>
          <Text style={styles.detailDescText}>{destination.description}</Text>
        </View>
      </ScrollView>
    </View>
  );
}

function SearchScreen({ navigation }) {
  const { destinations } = useContext(TravelContext);
  const [searchText, setSearchText] = useState("");

  const searchResults = destinations.filter((item) => {
    return (
      item.name.toLowerCase().includes(searchText.toLowerCase()) ||
      item.location.toLowerCase().includes(searchText.toLowerCase())
    );
  });

  return (
    <SafeAreaView style={styles.screen}>
      <GreenShimmerBackground />
      <View style={styles.headerBox}>
        <Text style={styles.headerTitle}>Pencarian 🔍</Text>
      </View>
      <View style={styles.searchBar}>
        <Ionicons name="search" size={22} color="#00b894" />
        <TextInput
          style={styles.searchInput}
          placeholder="Cari destinasi wisata..."
          placeholderTextColor="#7f8c8d"
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>
      {searchText === "" ? (
        <View style={styles.emptyBox}>
          <Ionicons name="earth-outline" size={70} color="#a8dfce" />
          <Text style={styles.emptyText}>
            Mulai ketik nama destinasi impianmu!
          </Text>
        </View>
      ) : (
        <FlatList
          data={searchResults}
          renderItem={({ item }) => (
            <TravelCard item={item} navigation={navigation} />
          )}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.gridRow}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyBox}>
              <Ionicons name="sad-outline" size={60} color="#ff7675" />
              <Text style={styles.emptyText}>Destinasi tidak ditemukan.</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

function FavoritesScreen({ navigation }) {
  const { destinations, favorites } = useContext(TravelContext);
  const favItems = destinations.filter((d) => favorites.includes(d.id));

  return (
    <SafeAreaView style={styles.screen}>
      <GreenShimmerBackground />
      <View style={styles.headerBox}>
        <Text style={styles.headerTitle}>Favoritku ❤️</Text>
      </View>
      {favItems.length === 0 ? (
        <View style={styles.emptyBox}>
          <Ionicons name="heart-half-outline" size={70} color="#a8dfce" />
          <Text style={styles.emptyText}>
            Belum ada destinasi favorit. Tambahkan dari halaman utama!
          </Text>
        </View>
      ) : (
        <FlatList
          data={favItems}
          renderItem={({ item }) => (
            <TravelCard item={item} navigation={navigation} />
          )}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.gridRow}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

// ======= 5. PENGATURAN NAVIGASI =======
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const HomeStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="HomeScreen" component={HomeScreen} />
    <Stack.Screen name="Detail" component={DetailScreen} />
  </Stack.Navigator>
);

const SearchStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="SearchScreen" component={SearchScreen} />
    <Stack.Screen name="Detail" component={DetailScreen} />
  </Stack.Navigator>
);

const FavStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="FavScreen" component={FavoritesScreen} />
    <Stack.Screen name="Detail" component={DetailScreen} />
  </Stack.Navigator>
);

function TabNavigator() {
  const { favorites } = useContext(TravelContext);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === "Home") iconName = "home";
          if (route.name === "Search") iconName = "search";
          if (route.name === "Favorites") iconName = "heart";
          return <Ionicons name={iconName} size={size + 2} color={color} />;
        },
        tabBarActiveTintColor: "#00b894",
        tabBarInactiveTintColor: "#b2bec3",
        tabBarStyle: {
          backgroundColor: "#fff",
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          // FIX: Tab dinaikkan agar tidak bertabrakan dengan tombol Android
          height: Platform.OS === "ios" ? 85 : 75,
          paddingBottom: Platform.OS === "ios" ? 25 : 15,
          paddingTop: 8,
          position: "absolute",
          elevation: 10,
          borderTopWidth: 0,
        },
        tabBarLabelStyle: { fontWeight: "bold", fontSize: 12, marginTop: 2 },
      })}
    >
      <Tab.Screen name="Home" component={HomeStack} />
      <Tab.Screen name="Search" component={SearchStack} />
      <Tab.Screen
        name="Favorites"
        component={FavStack}
        options={{
          tabBarBadge: favorites.length > 0 ? favorites.length : null,
        }}
      />
    </Tab.Navigator>
  );
}

// ======= 6. MAIN APP =======
export default function App() {
  return (
    <TravelProvider>
      <NavigationContainer>
        <TabNavigator />
      </NavigationContainer>
    </TravelProvider>
  );
}

// ======= 7. STYLING =======
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#f0fdf4" },
  shimmerFlash: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: width * 0.5,
    backgroundColor: "rgba(0, 184, 148, 0.1)",
  },
  headerBox: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "android" ? 40 : 20,
    paddingBottom: 15,
  },
  headerTitle: { fontSize: 30, fontWeight: "bold", color: "#2d3436" },
  headerSubtitle: {
    fontSize: 16,
    color: "#00b894",
    fontWeight: "600",
    marginTop: 5,
  },
  // FIX: Jarak bawah konten list diperbesar agar tidak tertutup menu tab yang sudah dinaikkan
  listContainer: { paddingHorizontal: 16, paddingBottom: 120 },
  gridRow: { justifyContent: "space-between", marginBottom: 16 },
  card: {
    width: CARD_WIDTH,
    backgroundColor: "#fff",
    borderRadius: 20,
    overflow: "hidden",
    elevation: 4,
    shadowColor: "#00b894",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  cardImage: { width: "100%", height: CARD_WIDTH * 1.1 },
  heartBtn: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(0,0,0,0.4)",
    padding: 8,
    borderRadius: 20,
  },
  cardContent: { padding: 14 },
  cardLocation: {
    fontSize: 11,
    color: "#00b894",
    fontWeight: "800",
    textTransform: "uppercase",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2d3436",
    marginTop: 4,
    marginBottom: 6,
  },
  cardPrice: { fontSize: 13, fontWeight: "700", color: "#636e72" },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginBottom: 20,
    paddingHorizontal: 15,
    height: 52,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#d1fae5",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
  },
  searchInput: { flex: 1, marginLeft: 10, fontSize: 15, color: "#2d3436" },
  emptyBox: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 60,
    paddingHorizontal: 30,
  },
  emptyText: {
    fontSize: 15,
    color: "#636e72",
    textAlign: "center",
    marginTop: 15,
    lineHeight: 22,
  },
  detailImage: { width: "100%", height: width * 1 },
  backBtn: {
    position: "absolute",
    top: Platform.OS === "android" ? 40 : 50,
    left: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 12,
    borderRadius: 30,
  },
  detailSheet: {
    backgroundColor: "#fff",
    marginTop: -40,
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    padding: 25,
    minHeight: width,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  detailLoc: {
    fontSize: 13,
    color: "#00b894",
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  detailName: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2d3436",
    marginTop: 5,
  },
  detailFavBtn: { backgroundColor: "#f0fdf4", padding: 12, borderRadius: 30 },
  priceRow: { flexDirection: "row", alignItems: "center", marginTop: 15 },
  detailPriceText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2d3436",
    marginLeft: 5,
  },
  detailRatingBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff9c4",
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginTop: 15,
  },
  detailRatingText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#f39c12",
    marginLeft: 5,
  },
  detailDescTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2d3436",
    marginTop: 25,
    marginBottom: 10,
  },
  detailDescText: { fontSize: 15, color: "#636e72", lineHeight: 26 },
  creditFooter: { alignItems: "center", marginTop: 10, marginBottom: 20 },
  creditText: { fontSize: 12, color: "#b2bec3", fontWeight: "bold" },
});
