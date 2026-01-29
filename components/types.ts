/**
 * @file types.ts
 * @description This file contains all the types, interfaces and constants used in the application.
 * @author Nicolas Bouscarat
 * 
 * @project Game of Elements - Teacher interface
 * @date September 2026
 * This app will present a periodic table of element, each elements will have their own questions and answers. two difficulties levels will be available: easy and hard. the Teacher will be able to select an element and the two questions and answer will be displayed. At some points the teacher may be able to override the default question and answer with custom one.
 */

import { initialize } from "next/dist/server/lib/render-server";

// INTERFACES
export interface AppData {
    error: string | null;
    start: boolean;
    elements:element[];
    language: 'en' | 'fr' | 'de' ;
    user: user | null;
    popUpOpen: boolean;
    popUpType: popUpTypes|null;
    popUpPosition: string;
    popUpElement:element|null;
    cardExpanded: boolean;
    selectedElementId:number|null;
    initialized: boolean;
};

export type popUpTypes = 'newElement'| 'element';

export interface user {
    id: number;
    iam: string;
    isAdmin: boolean;
    questions: question[];
}

export interface element {
    id: number;
    position:string;
    name: string;
    symbol: string;
    atomicNumber: number;
    color: string;
    questionEasy: question|null;
    questionHard: question|null;
    expanded:boolean;
    experiment:experiment|null;
};

export interface dbElement {
    id: number;
    position:string;
    name: string;
    symbol: string;
    atomicNumber: number;
    color: string;
    questions:dbQuestion[];
    experiment:experiment|null;
    moreInfo:translation|null;
}
export interface dbQuestion {
    id:number,
    difficulty: 'easy' | 'hard';
    element_id: number;
    iam: string;
    isDefault: boolean;
    text:translation;
    answer:translation;
    moreInfo:translation|null;
}


export interface question {
    id: number;
    element_id: number;
    text: translation;
    difficulty: 'easy' | 'hard';
    answer: translation;
    isDefault: boolean;
    moreInfo:translation|null;
};


export interface translation {
    en: string;
    fr: string;
    de: string;
};

export interface experiment{
    id:number;
    question: translation;
    answer: translation;
    moreInfo:translation|null;
    element_id:number;
}


export const textTranslation = {
    experimentSetup:{
        en: "Setup",
        fr: "Installation",
        de: "Aufbau"
    },
    experimentExplanation:{
        en: "Explanation",
        fr: "Explication",
        de: "Erklärung"
    },
    moreInformation:{
        en: "More Information",
        fr: "Informations supplémentaires",
        de: "Zusätzliche Informationen"
    },
    question:{
        en: "Question",
        fr: "Question",
        de: "Frage"
    },
    answer:{
        en: "Answer",
        fr: "Réponse",
        de: "Antwort"
    },
    experiment:{
        en: "Experiment",
        fr: "Expérience",
        de: "Experiment"
    },
    ownQuestion:{
        en: "Add own question",
        fr: "Ajouter une question personnelle",
        de: "eigene Frage hinzufügen"
    }
    ,
    difficultyEasy:{
        de: "Leicht",
        en: "Easy",
        fr: "Facile"
    },
    difficultyHard:{
        de: "Schwer",
        en: "Hard",
        fr: "Difficile"
    }
}
