import { createMiddleware } from "@tanstack/react-start"
import { getUserFn } from "./auth"

export const isLoginMiddleware = createMiddleware({ type: 'function' }).server(
    async ({ next }) => {
        const user = await getUserFn()
        return next({
            context: {
                userInfo: user,
            },
        })
    },
)