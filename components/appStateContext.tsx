'use client'
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { AppData, element, popUpTypes, dbElement,dbQuestion, translation,question, user } from '@/components/types';
import { } from './engine';
import axios from 'axios';


interface AppState {
    appData: AppData;
    GetUser: ()=>void;
    OpenPopUp: (element:element, popUpType:popUpTypes)=>void;
    ClosePopUp: ()=>void;
    SwitchLanguage: (ln:'en' | 'fr' | 'de' | 'lu')=>void;
    SaveElement: (element:element)=>void;
    CardToggleExpand: (id:number)=>void;
    ReduceExpandedCards: ()=>void;
    AddElementFromDBToAppData: (dbElement:dbElement)=>void;
    SelectElement: (id:number|null)=>void;
    GetDataFromAPI: ()=>void;
    GetMockData: ()=>void;
  }

const GlobalStateContext = createContext<AppState | undefined>(undefined);
const initialAppData: AppData = {
    error: null,
    start: false,
    user: null,
    language: 'en',
    elements:[],
    popUpOpen: false,
    popUpType: null,
    popUpElement: null,
    popUpPosition: "",
    cardExpanded: false,
    selectedElementId: null,
    initialized: false,
};



  
export const GlobalStateProvider = ({ children }: { children: ReactNode }) => {
    const [appData, setAppData] = useState<AppData>(initialAppData);
    
    //const GA4 = ReactGA4.initialize("G-KZ2ENR9329");

    const GetUser = ()=>{
        //read IAM from localStorage
        let iam = localStorage.getItem('iam');
        
        // IF IAM is Empty redirect to login page
        if(!iam){
            console.log("No IAM found, redirect to login page");
            iam = "bouni204"; // For testing purposes only
            return;
        }
        
        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
            params:{
            }
        };
      
        let payload = {
            action: "GET_USER_BY_IAM",
        };
        axios.post("https://app.script.lu/goe/dbConnection.php" ,payload,config).then((res)=>{
            console.log("User Data from API:", res.data);
            // for each element in res.data, call AddElementFromDBToAppData
            res.data.forEach((user:user) => {
                // SECURITY CHECK against forgery
                if(user.iam === iam){
                    setAppData((prevData) => ({
                        ...prevData,
                        user: user,
                    }));
                }
            });
        }).catch((error)=>{
            console.log("Error getting Photos");
        });
      
    };
    const GetDataFromAPI = ()=> {
        const config = {
          headers: {
              'Content-Type': 'application/json',
          },
          params:{
          }
      };
    
      let payload = {
          action: "GET",
      };
    
      axios.post("https://app.script.lu/goe/dbConnection.php" ,payload,config).then((res)=>{
          console.log("Data from API:", res.data);
          //set appData initialized to true
            setAppData((prevData) => ({
                ...prevData,
                initialized: true,
            }));
          // for each element in res.data, call AddElementFromDBToAppData
          console.log(res.data);
          res.data.forEach((dbElement:any) => {
            try{
                AddElementFromDBToAppData(dbElement);
            }
            catch(e){
                console.log("Error parsing DB element:", e);
            }
          });
      }).catch((error)=>{
          console.log("Error getting Photos");
      });
    };

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
            experiment:null,
        };

        try{
            // Map questions
            dbElement.questions.forEach((dbQ:dbQuestion)=>{
                // find questions easy with isDefault true 
                if(dbQ.difficulty === 'easy' && dbQ.isDefault){
                    
                    newElement.questionEasy = {
                        id: dbQ.id,
                        element_id: dbQ.element_id,
                        text: dbQ.text,
                        difficulty: dbQ.difficulty,
                        answer: dbQ.answer,
                        isDefault: dbQ.isDefault,
                        moreInfo: null,
                    };
                }

                if(dbQ.difficulty === 'hard' && dbQ.isDefault){
                    
                    newElement.questionHard = {
                        id: dbQ.id,
                        element_id: dbQ.element_id,
                        text: dbQ.text,
                        difficulty: dbQ.difficulty,
                        answer: dbQ.answer,
                        isDefault: dbQ.isDefault,
                        moreInfo: null,
                    };
                }

            });
        }catch(e){
            console.log("Error parsing DB question:", e);
        }
        // Add newElement to AppData
        setAppData((prevData) => ({
            ...prevData,
            elements: [...prevData.elements, newElement],
        }));
        
    }

    const GetMockData = ()=>{
        const newElement:element = {
            id: 1,
            position: "1/1/2/2",
            name: "Hydrogen",
            symbol: "H",
            atomicNumber: 1,
            color: "#FF0000",
            questionEasy: {
                text: {
                    de:"Was ist das Symbol für Wasserstoff?",
                    en:"What is the symbol for Hydrogen?",
                    fr:"Quel est le symbole de l'hydrogène?",
                    lu:"Was ist das Symbol für Wasserstoff?",
                },
                id: 1,
                element_id: 1,
                difficulty: 'easy',
                answer: {
                    de:"H",
                    en:"H",
                    fr:"H",
                    lu:"H",
                },
                isDefault: true,
                moreInfo:{
                    de:"Mehr Informationen auf Deutsch",
                    en:"More information in English",
                    fr:"Plus d'informations en français",
                    lu:"Mehr Informationen auf Deutsch",
                }
            },
            questionHard: {
                text: {
                    de:"Was ist das Symbol für Wasserstoff?",
                    en:"What is the symbol for Hydrogen?",
                    fr:"Quel est le symbole de l'hydrogène?",
                    lu:"Was ist das Symbol für Wasserstoff?",
                },
                id: 1,
                element_id: 1,
                difficulty: 'hard',
                answer: {
                    de:"H",
                    en:"H",
                    fr:"H",
                    lu:"H",
                },
                isDefault: true,
                moreInfo:{
                    de:"Mehr Informationen auf Deutsch",
                    en:"More information in English",
                    fr:"Plus d'informations en français",
                    lu:"Mehr Informationen auf Deutsch",
                }
            },
            expanded: false,
            experiment:{
                id:1,
                explanation:{
                    de:"Experiment Erklärung auf Deutsch",
                    en:"Experiment explanation in English",
                    fr:"Explication de l'expérience en français",
                    lu:"Experiment Erklärung auf Deutsch",
                },
                setup:{
                    de:"Versuchsaufbau auf Deutsch",
                    en:"Experimental setup in English",
                    fr:"Configuration expérimentale en français",
                    lu:"Versuchsaufbau auf Deutsch",
                }
            }
        };
        

        setAppData((prevData) => ({
            ...prevData,
            elements: [newElement],
            initialized: true,
        }));
    }

    const SwitchLanguage = (ln:'en' | 'fr' | 'de' | 'lu')=>{
        setAppData((prevData) => ({
            ...prevData,
            language: ln,
        }));
    }

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

    const SelectElement = (id:number | null)=>{
        setAppData((prevData) => ({
            ...prevData,
            selectedElementId: id,
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
  

    const InsertElementIntoDataBase = (element:element)=>{
        // check if user isAdmin
        let _isDefault = false;
        if(appData.user && appData.user.isAdmin){
            _isDefault = true;
        }

        // Make sure all fields are filled and not null
        if(element.questionEasy===null){
            element.questionEasy = {
                id: 0,
                element_id: element.id,
                text: {"de":"","en":"","fr":"","lu":""},
                difficulty: 'easy',
                answer: {"de":"","en":"","fr":"","lu":""},
                isDefault: true,
            } as question;
        }
        if(element.questionHard===null){
            element.questionHard = {
                id: 0,
                element_id: element.id,
                text: {"de":"","en":"","fr":"","lu":""},
                difficulty: 'hard',
                answer: {"de":"","en":"","fr":"","lu":""},
                isDefault: true,
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
            user_id: appData.user?.id ?? 1,
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
      <GlobalStateContext.Provider value={{ appData,
        GetUser,
        OpenPopUp, 
        SaveElement,
        ClosePopUp,
        ReduceExpandedCards,
        CardToggleExpand,
        AddElementFromDBToAppData,
        SelectElement,
        SwitchLanguage,
        GetDataFromAPI,
        GetMockData,
        }}>
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