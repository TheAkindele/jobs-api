import {Request, Response} from "express"

export interface reqType extends Request {
    user: {name: string, password: string, role: string, _id: string};
    token: string
}
