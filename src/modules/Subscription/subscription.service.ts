import config from "../../config"
import { prisma } from "../../lib/prisma"
import { stripe } from "../../lib/stripe"


const createCheckOutSession = async (userId: string) => {



    const transectionResult = await prisma.$transaction(async (tx) => {

        const user = await tx.user.findUniqueOrThrow({
            where: {
                id: userId
            },
            include: {
                subscription: true
            }
        })


        let stripeCustomerId = user.subscription?.stripeCustomarId
        if (!stripeCustomerId) {

            const customer = await stripe.customers.create({
                email: user?.email,
                name: user?.name,
                metadata: {
                    userId: user?.id,
                    role: user?.role
                }

            })

            stripeCustomerId = customer.id
        }


        const session = await stripe.checkout.sessions.create({
            line_items: [
                {
                    price : config.stripe_product_id, 
                    quantity : 1
                }
            ],
            mode: "subscription",
            customer: stripeCustomerId,
            payment_method_types: ["card"],
            success_url: `${config.app_url}/premium?success=true`,
            cancel_url: `${config.app_url}/payment?success=false`,
            metadata: {
                userId
            }
        })

        return session.url


    })

    return {
        paymentURl : transectionResult
    }

}


export const subscriptionService = {
    createCheckOutSession
}