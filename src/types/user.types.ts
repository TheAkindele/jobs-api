import {object, string, TypeOf} from "zod"

// we create user validation to help validate user data sent by client with zod validator
// another validator that can be used is joi
export const createUserSchema = object({
    body: object({
        name: string({
            required_error: "Name is Required"
        }),
        password: string({
            required_error: "Password is required"
        }),
        confirmPassword: string({
            required_error: "Confirm password required"
        }),
        email: string({
            required_error: "Email is required"
        }).email("Not a valid email"),
        role: string({
            required_error: "role is required"
        })
    }).refine((data) => data.password === data.confirmPassword, {
            message: "Passwords dont match",
            path: ["confirmPassword"]
    })
})

// we create the createUserInput type that omits confirmPassword since that will not be part of the user Model data stored on the DB
export type createUserInput = TypeOf<Omit<typeof createUserSchema, "body.confirmPassword">>
