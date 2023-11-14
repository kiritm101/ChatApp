import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  FlatList,
  Alert,
  ViewComponent,
  KeyboardAvoidingView,
} from "react-native";
import React, { useEffect, useLayoutEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { auth, database } from "../config/firebase";
import { collection, addDoc } from "firebase/firestore";
import { DatabaseReference } from "firebase/database";
// import { getAuth } from "firebase/auth";
import { query, where, getDocs } from "firebase/firestore";
import { useIsFocused } from "@react-navigation/native";
import { COLORS, SIZES, SHADOWS } from "../assets/theme";
import Home from "./Home";
import HomeForDms from "./HomeForDms";
import { ScrollView } from "react-native-gesture-handler";

const DmScreen = () => {
  //   let temp = [
  //     {
  //       id: 1,
  //       name: "nov14@outlook.com",
  //     },
  //     {
  //       id: 2,
  //       name: "nov13@outlook.com",
  //     },
  //   ];

  const navigation = useNavigation();
  const isFocussed = useIsFocused();
  const [input, setinput] = useState("");
  const [receiverId, setReceiverId] = useState("");
  const [arr, setArr] = useState([]);
  const [finalArr, setFinalArr] = useState([]);

  const createChat = async () => {
    try {
      const docRef = await addDoc(collection(database, "chats"), {
        chatName: input,
        senderId: auth?.currentUser?.email,
        receiverId: receiverId,
      });
      console.log("Document written with ID: ", docRef.id);
      navigation.navigate("DmScreen");
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  useEffect(() => {
    let temp = [];
    if (isFocussed == true) {
      navigation.setOptions({
        title: "Direct Message",
      });

      const q = query(collection(database, "users"));
      const fetchData = async (params) => {
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          // setArr([...arr, doc.data()] ) //simple value
          temp.push(doc.data());
          // console.log(doc.id, " => ", doc.data());
          // console.log(finalArr);
          // console.log(temp);
        });
      };

      fetchData();
      setArr((arr) => [...arr, temp]);
      console.log(arr);
    }
  }, []);

  const searchUserByEmail = (email) => {
    let temp2 = [];
    console.log("item");
    console.log(arr[0]);
    {
      arr[0].map((item) => {
        // console.log(item);
        (item.name + "").startsWith(email) && temp2.push(item);
      });
    }

    console.log("hi" + temp2);
    setFinalArr(temp2);
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection:"column",
        gap:10,
        width:"100%"
      }}
    >
      <Text>DmScreen</Text>
      <TextInput
        autoFocus={true}
        placeholder="Enter a name"
        value={input}
        onChangeText={(text) => {
          searchUserByEmail(text);
          setinput(text);
        }}
      ></TextInput>
      {finalArr.length != 0 && (
        <FlatList
          data={finalArr}
          renderItem={(item) => (
            <View>
              {console.log(item.item.name)}
              <TouchableOpacity
                style={{
                  flex: 1,
                  gap: 15,
                  marginVertical: 5,
                  width: "97%",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexDirection: "column",
                  padding: SIZES.medium,
                  borderRadius: SIZES.small,
                  backgroundColor: "#FFF",
                  ...SHADOWS.medium,
                  shadowColor: COLORS.white,
                }}
                onPress={() => {
                  setinput(item.item.name);
                  setReceiverId(item.item.name);
                }}
              >
                <Text
                  style={{
                    fontSize: SIZES.medium,

                    color: COLORS.primary,
                  }}
                  title={item.item.name}
                >
                  {item.item.name}
                </Text>
              </TouchableOpacity>
            </View>
          )}
          keyExtractor={(item, index) => 'key'+index}
        />
      )}
      <TouchableOpacity
        style={{
          backgroundColor: "#f57c00",
          height: 38,
          borderRadius: 10,
          justifyContent: "center",
          alignItems: "center",
          marginTop: 40,
          width: 300,
        }}
        onPress={createChat}
      >
        <Text style={{ fontWeight: "bold", color: "#fff", fontSize: 18 }}>
          Create New Chat
        </Text>
      </TouchableOpacity>

      <KeyboardAvoidingView style={{height:100}}>

      <HomeForDms user={auth?.currentUser?.email} renderDms={true}></HomeForDms>
      </KeyboardAvoidingView>
    </View>
  );
};

export default DmScreen;

const styles = StyleSheet.create({});
