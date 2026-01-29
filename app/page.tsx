'use client'
import styles from "./page.module.css";
import Element from "@/components/Element";
import { useGlobalState } from "@/components/appStateContext";
import { useEffect, useState } from "react";
import {  } from "@/components/engine";

import {  } from "@/components/types";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAddressCard, faBan, faCheck } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";
import Image from "next/image";
import crypto from "crypto";

import { NextApiRequest, NextApiResponse } from "next";

export default function Home(req: NextApiRequest, res: NextApiResponse) {
  const { appData,GetUser, GetDataFromAPI, GetMockData,SwitchLanguage} = useGlobalState();
  const router = useRouter();
  
  // INIT
  useEffect(()=>{
    const abortController = new AbortController();
    if(appData.initialized) return;
    if(appData.user == null){
      if(req.method === 'GET'){
        const { IAM } = req.query;
        if (!IAM) {
          return res.status(400).json({ error: 'Missing nameId parameter' });
        }
        GetUser(IAM as string);
        GetDataFromAPI();
      }
     
    }
    //GetMockData();
    
    return () => {
        abortController.abort();
        
    }
    },[appData])

  const HandleAdminClick = (e: React.MouseEvent<HTMLDivElement>)=>{
    e.preventDefault();
    router.push(`/admin`);

  }

  return (
    <div className={styles.contentwrapper}>
      {
        appData.initialized && appData.user?.isAdmin?
        <div className={styles.adminLink}>
          <div className={`${styles.menuButton}`} onClick={(e) =>HandleAdminClick(e)}><FontAwesomeIcon icon={faAddressCard}/> ADMIN ACCESS</div>
        </div>
        : null
      }
      <div className={styles.board}>
        <span><h2>Game of Elements</h2></span>
        <div className={styles.grid}>
          {
            appData.initialized?
            appData.elements.map((elmt)=>{
              if(elmt.id === -1){
                return null;
              } else {
                return <Element key={elmt.id} element={elmt}/>;
              }
            })
            :
            <div>Loading...</div>
          }




        </div>
      </div>
      <footer className={styles.footer}>
        {/* <Image src="/goe/flag_de.png" alt="flag de" width={50} height={30} onClick={()=>SwitchLanguage("de")} />
        <Image src="/goe/flag_fr.png" alt="flag fr" width={50} height={30} onClick={()=>SwitchLanguage("fr")}/>
        <Image src="/goe/flag_en.png" alt="flag en" width={50} height={30} onClick={()=>SwitchLanguage("en")}/> */}
      </footer>
    </div>
  );
}
