'use client'
import styles from "../page.module.css";
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


// Server Component
export default function Home() {
  const { appData, SelectElement,SwitchLanguage } = useGlobalState();


  return (
    <div className={styles.page}>
      <div className={styles.grid}>
        {appData.elements.map((element) => (<Card key={element.id} element={element} gridPosition={element.position}></Card>))}
        
      </div>
      {appData.popUpOpen? <PopUp />:null}
      
    </div>
  );
}
