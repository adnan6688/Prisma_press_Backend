import { prisma } from "../../lib/prisma"
import { IcreatepostPayload } from "./post.interface"

const createPost = async (payload: IcreatepostPayload, userId: string) => {

    const result = await prisma.post.create({
        data: {
            ...payload,
            authorId: userId
        }
    })
    return result

}


const postDetails = async (postId: string) => {

    await prisma.post.findUniqueOrThrow({
        where: {
            id: postId
        },
        include: {
            author: {
                omit: {
                    password: true,
                    createdAt: true,
                    updatedAt: true,
                    role: true,
                    activeStatus: true
                }
            }
        }
    })

    const updatedPost = await prisma.post.update({
        where: {
            id: postId
        }, data: {
            views: {
                increment: 1
            }
        }, include: {
            author: {
                omit: {
                    password: true
                }
            },
            comments: true
        }
    })

    return updatedPost

}


const allPosts = async () => {

    const posts = await prisma.post.findMany(
        {
            include: {
                author: {
                    omit: {
                        password: true,
                        createdAt: true,
                        updatedAt: true,
                        role: true,
                        activeStatus: true
                    }
                },
                comments: true
            },
            omit: {
                authorId: true
            }

        }
    )
    return posts
}


const myPosts = async (userId: string) => {


    const data = await prisma.post.findMany({
        where: {
            authorId: userId,
        },
        include: {
            comments: true,
            author: {
                omit: {
                    password: true,
                    createdAt: true,
                    updatedAt: true,
                },
            },
            _count: {
                select: {
                    comments: true,
                },
            },
        },
        orderBy: {
            createdAt: "desc",
        },
    });


    return data
}


const updatePost = async () => {


}


const deletePost = async () => {

}


export const postService = {
    createPost,
    postDetails,
    allPosts,
    updatePost,
    deletePost,
    myPosts
}