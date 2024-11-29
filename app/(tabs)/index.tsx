import React, { useState, useRef } from 'react';
import { SearchBar } from '@rneui/themed';
import { Animated, View, Text, StyleSheet, Alert, useAnimatedValue, ScrollView} from 'react-native';
import MapView, { MapMarker, AnimatedRegion, MarkerAnimated } from 'react-native-maps';
import { Marker } from 'react-native-maps'
import { db } from '../db';
import { Button } from '@rneui/base';
import { MenuProvider } from 'react-native-popup-menu';

type SearchBarComponentProps = {};

const SwitchComponent: React.FunctionComponent<SearchBarComponentProps> = () => {
const searchBar = useRef(null);

let mapRef = useRef<MapView>(null);
let restaurantInfoTab = useRef<View>(null);
let restaurantName = useRef<Text>(null);
let userInfoPanel = useRef<ScrollView>(null);
const animatedY = useAnimatedValue(100);

const [search, setSearch] = useState("");
const [restName, setRestName] = useState("Restaurant")
const [streetTxt, setStreetTxt] = useState("Street")
const [infoPanelVisible, setInfoPanelVisible] = useState('false');
const [marker] = useState<MapMarker>();
const coord = new AnimatedRegion({

})

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
    marker?.setCoordinates({latitude: lat, longitude: long});
    
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
    console.log(random);
    const usr = db.getFirstSync("select * from Users where rowid = ?;", random);
    console.log(usr);
  }
}

const updateSearch = (search: any) => {
  setSearch(search);
};

const toggleUserInfoPanel = () => {
  let opc = 'true';
  if (infoPanelVisible === 'true')
    opc = 'false';
  userInfoPanel.current?.setNativeProps({visibility: opc});
  setInfoPanelVisible(opc);
}

return (
  <MenuProvider>
  <View style={styles.view}>
    <SearchBar
      placeholder="Search..."
      onChangeText={updateSearch}
      onEndEditing={runSearch}
      value={search}
      ref={searchBar}
    />
    <MapView.Animated style={styles.map} ref={mapRef} showsCompass={true} showsScale={true}>
      <MapMarker coordinate={{latitude: 0, longitude: 0}} ref={marker}></MapMarker>
    </MapView.Animated>
    <Animated.View style={[styles.restaurantTab, {transform: [{translateY: animatedY}]}]} ref={restaurantInfoTab}>
      <View style={styles.titleText}>
          <Text ref={restaurantName} >{restName}</Text>
          <Button size='sm' style={styles.noUsersBtn} onPressOut={toggleUserInfoPanel}>1</Button>
      </View>
      <Text style={styles.streetTxt}>{streetTxt}</Text>
    </Animated.View>
    <ScrollView style={styles.userInfo} ref={userInfoPanel}>
      <Text style={styles.userInfoTitle}>Who's Here?</Text>
    </ScrollView>
  </View>
  </MenuProvider>
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
    fontFamily: 'Sans-serif',
    fontSize: 32,
    borderBottomColor: 'black',
    borderBottomWidth: 4,
    flexDirection: 'row',
    margin: 5
  },
  streetTxt: {
    marginLeft: '1%',
    fontFamily: 'Sans-serif',
    fontSize: 20
  },
  noUsersBtn: {
    marginRight: '10%'
  },
  userInfo: {
    backgroundColor: 'gray',
    position: 'absolute',
    marginLeft: '2.5%',
    width: '95%',
    height: '25%',
    visibility: 'false',
    marginTop: '100%'
  },
  userInfoTitle: {
    fontSize: 20,
    marginLeft: 5,
    borderBottomColor: 'black',
    borderBottomWidth: 1
  }
});

export default SwitchComponent;


