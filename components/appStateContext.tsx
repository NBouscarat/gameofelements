'use client'
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { AppData, element, popUpTypes } from '@/components/types';
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
            ClosePopUp();
            return;
        }else{
          setAppData((prevData) => ({
            ...prevData,
            elements: [...prevData.elements, element],
          }));
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


    return (
      <GlobalStateContext.Provider value={{ appData,GetUser,OpenPopUp, SaveElement,ClosePopUp,ReduceExpandedCards,CardToggleExpand}}>
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