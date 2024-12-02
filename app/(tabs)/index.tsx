import React, { useState, useRef } from 'react';
import { SearchBar } from '@rneui/themed';
import { Animated, View, Text, StyleSheet, Alert, useAnimatedValue, ScrollView} from 'react-native';
import MapView, { MapMarker, AnimatedRegion, MarkerAnimated, LatLng } from 'react-native-maps';
import { Marker } from 'react-native-maps'
import { db } from '../db';
import { Button, Icon } from '@rneui/base';
import { MenuProvider } from 'react-native-popup-menu';
import {  } from '@primer/octicons-react'

type SearchBarComponentProps = {};

const SwitchComponent: React.FunctionComponent<SearchBarComponentProps> = () => {
const searchBar = useRef(null);

let mapRef = useRef<MapView>(null);
let restaurantInfoTab = useRef<View>(null);
let restaurantName = useRef<Text>(null);
let userInfoPanel = useRef<ScrollView>(null);
const animatedY = useAnimatedValue(100);
const userInfoY = useAnimatedValue(400);

const [search, setSearch] = useState("");
const [restName, setRestName] = useState("Restaurant")
const [userInfoText, setUsrInfoText] = useState("Who's Here?")
const [streetTxt, setStreetTxt] = useState("Street")
const [infoPanelVisible, setInfoPanelVisible] = useState('false');
const [marker] = useState<MapMarker>();
const [currentInfoY, setCurrentInfoY] = useState(-25);
const [numberOfPeople, setNumberOfPeople] = useState("0");
const [averageScore, setAverageScope] = useState("0")
const [coord, setCoord] = useState({latitude: 0, longitude: 0});

let runSearch = (event: any) => {
  if (db === undefined)
    console.error("Could not load DB");

  // take the search term and find the closest match inside of the internal DB
  console.log(`Searching for ${search}`);
  const result = db.getFirstSync(`select rowid, name, street, lat, long from Restaurants where name like ?;`, search); // be careful this is dangerous
  // search the Restaurants table for a similar name
  if (result === null) { // if the result is null then show a popup to the user saying the restaurant could not be located
    Alert.alert(`${search} returned no results.`)
  } else {
    let lat = result.lat
    let long = result.long
    let name = result.name;
    let street = result.street;
    mapRef.current?.animateToRegion({
      latitude: lat, longitude: long, latitudeDelta: 0.1, longitudeDelta: 0.1
    }, 1500);
    setCoord({latitude: lat, longitude: long});
   
    // update the review portion (use sync for now)
    let restaurantId = result.rowid;
    let reviews = db.getFirstSync("select avg(overall) as average from Reviews where restaurant_id = ?;", restaurantId)
    let avgScore = reviews.average;
    
    // create menu showing restaurant info
    // restaurantInfoTab.current?
    setRestName(name); // yes I am that lazy --- Wesley
    setAverageScope(`${avgScore}⭐`)
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
    const users = new Set();
    for (let i = 1; i < 7; i++) {
      users.add(Math.floor(Math.random() * (6-1) + 1));
    }
    setNumberOfPeople(String(users.size));
    let infoText = "";
    users.forEach(l => {
      const usr = db.getFirstSync("select * from Users where rowid = ?;", l);
      const name = usr.last + ", " + usr.first;
      const age = usr.age;
      const profession = usr.profession;
      infoText += `${name}, ${age} --- ${profession}\n`
    })
    setUsrInfoText(infoText);
  }
}

const updateSearch = (search: any) => {
  setSearch(search);
};

const toggleUserInfoPanel = () => {
  let next = 0;
  if (currentInfoY == -25)
    next = 400;
  else 
    next = -25;
  setCurrentInfoY(next);

  Animated.timing(userInfoY, {
    toValue: currentInfoY,
    duration: 250,
    useNativeDriver: true,
  }).start();
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
      <MapMarker coordinate={coord}></MapMarker>
    </MapView.Animated>
    <Animated.ScrollView style={[styles.userInfo, {transform: [{translateY: userInfoY}]}]} ref={userInfoPanel}>
      <Text style={styles.userInfoTitle}>Who's here?</Text>
      <Text style={styles.userInfoData}>{userInfoText}</Text>
    </Animated.ScrollView>
    <Animated.View style={[styles.restaurantTab, {transform: [{translateY: animatedY}]}]} ref={restaurantInfoTab}>
      <View style={styles.titleText}>
          <Text ref={restaurantName} style={styles.restaurantNameStyle}>{restName}</Text>
          <View style={styles.spacing} />
          <Button size='sm' style={styles.reviewPageBtn}>
            {averageScore}
          </Button>
          <View style={styles.spacing} />
          <Button size='sm' style={styles.noUsersBtn} onPressOut={toggleUserInfoPanel} type="solid" color="green">
            {numberOfPeople}
            <Icon name="group" reverse={false}></Icon>
          </Button>
      </View>
      <Text style={styles.streetTxt}>{streetTxt}</Text>
    </Animated.View>
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
    margin: 5,
    textAlign: 'center',
  },
  streetTxt: {
    marginLeft: '1%',
    fontFamily: 'Sans-serif',
    fontSize: 20
  },
  noUsersBtn: {
    marginRight: '30%'
  },
  userInfo: {
    backgroundColor: 'gray',
    position: 'absolute',
    marginLeft: '2.5%',
    width: '95%',
    height: '25%',
    visibility: 'false',
    marginTop: '100%',
    opacity: 0.9
  },
  userInfoTitle: {
    fontSize: 20,
    marginLeft: 5,
    borderBottomColor: 'black',
    borderBottomWidth: 1
  },
  userInfoData: {
    fontSize: 16,
    marginLeft: 5
  },
  reviewPageBtn: {

  },
  restaurantNameStyle: {
    fontSize: 24
  },
  spacing: {
    width: 70
  }
});

export default SwitchComponent;


