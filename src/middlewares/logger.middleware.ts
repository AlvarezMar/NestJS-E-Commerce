import { NextFunction, Request, Response } from "express";

const now = new Date();
const formattedDate = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()}`;
const formattedTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
const dateTime = `${formattedDate}, ${formattedTime}`;

export function loggerGlobal(req: Request, res: Response, next: NextFunction){
    console.log(`[${dateTime}] ${req.method}: ${req.url}`);
    next();
};