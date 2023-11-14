import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
} from "react-native";
import React, { useLayoutEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { auth, database } from '../config/firebase';
import { collection, addDoc} from "firebase/firestore"; 
import {DatabaseReference } from "firebase/database"; 


const AddChatScreen = () => {
  const navigation = useNavigation();
  const [input, setinput] = useState("");
  const createChat =async () => {
    

    try {
      const docRef = await addDoc(collection(database, "chats"), {
        chatName: input
        
      });
      console.log("Document written with ID: ", docRef.id);
      navigation.goBack();
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Add a new Chat",
    });
  }, [navigation]);
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>AddChatScreen</Text>
      <TextInput autoFocus={true}
        placeholder="Enter a name"
        value={input}
        onChangeText={(text) => {
          setinput(text);
        }}
      ></TextInput>

      <TouchableOpacity
        style={{
          backgroundColor: "#f57c00",
          height: 38,
          borderRadius: 10,
          justifyContent: "center",
          alignItems: "center",
          marginTop: 40,
          width:300
        }}
        onPress={createChat}
      >
        <Text style={{ fontWeight: "bold", color: "#fff", fontSize: 18 }}>
          Create New Group Chat
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default AddChatScreen;

const styles = StyleSheet.create({});
