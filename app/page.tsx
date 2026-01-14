'use client'
import styles from "./page.module.css";
import Card from "@/components/card";
import { useGlobalState } from "@/components/appStateContext";
import { useEffect, useState } from "react";
import {  } from "@/components/engine";

import {  } from "@/components/types";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBan, faCheck } from "@fortawesome/free-solid-svg-icons";
import EmptyCell from "@/components/emptyCell";
import PopUp from "@/components/popup";

export default function Home() {
  const { appData,GetUser, GetDataFromAPI, GetMockData} = useGlobalState();
  
 
  // INIT
  useEffect(()=>{
    const abortController = new AbortController();
    if(appData.initialized) return;
    GetUser();
    GetDataFromAPI();
    //GetMockData();
    
    return () => {
        abortController.abort();
        
    }
},[])

  return (
    <div className={styles.page}>
      <main className={styles.grid}>
       {/* Flow the 18*10 grid with empty cell*/}
        {Array.from({ length: 180 }).map((_, index) => {
          // Calculate grid position based on index
          let row = Math.floor(index / 18) + 1;
          let col = (index % 18) + 1;
          return <EmptyCell key={index} id={index} gridPosition={`${row}/${col}/${row+1}/${col+1}`} />;
        })}



        
      </main>
      <div className={styles.grid}>
        {appData.elements.map((element) => (<Card key={element.id} element={element} gridPosition={element.position}></Card>))}
        
      </div>
      {appData.popUpOpen? <PopUp />:null}
      
    </div>
  );
}
