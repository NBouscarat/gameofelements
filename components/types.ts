/**
 * @file types.ts
 * @description This file contains all the types, interfaces and constants used in the application.
 * @author Nicolas Bouscarat
 * 
 * @project Game of Elements - Teacher interface
 * @date September 2026
 * This app will present a periodic table of element, each elements will have their own questions and answers. two difficulties levels will be available: easy and hard. the Teacher will be able to select an element and the two questions and answer will be displayed. At some points the teacher may be able to override the default question and answer with custom one.
 */

// INTERFACES
export interface AppData {
    error: string | null;
    start: boolean;
    elements:element[];
    user: user | null;
    popUpOpen: boolean;
    popUpType: popUpTypes|null;
    popUpPosition: string;
    popUpElement:element|null;
    cardExpanded: boolean;
};

export type popUpTypes = 'newElement'| 'element';

export interface user {
    id: number;
    iam: string;
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
};


export interface question {
    id: number;
    element_id: number;
    text: translation;
    difficulty: 'easy' | 'hard';
    answer: translation;
};


export interface translation {
    en: string;
    fr: string;
    de: string;
    lu: string;
};

