/**
 * Answer pannel to display if the answer is correct or not and additonnal informations
 */
import styles from "@/app/page.module.css";
import { useGlobalState } from "./appStateContext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBan} from '@fortawesome/free-solid-svg-icons';
import { useState,useRef } from "react";
import { element, translation } from "./types";

import dynamic from "next/dynamic";
import InputComponent from "./input";


export default function PopUp({}: { }) { 
    const { appData,ClosePopUp,SaveElement} = useGlobalState();
    const elementNameRef = useRef<any>(null);
    const elementSymbolRef = useRef<any>(null);
    const elementAtomicNumberRef = useRef<any>(null);
    const editorMoreInfoRef = useRef<any>(null);
    const elementDifficultyRef = useRef<any>(null);
    const elementGlobalRef = useRef<any>(null);
    const translationRef = useRef<any>(null);
    const editorAnswerRef = useRef<any>(null);
    const editorQuestionRef = useRef<any>(null);
    const editorSetupRef = useRef<any>(null);
    const editorExplanationRef = useRef<any>(null);
    const [difficulty,setDifficulty]=useState("EASY");
    type Translation = "en" | "fr" | "de" | "lu";
    const [language,setLanguage]=useState<Translation>("en");
    const [_isDefault,setIsDefault]=useState(false);
    const EditorClient = dynamic(() => import("../components/EditorClient"), {
        ssr: false,
    });
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

    const HandleSaveElement = (e:any) =>{
        e.preventDefault();
        let _element = {...tmpElement};
        if (editorQuestionRef.current) {
            const content = editorQuestionRef.current.GetContent(); // Appelle la méthode GetContent
            _element = HandleUpdateQuestion(content,_element);
        }
        if (editorAnswerRef.current) {
            const content = editorAnswerRef.current.GetContent(); // Appelle la méthode GetContent
            _element =HandleUpdateAnswer(content,_element);
        }
        if (editorSetupRef.current) {
            const content = editorSetupRef.current.GetContent(); // Appelle la méthode GetContent
            _element =HandleUpdateSetup(content,_element);
        }
        if (editorExplanationRef.current) {
            const content = editorExplanationRef.current.GetContent(); // Appelle la méthode GetContent
            _element =HandleUpdateExplanation(content,_element);
        }
        if (editorMoreInfoRef.current) {
            const content = editorMoreInfoRef.current.GetContent(); // Appelle la méthode GetContent
            _element =HandleUpdateMoreInfo(content,_element);
        }
        // get values from refs
        _element.name = elementNameRef.current ? elementNameRef.current.GetValue() : "";
        _element.symbol = elementSymbolRef.current ? elementSymbolRef.current.GetValue() : "";
        _element.atomicNumber = elementAtomicNumberRef.current ? parseInt(elementAtomicNumberRef.current.GetValue()) : 1;
        console.log("Final Element to save:", _element);
        setElement(_element);
        SaveElement(_element);
    }



    const HandleChangeColor = (color:string) =>{
        setElement({
            ...tmpElement,
            color: color
        });
    }

    const HandleUpdateQuestion = (e:string,element:element) =>{
        if(difficulty==="EASY"){
            element.questionEasy = element.questionEasy? element.questionEasy : {
                id: 0,
                element_id: element.id,
                text: {"de":"","en":"","fr":"","lu":""},
                difficulty: 'easy',
                answer: {"de":"","en":"","fr":"","lu":""},
                isDefault: _isDefault,
                moreInfo: {"de":"","en":"","fr":"","lu":""},
            };
            element.questionEasy.text[language] = e;
        }
        else{
            element.questionHard = element.questionHard? element.questionHard : {
                id: 0,
                element_id: element.id,
                text: {"de":"","en":"","fr":"","lu":""},
                difficulty: 'hard',
                answer: {"de":"","en":"","fr":"","lu":""},
                isDefault: _isDefault,
                moreInfo: {"de":"","en":"","fr":"","lu":""},
            };
            element.questionHard.text[language] = e;
            
        }
        return element;
    }

    const HandleUpdateAnswer = (e:string,element:element) =>{
        if(difficulty==="EASY"){
            element.questionEasy = element.questionEasy? element.questionEasy : {
                id: 0,
                element_id: element.id,
                text:  {"de":"","en":"","fr":"","lu":""},
                difficulty: 'easy',
                answer: {"de":"","en":"","fr":"","lu":""},
                isDefault: _isDefault,
                moreInfo: {"de":"","en":"","fr":"","lu":""},
            };
            if (element.questionEasy && language.toLowerCase() in element.questionEasy.answer) {
                element.questionEasy.answer[language.toLowerCase() as keyof typeof element.questionEasy.answer] = e;
            }
        }
        else{
            element.questionHard = element.questionHard? element.questionHard : {
                id: 0,
                element_id: element.id,
                text: {"de":"","en":"","fr":"","lu":""},
                difficulty: 'hard',
                answer: {"de":"","en":"","fr":"","lu":""},
                isDefault: _isDefault,
                moreInfo: {"de":"","en":"","fr":"","lu":""},
            };
            if (element.questionHard && language.toLowerCase() in element.questionHard.answer) {
                element.questionHard.answer[language.toLowerCase() as keyof typeof element.questionHard.answer] = e;
            }
        }
        return element;
    }

    const HandleUpdateSetup = (e:string,element:element) =>{
        // if experiment exist copy else create new
        var _experiment = tmpElement.experiment?{...tmpElement.experiment}: {
            explanation: {
                "de":"",
                "en":"",
                "fr":"",
                "lu":""
            },
            setup: {
                "de":"",
                "en":"",
                "fr":"",
                "lu":""
            },
            id:0
        };
        // if setup exist copy else create new
        _experiment.setup = _experiment.setup? _experiment.setup : {
                "de":"",
                "en":"",
                "fr":"",
                "lu":""
        };
        if (_experiment && language.toLowerCase() in _experiment.setup) {
            _experiment.setup[language.toLowerCase() as keyof typeof _experiment.setup] = e;
        }
        element.experiment = _experiment;
        return element;
    }

    const HandleUpdateExplanation = (e:string,element:element) =>{
        // if experiment exist copy else create new
        var _experiment = tmpElement.experiment?{...tmpElement.experiment}: {
            explanation: {
                "de":"",
                "en":"",
                "fr":"",
                "lu":""
            },
            setup: {
                "de":"",
                "en":"",
                "fr":"",
                "lu":""
            },
            id:0
        };
            // if setup exist copy else create new
            _experiment.explanation = _experiment.explanation? _experiment.explanation : {
                    "de":"",
                    "en":"",
                    "fr":"",
                    "lu":""
            } as translation;
            if (_experiment && language.toLowerCase() in _experiment.explanation) {
                _experiment.explanation[language.toLowerCase() as keyof typeof _experiment.explanation] = e;
            }
        element.experiment = _experiment;
        return element;
    }

    const HandleUpdateMoreInfo = (e:string, element:element) =>{
        var _moreInfo = difficulty==="easy"?tmpElement.questionEasy?.moreInfo?{...tmpElement.questionEasy?.moreInfo}: {
                "de":"",
                "en":"",
                "fr":"",
                "lu":""
        }:
        tmpElement.questionHard?.moreInfo?{...tmpElement.questionHard?.moreInfo}: {
                "de":"",
                "en":"",
                "fr":"",
                "lu":""
        };
        _moreInfo[language] = e;
        difficulty==="easy"?element.questionEasy!.moreInfo = _moreInfo: element.questionHard!.moreInfo = _moreInfo;
        return element;
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
                    <InputComponent ref={elementAtomicNumberRef} label="Atomic Number" value={tmpElement.atomicNumber} type={"number"}/>
                </div>
                <div className={styles.formRow}>
                    <InputComponent ref={elementNameRef} label="Element Name" value={tmpElement.name} type={"text"}/>
                </div>
                <div className={styles.formRow}>
                    <InputComponent ref={elementSymbolRef} label="Element Symbol" value={tmpElement.symbol} type={"text"}/>
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
                    <EditorClient ref={editorQuestionRef} value={tmpElement.questionEasy?.text[language] ?? ""}/>
                    {/* <textarea name="question" onChange={(e)=>HandleUpdateQuestion(e.target.value)} value={GetValueQuestion()} /> */}
                </div>
                <div className={styles.formRow}>
                    <label>
                    Answer: 
                    </label>
                    <EditorClient ref={editorAnswerRef} value={tmpElement.questionEasy?.answer[language] ?? ""}/>
                    {/* <textarea name="answer" onChange={(e)=>HandleUpdateAnswer(e.target.value)} value={GetValueAnswer()} /> */}
                </div>
                <div className={styles.formRow}>
                    <label>
                    Experiment Setup: 
                    </label>
                    <EditorClient ref={editorSetupRef} value={tmpElement.experiment?.setup[language] ?? ""}/>
                    {/* <textarea name="setup" onChange={(e)=>HandleUpdateSetup(e.target.value)} value={GetValueSetup()} /> */}
                </div>
                <div className={styles.formRow}>
                    <label>
                    Experiment Explanation: 
                    </label>
                    <EditorClient ref={editorExplanationRef} value={tmpElement.experiment?.explanation[language] ?? ""}/>
                    {/* <textarea name="explanation" onChange={(e)=>HandleUpdateExplanation(e.target.value)} value={GetValueExplanation()} /> */}
                </div>
                <div className={styles.formRow}>
                    <label>
                    Additional information: 
                    </label>
                    <EditorClient ref={editorMoreInfoRef} value={((difficulty==="easy"?tmpElement.questionEasy?.moreInfo : tmpElement.questionHard?.moreInfo) ?? {})[language] ?? ""}/>
                </div>
                <div className={styles.formRow}>
                    <input type="checkbox" name="autoTranslate" />
                    <span>
                    Auto Translate 
                    </span>
                    
                </div>
                <div className={styles.formRow}>
                    <input type="checkbox" onChange={()=>setIsDefault(!_isDefault)} name="isDefault" checked={_isDefault} />
                    <span>
                        Global questions (visible to all users)
                    </span>
                    
                </div>
                
                <button className={styles.btn} onClick={(e)=>HandleSaveElement(e)}>Save Element</button>
            </form>
        </div>
    :null}
</div>
</div>
  );
}