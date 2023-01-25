import {v4 as uuidv4} from 'uuid';
import mongoose from 'mongoose';

const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
const idchars = 'abcdefghijklmnopqrstuvwxyz0123456789';

export function getRandom(elems: any[]): any {
    let max = elems.length - 1;
    let index = Math.floor(Math.random() * max);
    return elems[index];
}

export function generateString(length: number) {
    let result = ' ';
    const charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
}

export function generateId(): string {
    let result = '';
    const charactersLength = idchars.length;
    for ( let i = 0; i < 12; i++ ) {
        result += idchars.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

export function generateName(): string {
    const first = generateString(5);
    const last = generateString(8);

    return first.charAt(0).toUpperCase() + first.slice(1) + " " + last.charAt(0).toUpperCase() + last.slice(1);
}

export function generateEmail(): string {
    return generateString(5) + "@zbitech.io";
}