import { PostStatus } from "../../../generated/prisma/enums";


export interface IcreatepostPayload {
    title: string,
    content: string,
    thumbnail?: string,
    tags: string[],
    isFeatured?: boolean,
    status: PostStatus,

}

export interface IUpdatePostPayload {
    title?: string,
    content?: string,
    thumbnail?: string,
    tags?: string[],
    isFeatured?: boolean,
    status?: PostStatus,
}