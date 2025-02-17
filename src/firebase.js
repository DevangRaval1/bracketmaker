import React from "react";
import { createContext, useContext, useState } from "react";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  query,
  where,
  setDoc,
} from "firebase/firestore";
import {
  GoogleAuthProvider,
  getAuth,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  initializeAuth,
 } from "firebase/auth";

const FirebaseContext = createContext(null);

const firebaseConfig = {
  apiKey: "AIzaSyBB2RQPCd1TMInuXv-OSujET5_xr0ZDnSc",
  authDomain: "bracketmaker-abe4d.firebaseapp.com",
  projectId: "bracketmaker-abe4d",
  storageBucket: "bracketmaker-abe4d.appspot.com",
  messagingSenderId: "816514866262",
  appId: "1:816514866262:web:c93bbd3448588cd3266ff7",
  measurementId: "G-WGRK87WB89"
};

export const useFirebase = () => useContext(FirebaseContext);

const firebaseApp = initializeApp(firebaseConfig);

export const firestore = getFirestore(firebaseApp);

export const fireauth = getAuth(firebaseApp);

export const FirebaseProvider = (props) => {

  const addTournament = async (name, type, manager, numTeams) => {
    return await addDoc(collection(firestore, "Tournaments"), {
      name,
      type,
      manager,
      numTeams,
    });
  };


  const addTeam = async (name, tournament) => {
    return await addDoc(collection(firestore, "Tournaments", tournament, "Teams"), {
      name,
    });
  };

  const listPlayers = () => {
    return getDocs(collection(firestore, "Event"));
  };
  const addUser = async (name, uName, Email, Password) => {
    return await setDoc(doc(firestore, "User", Email), {
      name,
      uName,
      Email,
      Password,

    });
  };

  const addRound = async (tournament, roundNumber) => {
    return await addDoc(collection(firestore, "Tournaments", tournament, "Rounds"), {
      roundNumber,
    });
  };

  const addMatch = async (tournament, round, first, second, firstState, secondState, matchNumber) => {

    return await addDoc(collection(firestore, "Tournaments", tournament, "Rounds", round, "Matches"), {
      first,
      second,
      firstState,
      secondState,
      matchNumber,
    });
  };
  const addMatchUser = async (Email, tournament, round, first, second, firstState, secondState, matchNumber) => {

    return await addDoc(collection(firestore, "User", Email, "Tournaments", tournament, "Rounds", round, "Matches"), {
      first,
      second,
      firstState,
      secondState,
      matchNumber,
    });
  };
  const addTournamentUser = async (Email, name, type, manager, numTeams) => {
    return await setDoc(doc(firestore,"User", Email, "Tournaments", name), {
      name,
      type,
      manager,
      numTeams,
    });
  };


  const addTeamUser = async (Email, name, tournament) => {
    return await addDoc(collection(firestore, "User", Email, "Tournaments", tournament, "Teams"), {
      name,
    });
  };
  // const addTeam = async (name, tournament) => {
  //   return await addDoc(collection(firestore, "Tournaments", tournament, "Teams"), {
  //     name,
  //   });
  // };
  const addRoundUser = async (Email, tournament, roundNumber) => {
    return await addDoc(collection(firestore, "User", Email, "Tournaments", tournament, "Rounds"), {
      roundNumber,
    });
  };
  // const addRound = async (tournament, roundNumber) => {
  //   return await addDoc(collection(firestore, "Tournaments", tournament, "Rounds"), {
  //     roundNumber,
  //   });
  // };

  const signUp = async(email, password) => {
    try{
      const userCredentails = await createUserWithEmailAndPassword(fireauth, email, password);
      const user = userCredentails.user;
      return true;
    }
    catch(error){
      return {error: error.message}
    }
  };

  const logIn = async(email,password) => {
    try{
      const userCredentails = await signInWithEmailAndPassword(fireauth, email, password);
      const user = userCredentails.user;
      return true;
    }
    catch(error){
      return {error: error.message}
    }
  };

  const logOut = async() =>{
    try{
      await signOut(fireauth)
      return true;
    }
    catch (error){
      return false
    }
    };
  
  return (
    <FirebaseContext.Provider
      value={{
        addTournament,
        addTeam,
        addRound,
        addMatch,
        addUser,
        signUp,
        logIn,
        logOut,
        addRoundUser,
        addTeamUser,
        addTournamentUser,
        addMatchUser,
      }}
    >
      {props.children}
    </FirebaseContext.Provider>
  );
};
