'use client'
import styles from './page.module.css';
import React, { useState } from 'react';
import axios from 'axios';
import { useGlobalState } from "@/components/appStateContext";
import { useRouter } from 'next/navigation'
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faFlask, faPlus, faQuestion } from '@fortawesome/free-solid-svg-icons';
import { textTranslation } from '@/components/types';


// Server Component
export default function Home() {
  const { appData, SelectElement,SwitchLanguage } = useGlobalState();
  const router = useRouter();
  const _element = appData.elements.find(e=>e.id===appData.selectedElementId);
  const [tab,setTab] = useState<"question"|"experiment" |"form">("question");
  const [difficulty,setDifficulty] = useState("easy");
  console.log("Selected Element:", _element);
  
  const HandleGoBackHome = ()=>{
    router.push(`/`);
    SelectElement(null);
  }
  const GenerateContentClass = ()=>{
    let baseClass = styles.content;
    if(tab==="question"){
      baseClass += ` ${styles.gridQuestion}`;
    }else if(tab==="experiment"){
      baseClass += ` ${styles.gridExperiment}`;
    }else if(tab==="form"){
      baseClass += ` ${styles.gridForm}`;
    }
    return baseClass;
  }
  const GenerateContent = ()=>{
    if(tab==="question"){
      return (
        <>
          <div className={difficulty=="easy"?styles.contentTitle : styles.contentTitleAlt}>
            <span className={difficulty=="easy"?styles.active:styles.inactive} onClick={()=>setDifficulty("easy")}>{textTranslation.difficultyEasy[appData.language]}</span>
            <span className={difficulty=="hard"?styles.active:styles.inactive} onClick={()=>setDifficulty("hard")}>{textTranslation.difficultyHard[appData.language]}</span>
          </div>
          {difficulty=="easy"?
          <>
            <div className={styles.row}>
              <div>
                <h2>{textTranslation.question[appData.language]}</h2>
                <div dangerouslySetInnerHTML={{ __html: _element?.questionEasy?.text[appData.language]??"" }}></div>
              </div>
              <div>
                <h2>{textTranslation.answer[appData.language]}</h2>
                <div dangerouslySetInnerHTML={{ __html: _element?.questionEasy?.answer[appData.language]??"" }}></div>
              </div>
            </div>
            <div>
              <h2>{textTranslation.moreInformation[appData.language]}</h2>
              {_element?.questionEasy?.moreInfo ? (
                <div dangerouslySetInnerHTML={{ __html: _element.questionEasy.moreInfo[appData.language] ?? "" }}></div>
              ) : null}
            </div>
          </>
          :
          <>
            <div className={styles.row}>
              <div>
                <h2>{textTranslation.question[appData.language]}</h2>
                <div dangerouslySetInnerHTML={{ __html: _element?.questionHard?.text[appData.language]??"" }}></div>
              </div>
              <div>
                  <h2>{textTranslation.answer[appData.language]}</h2>
                <div dangerouslySetInnerHTML={{ __html: _element?.questionHard?.answer[appData.language]??"" }}></div>
              </div>
            </div>
            <div>
              <h2>{textTranslation.moreInformation[appData.language]}</h2>
              {_element?.questionHard?.moreInfo ? (
                <div dangerouslySetInnerHTML={{ __html: _element.questionHard.moreInfo[appData.language] ?? "" }}></div>
              ) : null}
            </div>
          </>
          }
          
          
        </>
      );
    }else if(tab==="experiment"){
      return (
        <>
        <div className={styles.contentTitle}><span>{textTranslation.experiment[appData.language]}</span></div>
        <div className={styles.row}>
          <div>
            <h2>{textTranslation.experimentSetup[appData.language]}</h2>
            <div dangerouslySetInnerHTML={{ __html: _element?.experiment?.question[appData.language] ?? "No experiment available" }}></div>
          </div>
          <div>
            <h2>{textTranslation.experimentExplanation[appData.language]}</h2>
            <div dangerouslySetInnerHTML={{ __html: _element?.experiment?.answer[appData.language] ?? "No experiment available" }}></div>
          </div>
        </div>
        <div>
        <h2>{textTranslation.moreInformation[appData.language]}</h2>
              {_element?.experiment?.moreInfo ? (
                <div dangerouslySetInnerHTML={{ __html: _element.experiment?.moreInfo[appData.language] ?? "" }}></div>
              ) : null}
        </div>
        </>
      );
    }else if(tab==="form"){
      return (
        <>
          <div className={styles.contentTitle}><span>Forms</span></div>
          <form>
            <label>{textTranslation.question[appData.language]}:</label>
            <input type="text" name="question" />
            <label>{textTranslation.answer[appData.language]}:</label>
            <input type="text" name="answer" />
            <button type="submit">Speichern</button>
          </form>
        </>
      );
    }
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <button className={styles.homeButton} onClick={() =>HandleGoBackHome()}><FontAwesomeIcon icon={faArrowLeft}/></button>
          <Image src={`/goe/elementIcons/el${_element?.symbol}.png`} alt={_element? _element.name:"Default Name"} width={50} height={50} />
          <h1>{_element? _element.name:"Default Name"}</h1>
        </div>
        <div>
          <button className={styles.menuButtonDisabled} title='Comming soon!' /* onClick={() =>setTab("form")} */><FontAwesomeIcon icon={faPlus}/> {textTranslation.ownQuestion[appData.language]}</button>
        </div>
      </header>
      <main className={styles.main}>
        <div className={GenerateContentClass()}>
          {GenerateContent()}
        </div>
        <div>
          {(tab==="question" || tab ==="form") && _element?.experiment !== null? 
          <button className={`${styles.menuButton} ${styles[_element?.color ?? "color1"]} ${_element?.experiment ? null : styles.disabled}`} onClick={() => setTab("experiment")}><FontAwesomeIcon icon={faFlask}/> {textTranslation.experiment[appData.language]}</button> : null
          }
          {tab==="experiment" ? 
          <button className={`${styles.menuButton}`} onClick={() =>setTab("question")}><FontAwesomeIcon icon={faQuestion}/> {textTranslation.question[appData.language]}</button> : null
          }
        </div>
      </main>
      <footer className={styles.footer}>
        <Image src="/goe/flag_de.png" alt="flag de" width={50} height={30} onClick={()=>SwitchLanguage("de")}/>
        <Image src="/goe/flag_fr.png" alt="flag fr" width={50} height={30} onClick={()=>SwitchLanguage("fr")}/>
        <Image src="/goe/flag_en.png" alt="flag en" width={50} height={30} onClick={()=>SwitchLanguage("en")}/>
      </footer>
    </div>
  );
}
