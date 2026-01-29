/**
 * Answer pannel to display if the answer is correct or not and additonnal informations
 */
import styles from "@/app/page.module.css";
import { useGlobalState } from "./appStateContext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBan} from '@fortawesome/free-solid-svg-icons';
import { useState,useRef, useEffect } from "react";
import { element, translation } from "./types";

import dynamic from "next/dynamic";
import InputComponent from "./input";
const RichTextEditor = dynamic(() => import('../components/Editor'), { 
    ssr: false 
  });

// Define the RichTextEditorHandle type
type RichTextEditorHandle = {
    getContent: () => string;
    setContent: (content: string) => void;
};
  

export default function PopUp({}: {}) { 
    const { appData,ClosePopUp,SaveElement} = useGlobalState();
    const elementNameRef = useRef<any>(null);
    const elementSymbolRef = useRef<any>(null);
    const elementAtomicNumberRef = useRef<any>(null);
    const editorMoreInfoRef = useRef<RichTextEditorHandle>(null);
    const editorMoreInExfoRef = useRef<RichTextEditorHandle>(null);
    const editorAnswerRef = useRef<RichTextEditorHandle>(null);
    const editorQuestionRef = useRef<RichTextEditorHandle>(null);
    const editorSetupRef = useRef<RichTextEditorHandle>(null);
    const editorExplanationRef = useRef<RichTextEditorHandle>(null);
    const [difficulty,setDifficulty]=useState("EASY");
    type Languages = "en" | "fr" | "de";
    const [language,setLanguage]=useState<Languages>("en");
    const [_isDefault,setIsDefault]=useState(true);
    
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
                color: "color1",
                questionEasy: null,
                questionHard: null,
            } as element;
        }
      }
    const [tmpElement,setElement] = useState(InitPopUpElement());

    const HandleSaveElement = (e:any,save:boolean) =>{
        if(e !== null){
            e.preventDefault();
        }
        let _element = {...tmpElement};
        if (editorQuestionRef.current) {
            const content = editorQuestionRef.current.getContent(); // Appelle la méthode GetContent
            _element = HandleUpdateQuestion(content,_element);
        }
        if (editorAnswerRef.current) {
            const content = editorAnswerRef.current.getContent(); // Appelle la méthode GetContent
            _element =HandleUpdateAnswer(content,_element);
        }
        if (editorMoreInfoRef.current) {
            const content = editorMoreInfoRef.current.getContent(); // Appelle la méthode GetContent
            _element =HandleUpdateMoreInfo(content,_element);
        }
        if (editorSetupRef.current) {
            const content = editorSetupRef.current.getContent(); // Appelle la méthode GetContent
            _element =HandleUpdateExperimentQuestion(content,_element);
        }
        if (editorExplanationRef.current) {
            const content = editorExplanationRef.current.getContent(); // Appelle la méthode GetContent
            _element =HandleUpdateExperimentAnswer(content,_element);
        }
        if (editorMoreInExfoRef.current) {
            const content = editorMoreInExfoRef.current.getContent(); // Appelle la méthode GetContent
            _element =HandleUpdateExperimentMoreInfo(content,_element);
        }
        // get values from refs
        _element.name = elementNameRef.current ? elementNameRef.current.GetValue() : "";
        _element.symbol = elementSymbolRef.current ? elementSymbolRef.current.GetValue() : "";
        _element.atomicNumber = elementAtomicNumberRef.current ? parseInt(elementAtomicNumberRef.current.GetValue()) : 1;
        console.log("Final Element to save:", _element);
        setElement(_element);
        if(!save) return;
        SaveElement(_element);
    }

    const HandleDifficulty = (level:string) =>{
        HandleSaveElement(null,false);
        setDifficulty(level);
    }

    const HandleSwitchLanguage = (ln:string) =>{
        HandleSaveElement(null,false);
        setLanguage(ln as Languages);
    }

    const HandleChangeColor = (color:string) =>{
        setElement({
            ...tmpElement,
            color: color
        });
    }

    const HandleUpdateQuestion = (e:string,element:element) =>{
        console.log("Updating question:", e, element);
        if(difficulty==="EASY"){
            element.questionEasy = element.questionEasy? element.questionEasy : {
                id: 0,
                element_id: element.id,
                text: {"de":"","en":"","fr":""},
                difficulty: 'easy',
                answer: {"de":"","en":"","fr":""},
                isDefault: _isDefault,
                moreInfo: {"de":"","en":"","fr":""},
            };
            element.questionEasy.text[language] = e;
        }
        else{
            element.questionHard = element.questionHard? element.questionHard : {
                id: 0,
                element_id: element.id,
                text: {"de":"","en":"","fr":""},
                difficulty: 'hard',
                answer: {"de":"","en":"","fr":""},
                isDefault: _isDefault,
                moreInfo: {"de":"","en":"","fr":""},
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
                text:  {"de":"","en":"","fr":""},
                difficulty: 'easy',
                answer: {"de":"","en":"","fr":""},
                isDefault: _isDefault,
                moreInfo: {"de":"","en":"","fr":""},
            };
            if (element.questionEasy && language.toLowerCase() in element.questionEasy.answer) {
                element.questionEasy.answer[language.toLowerCase() as keyof typeof element.questionEasy.answer] = e;
            }
        }
        else{
            element.questionHard = element.questionHard? element.questionHard : {
                id: 0,
                element_id: element.id,
                text: {"de":"","en":"","fr":""},
                difficulty: 'hard',
                answer: {"de":"","en":"","fr":""},
                isDefault: _isDefault,
                moreInfo: {"de":"","en":"","fr":""},
            };
            if (element.questionHard && language.toLowerCase() in element.questionHard.answer) {
                element.questionHard.answer[language.toLowerCase() as keyof typeof element.questionHard.answer] = e;
            }
        }
        return element;
    }

    const HandleUpdateMoreInfo = (e:string, element:element) =>{
        var _moreInfo = difficulty==="EASY"?element.questionEasy?.moreInfo?{...element.questionEasy?.moreInfo}: {
                "de":"",
                "en":"",
                "fr":""
        }:
        element.questionHard?.moreInfo?{...element.questionHard?.moreInfo}: {
                "de":"",
                "en":"",
                "fr":""
        };
        _moreInfo[language] = e;
        difficulty==="EASY"?element.questionEasy!.moreInfo = _moreInfo: element.questionHard!.moreInfo = _moreInfo;
        return element;
    }

    const HandleUpdateExperimentQuestion = (e:string,element:element) =>{
        // if experiment exist copy else create new
        var _experiment = element.experiment?{...element.experiment}: {
            question: {"de":"","en":"","fr":""},
            answer: {"de":"","en":"","fr":""},
            moreInfo: {"de":"","en":"","fr":""},
            id:0,
            element_id: element.id
        };
        
        // if setup exist copy else create new
        _experiment.question = _experiment.question? _experiment.question : {
                "de":"",
                "en":"",
                "fr":""
        };
        if (_experiment && language.toLowerCase() in _experiment.question) {
            _experiment.question[language.toLowerCase() as keyof typeof _experiment.question] = e;
        }
        element.experiment = _experiment;
        return element;
    }

    const HandleUpdateExperimentAnswer = (e:string,element:element) =>{
        // if experiment exist copy else create new
        var _experiment = element.experiment?{...element.experiment}: {
            question: {"de":"","en":"","fr":""},
            answer: {"de":"","en":"","fr":""},
            moreInfo: {"de":"","en":"","fr":""},
            id:0,
            element_id: element.id
        };
            // if setup exist copy else create new
            _experiment.answer = _experiment.answer? _experiment.answer : {
                    "de":"",
                    "en":"",
                    "fr":""
            } as translation;
            if (_experiment && language.toLowerCase() in _experiment.answer) {
                _experiment.answer[language.toLowerCase() as keyof typeof _experiment.answer] = e;
            }
        element.experiment = _experiment;
        return element;
    }

    
    const HandleUpdateExperimentMoreInfo = (e:string, element:element) =>{
        var _moreInfo = element.experiment?.moreInfo?{...element.experiment?.moreInfo}: {
                "de":"",
                "en":"",
                "fr":""
        };
        _moreInfo[language] = e;
        element.experiment!.moreInfo = _moreInfo;
        return element;
    }

    // INIT
  useEffect(()=>{
    const abortController = new AbortController();
    console.log("refresh popup element",language,difficulty);
    return () => {
        abortController.abort();
        
    }
    },[appData,difficulty,language])

  return (
    <div>
    <div  className={styles.popUpOverlay} onClick={()=>ClosePopUp()}> 
        
    </div>
    <div className={styles.popUp}>
        {appData.popUpType==="newElement"?
            <div>
                <div className={styles[tmpElement.color]}>
                    <h2>Update Element <span>(Enter data for this element)</span></h2>
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
                            onClick={()=>HandleDifficulty("EASY")}>EASY</span>
                            <span className={difficulty==="HARD"? styles.tglActive:styles.tglInactive}
                            onClick={()=>HandleDifficulty("HARD")}>HARD</span>
                        </div>
                    </div>
                    <div className={styles.formRow}>
                        
                        <div className={styles.toggleBtn}>
                            <span className={language==="en"? styles.tglActive:styles.tglInactive} onClick={()=>HandleSwitchLanguage("en")}>EN</span>
                            <span className={language==="fr"? styles.tglActive:styles.tglInactive} onClick={()=>HandleSwitchLanguage("fr")}>FR</span>
                            <span className={language==="de"? styles.tglActive:styles.tglInactive} onClick={()=>HandleSwitchLanguage("de")}>DE</span>
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
                        </div>
                    </div>
                    <div className={styles.formRow}>
                        <label>
                        Question: 
                        </label>
                        <div className={styles.wysiwygEditor}>
                            <RichTextEditor  ref={editorQuestionRef} value={difficulty === "EASY"?tmpElement.questionEasy?.text[language] ?? "":tmpElement.questionHard?.text[language] ?? ""}/>
                        </div>
                        {/* <textarea name="question" onChange={(e)=>HandleUpdateQuestion(e.target.value)} value={GetValueQuestion()} /> */}
                    </div>
                    <div className={styles.formRow}>
                        <label>
                        Answer: 
                        </label>
                        <div className={styles.wysiwygEditor}>
                        <RichTextEditor  ref={editorAnswerRef} value={difficulty === "EASY"?tmpElement.questionEasy?.answer[language] ?? "":tmpElement.questionHard?.answer[language] ?? ""}/>
                        </div>
                        {/* <textarea name="answer" onChange={(e)=>HandleUpdateAnswer(e.target.value)} value={GetValueAnswer()} /> */}
                    </div>
                    <div className={styles.formRow}>
                        <label>
                        Additional information: 
                        </label>
                        <div className={styles.wysiwygEditor}>
                        <RichTextEditor  ref={editorMoreInfoRef} value={((difficulty==="EASY"?tmpElement.questionEasy?.moreInfo : tmpElement.questionHard?.moreInfo) ?? {})[language] ?? ""}/>
                        </div>
                    </div>
                    <div>
                        <h2>Experiment</h2>
                    </div>
                    <div className={styles.formRow}>
                        <label>
                        Experiment Question: 
                        </label>
                        <div className={styles.wysiwygEditor}>
                        <RichTextEditor  ref={editorSetupRef} value={tmpElement.experiment?.question[language] ?? ""} />
                        </div>
                        {/* <textarea name="setup" onChange={(e)=>HandleUpdateSetup(e.target.value)} value={GetValueSetup()} /> */}
                    </div>
                    <div className={styles.formRow}>
                        <label>
                        Experiment Answer: 
                        </label>
                        <div className={styles.wysiwygEditor}>
                        <RichTextEditor  ref={editorExplanationRef} value={tmpElement.experiment?.answer[language] ?? ""} />
                        </div>
                        {/* <textarea name="explanation" onChange={(e)=>HandleUpdateExplanation(e.target.value)} value={GetValueExplanation()} /> */}
                    </div>
                    <div className={styles.formRow}>
                        <label>
                        Experiment Additional information: 
                        </label>
                        <div className={styles.wysiwygEditor}>
                        <RichTextEditor  ref={editorMoreInExfoRef} value={(tmpElement.experiment?.moreInfo ?? {})[language] ?? ""} />
                        </div>
                    </div>
                    
                    {/* <div className={styles.formRow}>
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
                        
                    </div> */}
                    
                    <button className={styles.btn} onClick={(e)=>HandleSaveElement(e,true)}>Save Element</button>
                </form>
            </div>
        :null}
    </div>
</div>
  );
}