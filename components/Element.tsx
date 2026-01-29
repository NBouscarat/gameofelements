'use client';
import styles from "@/app/page.module.css";
import { useGlobalState } from "./appStateContext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBan, faPen, faTimes} from '@fortawesome/free-solid-svg-icons';
import { useState } from "react";
import { translation, element } from "./types";
import { useRouter } from 'next/navigation'
import Image from "next/image";

export default function Element({ route,element}: { route?: string; element: element; }) { 
  const { appData, CardToggleExpand,OpenPopUp, SelectElement} = useGlobalState();
  const [language, setLanguage] = useState<keyof translation>("fr");
  const router = useRouter();
  // const _top = parseInt(element.position.split("-")[0]) + "%";
  // const _left = parseInt(element.position.split("-")[1]) + "%";
  const gridPosition = element.position;

  const HandleClick = ()=>{
    SelectElement(element.id);
    console.log("Navigating to /elements",element.id);
    router.push(`/elements`);
  }

  return (
    <div key={element.id} onClick={()=>HandleClick()} className={styles.element} style={{"gridArea": gridPosition }}>
         <Image src={`/goe/elementIcons/el${element?.symbol}.png`} className={styles.elementimage} alt={element? element.name:"Default Name"} width={128} height={128}/>
    </div>
  );
}