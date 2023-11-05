import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import User from '@models/user'
// this connects to the mongoDb
import { connectToDB } from '@utils/database'


// console.log({
//     clientId: process.env.GOOGLE_ID,
//     clientSecret: process.env.GOOGLE_CLIENT_SECRET
// })
const handler = NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        })  
    ],
    async session({session}){
        const sessionUser = await User.findOne({
            email: session?.user?.email
        })

        session.user.id = sessionUser._id.toString()

    },
    async signIn({ profile }){
        try {
            await connectToDB()
            // check if a user already exits
            const userExits = await User.findOne({
                email: profile.email
            })

            //if not create a new user
            if(!userExits){
                await User.create({
                    email: profile.email,
                    username: profile.name.replace(" ", "").toLowerCase(),
                    image: profile.picture
                })
            }
        } catch (error) {
            
        }
    }
})

export { handler as GET, handler as POST}