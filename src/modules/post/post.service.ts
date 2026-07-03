import { CommentStatus, PostStatus } from "../../../generated/prisma/enums"
import { prisma } from "../../lib/prisma"
import { IcreatepostPayload, IUpdatePostPayload } from "./post.interface"

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


    const transectionResult = await prisma.$transaction(
        async (tx) => {
            await tx.post.update({
                where: {
                    id: postId
                }, data: {
                    views: {
                        increment: 1
                    }
                }
            });

            const post = await prisma.post.findUniqueOrThrow({
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
                    },
                    _count: {
                        select: {
                            comments: true
                        }
                    }
                },

            });

            return post

        }
    )
    return transectionResult

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


const updatePost = async (postId: string, payLoad: IUpdatePostPayload, authorId: string, isAdmin: boolean) => {

    const post = await prisma.post.findUniqueOrThrow({
        where: {
            id: postId
        }
    })

    if (!isAdmin && post.authorId !== authorId) {
        throw new Error("You are not the owner of this post!")
    }

    const result = await prisma.post.update({
        where: {
            id: postId
        },
        data: {
            ...payLoad
        },
        include: {
            author: {
                omit: {
                    password: true
                }
            }
        }
    })

    return result
}


const deletePost = async (postId: string, authorId: string, isAdmin: boolean) => {

    const post = await prisma.post.findUniqueOrThrow({
        where: {
            id: postId
        }
    })

    if (!isAdmin && post.authorId !== authorId) {
        throw new Error("You are not the owner of this post!")
    }

    await prisma.post.delete({
        where: {
            id: postId
        }
    })
    return null
}



const getPostStats = async () => {



    const transactionResult = await prisma.$transaction(async (tx) => {
        const [
            totalPost,
            totalPublishedPost,
            totalDraft,
            totalArchivedPost,
            totalComments,
            totalApprovedComments,
            totalRejectedComments,
            totalViewsResult,
        ] = await Promise.all([
            tx.post.count(),

            tx.post.count({
                where: {
                    status: PostStatus.PUBLISHED,
                },
            }),

            tx.post.count({
                where: {
                    status: PostStatus.DRAFT,
                },
            }),

            tx.post.count({
                where: {
                    status: PostStatus.ARCHIVED,
                },
            }),

            tx.comment.count(),

            tx.comment.count({
                where: {
                    status: CommentStatus.APPROVED,
                },
            }),

            tx.comment.count({
                where: {
                    status: CommentStatus.REJECCT,
                },
            }),

            tx.post.aggregate({
                _sum: {
                    views: true,
                },
            }),
        ]);

        return {
            totalPost,
            totalPublishedPost,
            totalDraft,
            totalArchivedPost,
            totalComments,
            totalApprovedComments,
            totalRejectedComments,
            totalViews: totalViewsResult._sum.views ?? 0,
        };
    });

    return transactionResult;
};

export const postService = {
    createPost,
    postDetails,
    allPosts,
    updatePost,
    deletePost,
    myPosts,
    getPostStats
}