import React, { useState, useRef } from 'react';
import { SearchBar } from '@rneui/themed';
import { View, Text, StyleSheet, Alert } from 'react-native';
import MapView, { MapMarker } from 'react-native-maps';
import { Marker } from 'react-native-maps'
import { db } from '../db';

type SearchBarComponentProps = {};

const SwitchComponent: React.FunctionComponent<SearchBarComponentProps> = () => {
const searchBar = useRef(null);
let mapRef = useRef<MapView>(null);
let marker = useRef<MapMarker>(null);

const [search, setSearch] = useState("");
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
    marker.current?.setCoordinates({latitude: lat, longitude: long})
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
});

export default SwitchComponent;


