import { PostStatus } from "../../../generated/prisma/enums";
import { PostWhereInput } from "../../../generated/prisma/models";


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

export interface IpostQuery extends PostWhereInput {
    // title? : string , 
    // content? : string,

    page? : string , 
    limit? : string , 
    searchTerm? : string , 
    sortOder? : string , 
    sortBy? : string
}
