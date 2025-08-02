'use server'

import { prisma } from "../prisma"

export const getAllComments = async () => {
    try {
        const response = await prisma.comment.findMany()
        return response
    } catch (error) {
        console.error(error)
    }
}

export const createComment = async (userId: string, postId: string, content: string) => {
    try {
        const response = await prisma.comment.create({
            data: {
                userId,
                postId,
                content
            }
        })

        return response
    } catch (error) {
        return console.error(error)
    }
}

export const deleteComment = async (id: string) => {
    try {
        const response = await prisma.comment.delete({
            where: {
                id
            }
        })

        return response
    } catch (error) {
        console.error(error)
    }
}