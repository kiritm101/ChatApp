import React, { useEffect } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  Image,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  TouchableHighlight,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome } from "@expo/vector-icons";
import colors from "../colors";
import { Entypo } from "@expo/vector-icons";
import {
  collection,
  addDoc,
  orderBy,
  query,
  onSnapshot,
  doc,
  getDoc,
  where,
} from "firebase/firestore";
import { signOut } from "firebase/auth";
import { auth, database } from "../config/firebase";
import { useState } from "react";
import { useLayoutEffect } from "react";
import { SHADOWS, SIZES, COLORS } from "../assets/theme.js";
import Tooltip from "react-native-walkthrough-tooltip";
const catImageUrl = require("../assets/kirit.png");

const Home = ({ renderDms }) => {
  const navigation = useNavigation();
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState();
  const [isRefreshed, setRefreshed] = useState(0);
  const [toolTipVisible, settoolTipVisible] = useState(true);
  const [toolTipVisibleSec, settoolTipVisibleSec] = useState(false);

  useEffect(() => {
    // settoolTipVisible(true)
      
    console.log("use  effect  runs "+toolTipVisible)

    navigation.setOptions({
      headerTitle: () => (
        <Text style={{ fontWeight: "bold", marginLeft: 10 }}>
          Home-Hybrid ChatApp project by Kirit M
        </Text>
      ),
      headerLeft: () => (
        <Tooltip
          displayInsets={{ top: 10, left: 0 }}
          contentStyle={{
            backgroundColor: "lightblue",
            height: 140,
            marginTop: 0,
          }}
          showChildInTooltip={false}
          useReactNativeModal={true}
          isVisible={toolTipVisible}
          content={
            <Text>
              Check this search button out!You can send private Messages now
            </Text>
          }
          placement="bottom"
          onClose={() => {
            settoolTipVisible(false);
           
             settoolTipVisibleSec(true);
            
          }}
        >
          <TouchableHighlight style={styles.touchable}>
            <Text
              
            >
              <TouchableOpacity
                onPress={(params) => {
                  navigation.navigate("DmScreen");
                }}
              >
                <FontAwesome
                  name="search"
                  size={24}
                  color={colors.blcak}
                  style={{ marginLeft: 15 }}
                />
              </TouchableOpacity>
            </Text>
          </TouchableHighlight>
        </Tooltip>
      ),
      headerRight: () => (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            width: 50,
            marginRight: 30,
            //   paddingRight:20
          }}
        >
          <TouchableOpacity
            style={{ paddingRight: 10 }}
            onPress={() => navigation.navigate("AddChatScreen")}
          >
            <FontAwesome name="pencil" size={30} color="black" />
          </TouchableOpacity>

          <Tooltip
            displayInsets={{ top: 10, left: 0 }}
            contentStyle={{
              backgroundColor: "lightblue",
              height: 140,
              marginTop: 0,
            }}
            showChildInTooltip={false}
            useReactNativeModal={true}
            isVisible={toolTipVisibleSec}
            onClose={() => {
                settoolTipVisibleSec(false) 
                }
            }
            content={
              <Text>
                Hi,I m the Admin!I will stay here as we have not implemented the the avatar storage feature yet due to billing limits😂 😂 
              </Text>
            }
            placement="bottom"
          
          >
            <TouchableHighlight style={styles.touchable}>
              <View
                
              >
                <Image
                  source={catImageUrl}
                  style={{
                    width: 40,
                    height: 40,
                    marginRight: 25,
                    borderRadius: 15,
                    paddingRight: 20,
                  }}
                />
              </View>
            </TouchableHighlight>
          </Tooltip>
        </View>
      ),
    });
    // setLoading(false)
  }, [navigation,toolTipVisible,toolTipVisibleSec]);

  useLayoutEffect(() => {
    // const unsub = onSnapshot(doc(database, "chats", "Baigan"), (doc) => {
    //     console.log("Current data: ", doc.data());

    // });
    // return unsub;
    //accepted answer1
    //     const docRef = doc(database, "chats", "3xsxSQnHAnYK3Jralqfp");
    //   return async ()=>{

    //         const docSnap = await getDoc(docRef);

    //         if (docSnap.exists()) {
    //             console.log("Document data:", docSnap.data());
    //         } else {
    //             // docSnap.data() will be undefined in this case
    //             console.log("No such document!");
    //         }
    //     }
    async function fetchData() {
      //accepted answer 2
      setLoading(true);
      const q = query(collection(database, "chats"));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const cities = [];
        renderDms != true &&
          querySnapshot.forEach((doc) => {
            doc.data().receiverId == undefined &&
              doc.data().chatName != undefined &&
              cities.push({
                id: doc.id,
                data: doc.data(),
              });
          });
        renderDms == true &&
          querySnapshot.forEach((doc) => {
            doc.data().receiverId != undefined &&
              cities.push({
                id: doc.id,
                data: doc.data(),
              });
          });
        setChats(cities);
        //  console.log("Current cities in CA:  ", cities.join(", "));
        // setChats(

        //   querySnapshot.docs.map((doc) => ({
        //     id: doc.id,
        //     data: doc.data(),
        //   }))
        // );
      });
      console.log("Debug1");
      // await unsubscribe
      setTimeout(() => {
        setLoading(false);
        console.log("Debug2");
      }, 3000);
    }

    fetchData();

    //     const collectionRef = collection(database, 'chats');
    //     const q = query(collectionRef, orderBy('createdAt', 'desc'));

    // const unsubscribe = onSnapshot(q, querySnapshot => {
    //     console.log('querySnapshot unsusbscribe');
    //       setChats(
    //         querySnapshot.docs.map(doc => ({
    //           id:doc.id,
    //           data:doc.data().text
    //         }))
    //       );
    //       console.log(chats )

    //     });
    // return unsubscribe;
  }, [navigation, isRefreshed]);

  const Item = ({ title }) => (
    <View style={styles1.item}>
      <Text style={styles1.title}>{title}</Text>
    </View>
  );

  const enterChat = (id, chatName) => {
    console.log("fcfcf" + id + chatName);
    navigation.navigate("Chat", {
      id: id,
      chatName: chatName,
    });
  };

  const renderItem = ({ item }) => (
    <View>
      <TouchableOpacity
        style={{
          flex: 1,
          gap: 15,
          marginVertical: 5,
          width: "97%",
          justifyContent: "space-between",
          alignItems: "center",
          flexDirection: "row",
          padding: SIZES.medium,
          borderRadius: SIZES.small,
          backgroundColor: "#FFF",
          ...SHADOWS.medium,
          shadowColor: COLORS.white,
        }}
        onPress={() => {
          enterChat(item.id, item.data.chatName);
        }}
      >
        <View>
          <Text
            style={{
              fontSize: SIZES.medium,

              color: COLORS.primary,
            }}
            title={item.data.chatName}
          >
            {item.data.chatName}
          </Text>
        </View>
      </TouchableOpacity>
      {/* <Text>{item.data}</Text> */}
    </View>
  );
  return loading ? (
    <ActivityIndicator size="large" color="gray" style={{ flex: 0.7 }} />
  ) : (
    <View>
      <View style={{ alignItems: "center" }}>
        <Text>Welcome {auth?.currentUser?.email}</Text>
        <Text>Public Messages</Text>
      </View>
      <FlatList
        data={chats}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl
            colors={["#9Bd35A", "#689F38"]}
            refreshing={loading}
            progressViewOffset={loading ? -200 : 0}
            onRefresh={() => {
              setRefreshed(isRefreshed + 1);
            }}
          />
        }
      />

      {/* <TouchableOpacity
        onPress={() => navigation.navigate("Chat")}
        style={styles.chatButton}
      >
        <Entypo name="chat" size={24} color={colors.lightGray} />
      </TouchableOpacity> */}
    </View>
  );
};

export default Home;
const styles1 = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 15,
    alignItems: "center",
  },
  item: {
    backgroundColor: "yellow",
    marginTop: 5,
    padding: 10,
    marginVertical: 5,
    marginHorizontal: 16,
    height: 70,
    width: 400,
  },
  title: {
    fontSize: 22,
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "flex-end",
    backgroundColor: "#fff",
  },
  chatButton: {
    textAlign: "right",
    position: "relative",
    backgroundColor: colors.primary,
    height: 50,
    width: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.9,
    shadowRadius: 8,
    marginLeft: 50,
    marginBottom: 0,
  },
});
