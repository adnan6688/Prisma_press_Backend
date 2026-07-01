import bcrypt from "bcryptjs"
import { prisma } from "../../lib/prisma"
import config from "../../config"
import { RegisterUserPayload } from "./user.interface"


const register = async (payload: RegisterUserPayload) => {

    const { name, email, password, profilePhoto } = payload

    const isUserExits = await prisma.user.findUnique({
        where: { email }
    })
    if (isUserExits) {
        throw new Error('User With this email already exists')
    }
    const hasedPassword = await bcrypt.hash(password, Number(config.bcrypt_salt_rounds))


    const user = await prisma.user.create({
        data: {
            name,
            email,
            password: hasedPassword
        }
    })

    await prisma.profile.create({
        data: {
            userId: user.id,
            profilePhoto

        }
    })


    const getUser = await prisma.user.findUnique({
        where: {
            id: user.id,
            email: user.email || email
        },
        omit: {
            password: true
        },
        include: {
            profile: true
        }
    })

    return getUser
}



const getMyProfile = async (email: string, id: string) => {

    const user = await prisma.user.findUniqueOrThrow({
        where: { email, id },
        omit: {
            password: true
        },
        include: {
            profile: true
        }
    })
    return user
}

const updateProfile = async (userId: string, payload: any) => {


    const { name, bio, profilePhoto } = payload

    const updatedUser = await prisma.user.update({
        where: {
            id: userId
        }, data: {
            name,
            profile: {
                update: {
                    profilePhoto,
                    bio
                }
            }
        },
        omit: {
            password: true
        },
        include: {
            profile: true
        }
    })


    return updatedUser
}


export const userService = {
    register,
    getMyProfile,
    updateProfile
}