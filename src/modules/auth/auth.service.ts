import { ActiveStatus } from "../../../generated/prisma/enums"
import config from "../../config"
import { prisma } from "../../lib/prisma"
import { jwtUtils } from "../../utils/jwt"
import { TLoginPayload } from "./auth.interface"
import bcrypt from "bcryptjs"

const loginUser = async (payload: TLoginPayload) => {

    const { email, password } = payload


    const ckUser = await prisma.user.findUniqueOrThrow({
        where: { email }
    })

    const isPassMatch = await bcrypt.compare(password, ckUser.password)

    if (!isPassMatch) {
        throw new Error('Password is incorrect')
    }

    if (ckUser.activeStatus === ActiveStatus.BLOCK) {
        throw new Error("Your account has been block , please contact support")
    }
    const jwtPayload = {
        id: ckUser.id,
        name: ckUser.name,
        email: ckUser.email,
        role: ckUser.role
    }


    const accessToken = jwtUtils.createToken(jwtPayload, config.jwt_access_secret, config.jwt_access_expires_in)

    const refreshToken = jwtUtils.createToken(jwtPayload, config.jwt_refresh_secret, config.jwt_refresh_expires_in)



    return {
        accessToken,
        refreshToken
    }
}


export const authService = {
    loginUser
}