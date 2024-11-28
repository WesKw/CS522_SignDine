import React, { useState, useRef } from 'react';
import { SearchBar } from '@rneui/themed';
import { Animated, View, Text, StyleSheet, Alert, useAnimatedValue} from 'react-native';
import MapView, { MapMarker } from 'react-native-maps';
import { Marker } from 'react-native-maps'
import { db } from '../db';

type SearchBarComponentProps = {};

const SwitchComponent: React.FunctionComponent<SearchBarComponentProps> = () => {
const searchBar = useRef(null);

let mapRef = useRef<MapView>(null);
let marker = useRef<MapMarker>(null);
let restaurantInfoTab = useRef<View>(null);
let restaurantName = useRef<Text>(null);
const animatedY = useAnimatedValue(100);

const [search, setSearch] = useState("");
const [restaurant, setRest] = useState("");
const [restName, setRestName] = useState("Restaurant")
const [streetTxt, setStreetTxt] = useState("Street")

let runSearch = (event: any) => {
  if (db === undefined)
    console.error("Could not load DB");
  // take the search term and find the closest match inside of the internal DB
  console.log(`Searching for ${search}`);
  const result = db.getFirstSync(`select name, street, lat, long from Restaurants where name like ?;`, search); // be careful this is dangerous
  // search the Restaurants table for a similar name
  if (result === null) { // if the result is null then show a popup to the user saying the restaurant could not be located
    Alert.alert(
      `${search} returned no results.`
    )
  } else {
    let lat = result.lat
    let long = result.long
    let name = result.name;
    let street = result.street;
    mapRef.current?.animateToRegion({
      latitude: lat, longitude: long, latitudeDelta: 0.1, longitudeDelta: 0.1
    }, 1500);
    marker.current?.setCoordinates({latitude: lat, longitude: long});
    
    // create menu showing restaurant info
    // restaurantInfoTab.current?
    setRestName(name);
    setStreetTxt(street);

    // restaurant info popup
    Animated.timing(animatedY, {
      toValue: -25,
      duration: 250,
      useNativeDriver: true,
    }).start();

    // grab random user from Users table (Just use magic numbers for prototype.)
    const totalUsers = Math.floor(Math.random() * (6 - 1) + 1);
    const random = Math.floor(Math.random() * (6 - 1) + 1);
    const usr = db.getFirstSync("select * from Users where rowid = ?;", random);
  }
}

const updateSearch = (search: any) => {
  setSearch(search);
};

return (
  <View style={styles.view}>
    <SearchBar
      placeholder="Search..."
      onChangeText={updateSearch}
      onEndEditing={runSearch}
      value={search}
      ref={searchBar}
    />
    <MapView.Animated style={styles.map} ref={mapRef} showsCompass={true} showsScale={true}>
      <Marker coordinate={{latitude: 0, longitude: 0}} ref={marker}></Marker>
    </MapView.Animated>
    <Animated.View style={[styles.restaurantTab, {transform: [{translateY: animatedY}]}]} ref={restaurantInfoTab}>
      <View style={styles.titleText}>
        <Text ref={restaurantName}>{restName}</Text>
        <Text >Nuimber</Text>
      </View>
      <Text style={styles.streetTxt}>{streetTxt}</Text>
    </Animated.View>
  </View>
);
};

const styles = StyleSheet.create({
  view: {
    margin: 10,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  restaurantTab: {
    backgroundColor: 'gray',
    marginLeft: '2.5%',
    marginTop: '165%',
    width: '95%',
    height: '10%',
    position: 'absolute',
    opacity: 0.8,
    display: 'flex'
  },
  titleText: {
    marginLeft: '1%',
    fontFamily: 'Sans-serif',
    fontSize: 28,
    borderBottomColor: 'black',
    borderBottomWidth: 4,
  },
  streetTxt: {
    marginLeft: '1%',
    fontFamily: 'Sans-serif',
    fontSize: 20
  }
});

export default SwitchComponent;


