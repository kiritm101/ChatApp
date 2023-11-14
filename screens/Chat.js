import React, {
  useState,
  useEffect,
  useLayoutEffect,
  useCallback,
} from "react";
import { TouchableOpacity, Text, View, Image, ActivityIndicator } from "react-native";
import { GiftedChat, Send } from "react-native-gifted-chat";
import {
  collection,
  addDoc,
  orderBy,
  query,
  onSnapshot,
  updateDoc,
  doc,
} from "firebase/firestore";
import { signOut } from "firebase/auth";
import { auth, database } from "../config/firebase";
import { useNavigation } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";
import colors from "../colors";
// import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
// import * as ImagePicker from 'react-native-image-picker';
import * as ImagePicker from "expo-image-picker";
import { getStorage, ref, uploadBytes, uploadString } from "firebase/storage";
import { getDownloadURL } from "firebase/storage";
import { Video,Audio } from 'expo-av';

export default function Chat({ navigation, route }) {
  const [messages, setMessages] = useState([]);
  const [jsonObj, setJsonObj] = useState([]);
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  // const navigation = useNavigation();

  const onSignOut = () => {
    signOut(auth).catch((error) => console.log("Error logging out: ", error));
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitleStyle: {
        textAlign: "center",
        display: "none",
      },
      headerTitle: () => (
        <Text
          style={{
            marginLeft: 10,
          }}
        >
          Hybrid ChatApp project by Kirit M
        </Text>
      ),
      headerRight: () => (
        <TouchableOpacity
          style={{
            marginRight: 10,
          }}
          onPress={onSignOut}
        >
          <AntDesign 
            name="logout"
            size={24}
            color="red"
            style={{ marginRight: 10 }}
          />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  useLayoutEffect(() => {
    const collectionRef = collection(
      database,
      "chats",
      route.params.id,
      "SubCollection"
    );
    const q = query(collectionRef, orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, async (querySnapshot) => {
      console.log("querySnapshot unsusbscribe");
      //  await setJsonObj(querySnapshot.docs)
      //  console.log(jsonObj)
      setMessages(
        querySnapshot.docs.map((doc) => ({
          _id: doc.data()._id,
          createdAt: doc.data().createdAt.toDate(),
          text: doc.data().text,
          user: doc.data().user,
          image: doc.data().image,
          video: doc.data().video,
          sent: doc.data().sent,
          received: doc.data().received,
          seen: doc.data().seen,
          ID: doc.id,
        }))
      );
    });

    return unsubscribe;
  }, []);
  useEffect(() => {
    console.log(imageUrl);
  }, [imageUrl]);
  const onSend = (messages = []) => {
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, messages)
    );
    // setMessages([...messages, ...messages]);
    console.log(imageUrl);
    const { _id, createdAt, text, user } = messages[0];
    // const messageRef = doc(db, "rooms", "roomA", "messages", "message1");
    addDoc(collection(database, "chats", route.params.id, "SubCollection"), {
      _id,
      createdAt,
      text,
      user,
      image: imageUrl,
      video: imageUrl,
      sent: true,
      received: true,
    });
  };
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [16, 16],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      // Create a root reference
      const storage = getStorage();

      // Create a reference to 'images/mountains.jpg'
      let a = result.assets[0].uri.lastIndexOf("/");
      const mountainImagesRef = ref(storage, result.assets[0].uri.substring(a));
      // 'file' comes from the Blob or File API
      // const metadata = {
      //   contentType: "image/jpeg",
      // };
      const response = await fetch(result.assets[0].uri);
      const blob = await response.blob();
      await uploadBytes(mountainImagesRef, blob).then((snapshot) => {
        console.log("Uploaded a blob or file!");
        // uploadImage(result.assets[0].uri,result.assets[0].uri)
      });

      // Get the download URL
      getDownloadURL(mountainImagesRef)
        .then((url) => {
          console.log(url);
          setImageUrl(url);
          console.log(imageUrl);
          // Insert url into an <img> tag to "download"
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };
  const uploadImage = async (uri, path) => {
    let URL;
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const storageRef = firebase.storage().ref();
      const upload = storageRef.child(path);
      await upload.put(blob);
      await upload.getDownloadURL().then((url) => {
        URL = url;
      });
      return URL;
    } catch (e) {
      throw e;
    }
  };
  // const openCamera = async () => {
  // const result = await launchImageLibrary({mediaType: 'photo'});
  // console.log(result);
  // if (result.didCancel && result.didCancel == true) {
  // } else {
  // setImageData(result);
  // uplaodImage(result);
  // }
  // };
  // const openCamera= async() => {
  //   // const result = await launchImageLibrary({mediaType:'photo'});
  //   let options = {
  //     mediaType: 'photo',
  //     maxWidth: 300,
  //     maxHeight: 550,
  //     quality: 1,
  //     videoQuality: 'low',
  //     durationLimit: 30, //Video max duration in seconds
  //     saveToPhotos: true,
  //     };
  //   const result = await   ImagePicker.launchCamera(options).then((result) => {

  //     // console.log(result)
  //   }).catch((err) => {
  //     console.log("Heyyyy"+err)
  //   });

  // }

  const renderSend = (props) => {
    return (
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {image && imageUrl && (
          <Image source={{ uri: image }} style={{ width: 29, height: 29 }} />
        )}
        {image && !imageUrl && (
          <ActivityIndicator size="large" color="gray" style={{ width: 29, height: 29 }} />
        )}
        <TouchableOpacity style={{ paddingRight: 10 }} onPress={pickImage}>
          <Image
            style={{ width: 24, height: 24 }}
            source={require("../assets/images.png")}
          ></Image>
        </TouchableOpacity>
        <Send {...props} containerStyle={{ justifyContent: "center" }}>
          <Image
            style={{ width: 24, height: 24, marginRight: 10 }}
            source={require("../assets/paper-planes-1.png")}
          ></Image>
        </Send>
      </View>
    );
  };
  const renderTicks = (currentMessage) => {
    // console.log(currentMessage)

    // console.log(auth?.currentUser?.email)
    console.log(currentMessage.seen);
    const tickedUser = currentMessage.user._id;

    if (tickedUser != auth?.currentUser?.email)
      updateDoc(
        doc(
          database,
          "chats",
          route.params.id,
          "SubCollection",
          currentMessage.ID
        ),
        {
          seen: true,
        }
      );
    return (
      <View>
        {!!currentMessage.sent && !!currentMessage.received && (
          <Text style={{ color: "gold", paddingRight: 10 }}>✓✓</Text>
        )}
        {!!currentMessage.seen && (
          <Text style={{ color: "gold", paddingRight: 10 }}>Seen</Text>
        )}
      </View>
    );
  };

  const renderMessageVideo = (props) => {
    const { currentMessage } = props;
    return (
      <View style={{ padding: 20 }}>
        <Video
          resizeMode="contain"
          useNativeControls
          shouldPlay={false}
          source={{ uri: currentMessage.video }}
          style={{ width: 309, height: 309 }}
        />
      </View>
    );
  };

  return (
    // <>
    //   {messages.map(message => (
    //     <Text key={message._id}>{message.text}</Text>
    //   ))}
    // </>
    <GiftedChat
      messages={messages}
      showAvatarForEveryMessage={false}
      showUserAvatar={false}
      alwaysShowSend
      placeholder="Message"
      renderSend={renderSend}
      onSend={(messages) => onSend(messages)}
      messagesContainerStyle={{
        backgroundColor: "#fff",
      }}
      textInputStyle={{
        backgroundColor: "#fff",
        borderRadius: 20,
      }}
      user={{
        _id: auth?.currentUser?.email,
        avatar: "https://i.pravatar.cc/300",
      }}
      renderTicks={renderTicks}
      renderMessageVideo={renderMessageVideo}
    />
  );
}
