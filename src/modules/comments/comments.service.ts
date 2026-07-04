import { prisma } from "../../lib/prisma"
import { IcreateCommentPayload, IModarateComment, IupdatedCommentPayload } from "./comment.interface"


const createComment = async (authorId: string, payload: IcreateCommentPayload) => {

    // ck post 
    await prisma.post.findUniqueOrThrow({
        where: {
            id: payload.postId
        }
    })

    const { content, postId } = payload
    const cmt = await prisma.comment.create({
        data: {
            authorId,
            content,
            postId
        }
    })

    return cmt

}


const allCommentOfPost = async (postId: string) => {

    const result = await prisma.comment.findMany({
        where: {
            postId
        },
        orderBy: {
            createdAt: 'desc'
        },
        include: {
            post: {
                select: {
                    id: true,
                    title: true
                }
            }
        }
    })

    return result
}


const getCommentBycommentId = async (commentId: string) => {


    const comment = await prisma.comment.findUnique({
        where: {
            id: commentId
        },
        include: {
            post: {
                select: {
                    id: true,
                    title: true,
                    views: true
                }
            }
        }
    })

    return comment
}


const updateComment = async (commentId: string, data: IupdatedCommentPayload, authorId: string) => {

    const commentData = await prisma.comment.findUnique({
        where: {
            id: commentId,
            authorId
        },
        select: {
            id: true
        }
    })

    if (!commentData) {
        throw new Error("Your Provided input is invliad!")
    }

    const comment = await prisma.comment.update({
        where: {
            id: commentData?.id,
            authorId
        },
        data
    })

    return comment

}

const deleteComment = async (commentId: string, authorId: string) => {

    await prisma.comment.findUniqueOrThrow({
        where: {
            id: commentId,
            authorId
        }
    })


    await prisma.comment.delete({
        where: {
            id: commentId,
            authorId
        }
    })

    return true
}


const moderateComment = async (commentId: string, data: IModarateComment) => {
    const commentData = await prisma.comment.findUniqueOrThrow({
        where: {
            id: commentId
        },
        select: {
            id: true,
            status: true
        }
    })

    if (commentData.status === commentData.status) {
        throw new Error(`Your provided status (${data?.status}) is already up to date`)
    }

    const comment = await prisma.comment.update({
        where: {
            id: commentData?.id
        },
        data
    })

    return comment
}


export const commentService = {
    createComment,
    allCommentOfPost,
    getCommentBycommentId,
    updateComment,
    deleteComment,
    moderateComment
}