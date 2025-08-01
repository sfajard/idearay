'use server'

import { prisma } from "../prisma"

export const createLike = async (userId: string, postId: string) => {
    try {
        const response = await prisma.like.create({
            data: {
                postId,
                userId
            }
        })

        return response
    } catch (error) {
        return console.error(error)
    }
}

export const deleteLike = async (userId: string, postId: string) => {
    try {
        const response = await prisma.like.deleteMany({
            where: {
                userId,
                postId
            }
        })

        return response
    } catch (error) {
        return console.error(error)
    }
}