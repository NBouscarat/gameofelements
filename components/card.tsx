/**
 * Answer pannel to display if the answer is correct or not and additonnal informations
 */
'use client';
import styles from "@/app/page.module.css";
import { useGlobalState } from "./appStateContext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBan, faPen, faTimes} from '@fortawesome/free-solid-svg-icons';
import { useState } from "react";
import { translation, element } from "./types";
import { useRouter } from 'next/navigation'

export default function Card({ route,element,gridPosition}: { route?: string; element: element ; gridPosition?:string }) { 
  const { appData, CardToggleExpand,OpenPopUp, ReduceExpandedCards} = useGlobalState();
  const [language, setLanguage] = useState<keyof translation>("fr");
  const router = useRouter();

  const HandleClick = ()=>{
     OpenPopUp(element,"newElement");
  }

  return (
    <div key={element.id} onClick={()=>HandleClick()}>
      <div className={`${styles.card} ${element != null ?styles[element.color]:null}`}>
          {!element.expanded?
            <>
            <h3>{element?.symbol}</h3>
            <h4>{element?.name}</h4>
            <span className={styles.atomicNumber}>{element?.atomicNumber>0?element.atomicNumber:null}</span>
            </>
            :null}
          
      </div>
    </div>
  );
}