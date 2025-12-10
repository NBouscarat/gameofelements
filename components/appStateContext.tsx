'use client'
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { AppData, element, popUpTypes, dbElement,dbQuestion,dbTranslation, translation,question } from '@/components/types';
import { } from './engine';
import axios from 'axios';


interface AppState {
    appData: AppData;
    GetUser: ()=>void;
    OpenPopUp: (element:element, popUpType:popUpTypes)=>void;
    ClosePopUp: ()=>void;
    SaveElement: (element:element)=>void;
    CardToggleExpand: (id:number)=>void;
    ReduceExpandedCards: ()=>void;
    AddElementFromDBToAppData: (dbElement:dbElement)=>void;
  }

const GlobalStateContext = createContext<AppState | undefined>(undefined);
const initialAppData: AppData = {
    error: null,
    start: false,
    user: null,
    elements:[],
    popUpOpen: false,
    popUpType: null,
    popUpElement: null,
    popUpPosition: "",
    cardExpanded: false,
};



  
export const GlobalStateProvider = ({ children }: { children: ReactNode }) => {
    const [appData, setAppData] = useState<AppData>(initialAppData);
    
    //const GA4 = ReactGA4.initialize("G-KZ2ENR9329");

    const GetUser = ()=>{
      
    };

    const OpenPopUp = (element:element, popUpType:popUpTypes)=>{
        setAppData((prevData) => ({
            ...prevData,
            popUpOpen: true,
            popUpType: popUpType,
            popUpPosition: element.position,
            popUpElement: element,
        }));
    };

    const ClosePopUp = ()=>{
        setAppData((prevData) => ({
            ...prevData,
            popUpOpen: false,
            popUpType: null,
        }));
    };

    const SaveElement = (element:element)=>{
        // Does element exist?
        
        if(appData.elements.find(e => e.id === element.id)){
            // Update existing element
            setAppData((prevData) => ({
                ...prevData,
                elements: prevData.elements.map(e => e.id === element.id ? element : e),
            }));
            UpdateElementIntoDataBase(element);
            ClosePopUp();
            return;
        }else{
          setAppData((prevData) => ({
            ...prevData,
            elements: [...prevData.elements, element],
          }));
          InsertElementIntoDataBase(element);
        }
       
        ClosePopUp();
    };

    const CardToggleExpand = (id:number)=>{
        setAppData((prevData) => ({
            ...prevData,
            elements: prevData.elements.map(e => e.id === id ? {...e, expanded: !e.expanded} : e),
            cardExpanded: !prevData.cardExpanded,
        }));
    }

    const ReduceExpandedCards = ()=>{
        setAppData((prevData) => ({
            ...prevData,
            elements: prevData.elements.map(e => e.expanded ? {...e, expanded: false} : e),
            cardExpanded: false,
        }));
    }

    const AddElementFromDBToAppData = (dbElement:dbElement)=>{
        let newElement:element = {
            id: dbElement.id,
            position: dbElement.position,
            name: dbElement.name,
            symbol: dbElement.symbol,
            atomicNumber: dbElement.atomicNumber,
            color: dbElement.color,
            questionEasy: null,
            questionHard: null,
            expanded: false,
        };
        // Map questions
        dbElement.questions.forEach((dbQ:dbQuestion)=>{
            // find questions easy with isDefault true 
            if(dbQ.difficulty === 'easy' && dbQ.isDefault){
                let Qtranslations:translation = {"de":{text:"",id:0},"en":{text:"",id:0},"fr":{text:"",id:0},"lu":{text:"",id:0}};
                dbQ.translations.forEach((dbT:dbTranslation)=>{
                    Qtranslations[dbT.language]["text"] = dbT.question;
                    Qtranslations[dbT.language]["id"] = dbT.id;
                });
                let Atranslations:translation = {"de":{text:"",id:0},"en":{text:"",id:0},"fr":{text:"",id:0},"lu":{text:"",id:0}};
                dbQ.translations.forEach((dbT:dbTranslation)=>{
                    Atranslations[dbT.language]["text"] = dbT.answer;
                    Atranslations[dbT.language]["id"] = dbT.id;
                });
                newElement.questionEasy = {
                    id: dbQ.id,
                    element_id: dbQ.element_id,
                    text: Qtranslations,
                    difficulty: dbQ.difficulty,
                    answer: Atranslations,
                };
            }

            if(dbQ.difficulty === 'hard' && dbQ.isDefault){
                let Qtranslations:translation = {"de":{text:"",id:0},"en":{text:"",id:0},"fr":{text:"",id:0},"lu":{text:"",id:0}};
                dbQ.translations.forEach((dbT:dbTranslation)=>{
                    Qtranslations[dbT.language]["text"] = dbT.question;
                    Qtranslations[dbT.language]["id"] = dbT.id;
                });
                let Atranslations:translation = {"de":{text:"",id:0},"en":{text:"",id:0},"fr":{text:"",id:0},"lu":{text:"",id:0}};
                dbQ.translations.forEach((dbT:dbTranslation)=>{
                    Atranslations[dbT.language]["text"] = dbT.answer;
                    Atranslations[dbT.language]["id"] = dbT.id;
                });
                newElement.questionHard = {
                    id: dbQ.id,
                    element_id: dbQ.element_id,
                    text: Qtranslations,
                    difficulty: dbQ.difficulty,
                    answer: Atranslations,
                };
            }

        });

        // Add newElement to AppData
        setAppData((prevData) => ({
            ...prevData,
            elements: [...prevData.elements, newElement],
        }));
        console.log(appData.elements);
    }

    const InsertElementIntoDataBase = (element:element)=>{
        // Make sure all fields are filled and not null
        if(element.questionEasy===null){
            element.questionEasy = {
                id: 0,
                element_id: element.id,
                text: {"de":{text:"",id:0},"en":{text:"",id:0},"fr":{text:"",id:0},"lu":{text:"",id:0}},
                difficulty: 'easy',
                answer: {"de":{text:"",id:0},"en":{text:"",id:0},"fr":{text:"",id:0},"lu":{text:"",id:0}},
            } as question;
        }
        if(element.questionHard===null){
            element.questionHard = {
                id: 0,
                element_id: element.id,
                text: {"de":{text:"",id:0},"en":{text:"",id:0},"fr":{text:"",id:0},"lu":{text:"",id:0}},
                difficulty: 'hard',
                answer: {"de":{text:"",id:0},"en":{text:"",id:0},"fr":{text:"",id:0},"lu":{text:"",id:0}},
            } as question;
        }

        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
            params:{
            }
        };
    
        let payload = {
            action: "INSERT_ELEMENT",
            element: element,
        };
    
        axios.post("https://dev.script.lu/research-n-dev/goe/dbConnection.php" ,payload,config).then((res)=>{
            console.log("Element inserted into DB:", res.data);
        }).catch((error)=>{
            console.log("Error inserting Element into DB");
        });
    }

    const UpdateElementIntoDataBase = (element:element)=>{
        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
            params:{
            }
        };
    
        let payload = {
            action: "UPDATE_ELEMENT",
            element: element,
        };
    
        axios.post("https://dev.script.lu/research-n-dev/goe/dbConnection.php" ,payload,config).then((res)=>{
            console.log("Element updated into DB:", res.data);
        }).catch((error)=>{
            console.log("Error updating Element into DB");
        });
    }


    return (
      <GlobalStateContext.Provider value={{ appData,GetUser,OpenPopUp, SaveElement,ClosePopUp,ReduceExpandedCards,CardToggleExpand,AddElementFromDBToAppData
      ,}}>
        {children}
      </GlobalStateContext.Provider>
    );
  };
    
    

export const useGlobalState = () => {
    const context = useContext(GlobalStateContext);
    if (context === undefined) {
        throw new Error('useGlobalState must be used within a GlobalStateProvider');
    }
    return context;
};