import app from "./app"
import config from "./config";
import { prisma } from "./lib/prisma"
import "dotenv/config";
const port = config.port || 5000


async function main() {
    try {


        await prisma.$connect()
        console.log("Connected to the database successfully!")


        app.listen(port, () => {
            console.log(`server running on port ${port}`)
        })

    } catch (error) {
        console.log("Error Starting the server: ", error)
        await prisma.$disconnect()
        process.exit(1)
    }
}
main()