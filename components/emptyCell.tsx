/**
 * Answer pannel to display if the answer is correct or not and additonnal informations
 */
import styles from "@/app/page.module.css";
import { useGlobalState } from "./appStateContext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBan} from '@fortawesome/free-solid-svg-icons';
import { useState } from "react";
import { element } from "./types";

export default function EmptyCell({gridPosition,id}: { gridPosition:string ; id?:number }) { 
  const { appData,OpenPopUp,ReduceExpandedCards} = useGlobalState();
  const _newElement:element = {
    id: appData.elements.length+1,
    position:`${gridPosition}`,
    name: "",
    symbol: "",
    atomicNumber:1,
    color: "color7",
    questionEasy: null,
    questionHard: null,
    expanded:false,
  };

  const HandleClick = ()=>{
      appData.cardExpanded?ReduceExpandedCards():OpenPopUp(_newElement,"newElement");
  }


  return (
    <div key={id} onClick={()=>HandleClick()} className={styles.emptyCell} style={{ "gridArea": gridPosition }}> 
     
    </div>
  );
}