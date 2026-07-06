
import { CommentStatus, PostStatus } from "../../../generated/prisma/enums"
import { PostWhereInput } from "../../../generated/prisma/models"

import { prisma } from "../../lib/prisma"
import { IcreatepostPayload, IpostQuery, IUpdatePostPayload } from "./post.interface"

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








const allPosts = async (query: IpostQuery) => {



    const limit = query?.limit ? Number(query.limit) : 10
    const page = query.page ? Number(query.page) : 1
    const skip = (page - 1) * limit


    const sortBy = query.sortBy ? query.sortBy : "createdAt"
    const sortOrder = query.sortOder ? query.sortOder : "desc"


    const andCodintions: PostWhereInput[] = []


    const tags = query.tags ? JSON.parse(query.tags as string) : null
    const tagsArray = Array.isArray(tags) ? tags : []


    if (query.searchTerm) {

        andCodintions.push({
            OR: [
                {
                    title: {
                        contains: query.searchTerm,
                        mode: "insensitive"
                    }
                }, {
                    content: {
                        contains: query.searchTerm,
                        mode: "insensitive"
                    }
                }
            ]
        })
    }

    if (query.title) {
        andCodintions.push({
            title: query.title
        })
    }
    if (query.content) {
        andCodintions.push({
            content: query.content
        })
    }


    if (query.authorId) {
        andCodintions.push({
            authorId: query.authorId
        })
    }
    if (query.isFeatured) {
        andCodintions.push({
            isFeatured: Boolean(query.isFeatured)
        })
    }


    if (tagsArray) {
        andCodintions.push({
            tags: {
                hasSome: tagsArray,
            },
        });
    }



    if (query.status) {
        andCodintions.push({
            status: query.status
        })
    }




    const posts = await prisma.post.findMany(
        {


            // dynamic searching , filtering
            // where: {
            //     AND: [


            //         // search term 
            //         query.searchTerm ? {
            //             OR: [
            //                 {
            //                     title: {
            //                         contains: query.searchTerm,
            //                         mode: "insensitive"
            //                     }
            //                 }, {
            //                     content: {
            //                         contains: query.searchTerm,
            //                         mode: "insensitive"
            //                     }
            //                 }
            //             ]
            //         } : {},


            //         //this is filter options
            //         query.title ? { title: query.title } : {},
            //         query.content ? { content: query.content } : {}
            //     ]
            // },



            where: {
                AND: andCodintions
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
                comments: true,
                _count: {
                    select: {
                        comments: true
                    }
                }
            },

            omit: {
                authorId: true
            },
            // dynamic paginations
            take: limit,
            skip: skip,
            orderBy: {
                // sortby : sortOrder
                [sortBy]: sortOrder
            },


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