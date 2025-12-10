/**
 * Answer pannel to display if the answer is correct or not and additonnal informations
 */
import styles from "@/app/page.module.css";
import { useGlobalState } from "./appStateContext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBan} from '@fortawesome/free-solid-svg-icons';
import { useState } from "react";
import { element } from "./types";
import { symlink } from "fs";

export default function PopUp({}: { }) { 
  const { appData,ClosePopUp,SaveElement} = useGlobalState();
  const InitPopUpElement = ()=>{
        if(appData.popUpElement){
            return appData.popUpElement;
        }else{
            return {
                id: appData.elements.length+1,
                position: appData.popUpPosition,
                name: "",
                symbol: "",
                atomicNumber:1,
                color: "color7",
                questionEasy: null,
                questionHard: null,
            } as element;
        }
      }
  const [tmpElement,setElement] = useState(InitPopUpElement());
  const [difficulty,setDifficulty]=useState("EASY");
  type Translation = "en" | "fr" | "de" | "lu";
  const [language,setLanguage]=useState<Translation>("en");



  const HandleChangeName = (name:string) =>{
    setElement({
        ...tmpElement,
        name: name
    });
  }
  const HandleChangeSymbol = (symbol:string) =>{
    setElement({
        ...tmpElement,
        symbol: symbol
    });
  }
    const HandleChangeAtomic = (atomicNumber:number) =>{
        setElement({
            ...tmpElement,
            atomicNumber: atomicNumber
        });
    }
    const HandleChangeColor = (color:string) =>{
        setElement({
            ...tmpElement,
            color: color
        });
    }

    const GetValueQuestion = () =>{
        if(difficulty==="EASY"){
            return tmpElement.questionEasy? tmpElement.questionEasy.text[language]["text"] : "";
        }else{
            return tmpElement.questionHard? tmpElement.questionHard.text[language]["text"] : "";
        }
    }

    const GetValueAnswer = () =>{
        if(difficulty==="EASY"){
            return tmpElement.questionEasy? tmpElement.questionEasy.answer[language]["text"] : "";
        }else{
            return tmpElement.questionHard? tmpElement.questionHard.answer[language]["text"] : "";
        }
    }

    const HandleUpdateQuestion = (e:string) =>{
        var _element = {...tmpElement};
        if(difficulty==="EASY"){
            _element.questionEasy = _element.questionEasy? _element.questionEasy : {
                id: 0,
                element_id: _element.id,
                text: {"de":{text:"",id:0},"en":{text:"",id:0},"fr":{text:"",id:0},"lu":{text:"",id:0}},
                difficulty: 'easy',
                answer: {"de":{text:"",id:0},"en":{text:"",id:0},"fr":{text:"",id:0},"lu":{text:"",id:0}},
            };
            if (_element.questionEasy && language.toLowerCase() in _element.questionEasy.text) {
                _element.questionEasy.text[language]["text"] = e;
            }
        }
        else{
            _element.questionHard = _element.questionHard? _element.questionHard : {
                id: 0,
                element_id: _element.id,
                text: {"de":{text:"",id:0},"en":{text:"",id:0},"fr":{text:"",id:0},"lu":{text:"",id:0}},
                difficulty: 'hard',
                answer: {"de":{text:"",id:0},"en":{text:"",id:0},"fr":{text:"",id:0},"lu":{text:"",id:0}},
            };
            if (_element.questionHard && language.toLowerCase() in _element.questionHard.text) {
                _element.questionHard.text[language]["text"] = e;
            }
        }
        setElement(_element);
    }

    const HandleUpdateAnswer = (e:string) =>{
        var _element = {...tmpElement};
        if(difficulty==="EASY"){
            _element.questionEasy = _element.questionEasy? _element.questionEasy : {
                id: 0,
                element_id: _element.id,
                text:  {"de":{text:"",id:0},"en":{text:"",id:0},"fr":{text:"",id:0},"lu":{text:"",id:0}},
                difficulty: 'easy',
                answer: {"de":{text:"",id:0},"en":{text:"",id:0},"fr":{text:"",id:0},"lu":{text:"",id:0}},
            };
            if (_element.questionEasy && language.toLowerCase() in _element.questionEasy.answer) {
                _element.questionEasy.answer[language.toLowerCase() as keyof typeof _element.questionEasy.answer]["text"] = e;
            }
        }
        else{
            _element.questionHard = _element.questionHard? _element.questionHard : {
                id: 0,
                element_id: _element.id,
                text: {"de":{text:"",id:0},"en":{text:"",id:0},"fr":{text:"",id:0},"lu":{text:"",id:0}},
                difficulty: 'hard',
                answer: {"de":{text:"",id:0},"en":{text:"",id:0},"fr":{text:"",id:0},"lu":{text:"",id:0}},
            };
            if (_element.questionHard && language.toLowerCase() in _element.questionHard.answer) {
                _element.questionHard.answer[language.toLowerCase() as keyof typeof _element.questionHard.answer]["text"] = e;
            }
        }
        setElement(_element);
    }



  return (
    <div>
    <div  className={styles.popUpOverlay} onClick={()=>ClosePopUp()}> 
        
    </div>
    <div className={styles.popUp}>
    {appData.popUpType==="newElement"?
        <div>
            <div className={styles[tmpElement.color]}>
                <h2>Add New Element <span>(Select an element to add to this cell)</span></h2>
            </div>
            <form>
                <div className={styles.formRow}>
                    <label>
                        Atomic Number:  
                    </label>
                    <input type="number" onChange={(e)=>HandleChangeAtomic(parseInt(e.target.value))} value={tmpElement.atomicNumber} name="elementAtomicNumber" />
                </div>
                <div className={styles.formRow}>
                    <label>
                        Element Name:  
                    </label>
                    <input type="text" onChange={(e)=>HandleChangeName(e.target.value)} value={tmpElement.name} name="elementName" />
                </div>
                <div className={styles.formRow}>
                    <label>
                    Element Symbol: 
                    </label>
                    <input type="text" onChange={(e)=>HandleChangeSymbol(e.target.value)} value={tmpElement.symbol} name="elementSymbol"  />
                </div>
                <div className={styles.formRow}>
                    <div className={styles.toggleBtn}>
                        <span className={difficulty==="EASY"? styles.tglActive:styles.tglInactive}
                        onClick={()=>setDifficulty("EASY")}>EASY</span>
                        <span className={difficulty==="HARD"? styles.tglActive:styles.tglInactive}
                        onClick={()=>setDifficulty("HARD")}>HARD</span>
                    </div>
                </div>
                <div className={styles.formRow}>
                    
                    <div className={styles.toggleBtn}>
                        <span className={language==="en"? styles.tglActive:styles.tglInactive} onClick={()=>setLanguage("en")}>EN</span>
                        <span className={language==="fr"? styles.tglActive:styles.tglInactive} onClick={()=>setLanguage("fr")}>FR</span>
                        <span className={language==="de"? styles.tglActive:styles.tglInactive} onClick={()=>setLanguage("de")}>DE</span>
                        <span className={language==="lu"? styles.tglActive:styles.tglInactive} onClick={()=>setLanguage("lu")}>LU</span>
                    </div>
                </div>
                <div className={styles.formRow}>
                    <label>
                    Color: 
                    </label>
                    <div className={styles.colorPicker}>
                        <span className={styles.color1} onClick={()=>HandleChangeColor("color1")}></span>
                        <span className={styles.color2} onClick={()=>HandleChangeColor("color2")}></span>
                        <span className={styles.color3} onClick={()=>HandleChangeColor("color3")}></span>
                        <span className={styles.color4} onClick={()=>HandleChangeColor("color4")}></span>
                        <span className={styles.color5} onClick={()=>HandleChangeColor("color5")}></span>
                        <span className={styles.color6} onClick={()=>HandleChangeColor("color6")}></span>
                        <span className={styles.color7} onClick={()=>HandleChangeColor("color7")}></span>
                        <span className={styles.color8} onClick={()=>HandleChangeColor("color8")}></span>
                        <span className={styles.color9} onClick={()=>HandleChangeColor("color9")}></span>
                        <span className={styles.color10} onClick={()=>HandleChangeColor("color10")}></span>
                    </div>
                </div>
                <div className={styles.formRow}>
                    <label>
                    Question: 
                    </label>
                    <textarea name="question" onChange={(e)=>HandleUpdateQuestion(e.target.value)} value={GetValueQuestion()} />
                </div>
                <div className={styles.formRow}>
                    <label>
                    Answer: 
                    </label>
                    <textarea name="answer" onChange={(e)=>HandleUpdateAnswer(e.target.value)} value={GetValueAnswer()} />
                </div>
                <div className={styles.formRow}>
                    <input type="checkbox" name="autoTranslate" />
                    <span>
                    Auto Translate 
                    </span>
                    
                </div>
                
                <button className={styles.btn} onClick={()=>SaveElement(tmpElement)}>Save Element</button>
            </form>
        </div>
    :null}
</div>
</div>
  );
}