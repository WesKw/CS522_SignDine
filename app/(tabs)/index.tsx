// import { Text, View, StyleSheet } from "react-native";
// import React, { useState } from 'react';
// import { TextInput } from "react-native-gesture-handler";
// import { SearchBar } from '@rneui/themed';

// export default function Tab() {
//   return (
//     <View style={styles.container}>
//       <SearchBar placeholder="Search" style={{ height: 30, width: 330 }} />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   map: {
//     width: '100%',
//     height: '90%',
//   },
//   search: {
//     width: '80%',
//     height: '10%'
//   }
// });

// class Top extends React.Component {
//   SearchBarComponentProps = {};

//   const SwitchComponent: React.FunctionComponent<SearchBarComponentProps> = () => {
//   const [search, setSearch] = useState("");
  
//   const updateSearch = (search) => {
//     setSearch(search);
//   };

//   render() {
//     return (
//       <View style={styles.container}>
//         <SearchBar
//           placeholder="Search..."
//           style={styles.search}
//         />
//         
//       </View>
//     )
//   }
// }

import React, { useState } from 'react';
import { SearchBar } from '@rneui/themed';
import { View, Text, StyleSheet } from 'react-native';
import MapView from 'react-native-maps';

type SearchBarComponentProps = {};

const SwitchComponent: React.FunctionComponent<SearchBarComponentProps> = () => {
const [search, setSearch] = useState("");

const updateSearch = (search) => {
  console.log("Done")
  setSearch(search);
};

return (
  <View style={styles.view}>
    <SearchBar
      placeholder="Search..."
      onChangeText={updateSearch}
      value={search}
    />
    <MapView style={styles.map}></MapView>
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


