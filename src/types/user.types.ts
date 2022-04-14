import {object, string, TypeOf} from "zod"

export const createUserSchema = object({
    body: object({
        name: string({
            required_error: "Name is required"
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

export type createUserInput = TypeOf<Omit<typeof createUserSchema, "body.confirmPassword">>
