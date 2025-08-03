'use server'

import { NextResponse } from "next/server"
import { prisma } from "../prisma"

export const getAllPosts = async () => {
    try {
        const response = await prisma.post.findMany({
            include: {
                user: true,
                Like: true,
                comment: {
                    include: {
                        user: true
                    }
                },
                image: true
            }
        })
        return response
    } catch (error) {
        console.error("Failed fetching posts", error)
        return ''
    }
}

export const getPostById = async (id: string) => {
    try {
        const response = await prisma.post.findUnique({
            where: {
                id
            }
        })
        return response
    } catch (error) {
        console.error("Failed fetching posts", error)
    }
}

export const createPost = async (content: string, userId: string, imageUrls?: string[]) => {
    if (!userId || !content) return console.error("All field required", { status: 400 })
    try {
        const createdPost = await prisma.post.create({
            data: {
                userId,
                content,
            }
        })

        if (imageUrls && imageUrls.length > 0) {
            await prisma.image.createMany({
                data: imageUrls.map(url => ({
                    url: url,
                    postId: createdPost.id
                }))
            })
        }

        return createdPost
    } catch (error) {
        console.error("Failed create a post", error)
    }
}

export const updatePost = async (req: Request): Promise<NextResponse> => {
    try {
        const body = await req.json()
        const { id, content } = body

        const post = await getPostById(id)
        if (!post) return NextResponse.json({ msg: "Post not found", status: 500 })

        const response = await prisma.post.update({
            where: {
                id
            },
            data: {
                content
            }
        })

        return NextResponse.json(response, { status: 200 })
    } catch (error) {
        console.error("Failed updating post", error)
        return NextResponse.json({ status: 500 })
    }
}

export const deletePost = async (id: string) => {
    try {
        const response = await prisma.post.delete({
            where: {
                id: id
            }
        })

        return response
    } catch (error) {
        console.error(error)
    }
}