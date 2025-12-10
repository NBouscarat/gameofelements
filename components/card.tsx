/**
 * Answer pannel to display if the answer is correct or not and additonnal informations
 */
import styles from "@/app/page.module.css";
import { useGlobalState } from "./appStateContext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBan, faPen, faTimes} from '@fortawesome/free-solid-svg-icons';
import { useState } from "react";
import { translation, element } from "./types";

export default function Card({ route,element,gridPosition}: { route?: string; element: element ; gridPosition?:string }) { 
  const { appData, CardToggleExpand,OpenPopUp} = useGlobalState();
  const [language, setLanguage] = useState<keyof translation>("fr");

  const HandleClick = ()=>{
      element.expanded?null:CardToggleExpand(element.id);
  }


  return (
    <div key={element.id} onClick={()=>HandleClick()} className={`${styles.gridItem} ${element.expanded?styles.expanded:null}`} style={{"gridArea": element.expanded?"2/2/10/18"
    :gridPosition }}>
      <div className={`${styles.card} ${element != null ?styles[element.color]:null}`}>
          {!element.expanded?
            <>
            <h3>{element?.symbol}</h3>
            <h4>{element?.name}</h4>
            <span className={styles.atomicNumber}>{element?.atomicNumber>0?element.atomicNumber:null}</span>
            </>
            :null}
          
          {element.expanded?
            <div className={styles.cardDetails}>
              <div className={styles.cardHeader}>
                <span className={styles.atomicNumber}>{element?.atomicNumber}</span>
                <h4>{element?.name}</h4>
                <h3>({element?.symbol})</h3>
                <div className={styles.iconBTN} onClick={()=>OpenPopUp(element,"newElement")}><FontAwesomeIcon icon={faPen} /></div>
                <div className={styles.iconBTN} onClick={()=>CardToggleExpand(element.id)}><FontAwesomeIcon icon={faTimes} /></div>
                
              </div>
              <div className={styles.cardContent}>
              <div className={styles.toggleBtn}>
                        <span className={language==="en"? styles.tglActive:styles.tglInactive} onClick={()=>setLanguage("en")}>EN</span>
                        <span className={language==="fr"? styles.tglActive:styles.tglInactive} onClick={()=>setLanguage("fr")}>FR</span>
                        <span className={language==="de"? styles.tglActive:styles.tglInactive} onClick={()=>setLanguage("de")}>DE</span>
                        <span className={language==="lu"? styles.tglActive:styles.tglInactive} onClick={()=>setLanguage("lu")}>LU</span>
                </div>
                <h5>-----------</h5>
                <p>{element?.questionEasy?.text[language]["text"]}</p>
                <p>{element?.questionEasy?.answer[language]["text"]}</p>
                <br/>
                <h5>-----------</h5>
                <p>{element?.questionHard?.text[language]["text"]}</p>
                <p>{element?.questionHard?.answer[language]["text"]}</p>
                </div>
            </div>
            :null}
      </div>
    </div>
  );
}