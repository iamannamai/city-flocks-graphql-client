import * as firebase from 'firebase'


const firebaseConfig = {
    apiKey: "AIzaSyDxd4BEyEZ1m-u8tC7ppzpTviYQZzuZL4A",
    authDomain: "city-flocks.firebaseapp.com",
    databaseURL: "https://city-flocks.firebaseio.com",
    projectId: "city-flocks",
    storageBucket: "city-flocks.appspot.com",
    messagingSenderId: "992523166640",
    appId: "1:992523166640:web:4dc7ce477957d715"
};


firebase.initializeApp(firebaseConfig)

const storage = firebase.storage();

export {
    storage, firebase as default
}
// Get a reference to the storage service, which is used to create references in your storage bucket
// var storage = firebase.storage();
// export default storage