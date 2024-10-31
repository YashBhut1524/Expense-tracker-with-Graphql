import {users} from "../dummyData/data.js"
import User from "../models/userModel.js";
import bcrypt from "bcryptjs"

const userResolver = {
    Mutation: {
        signUp: async (_, {input}, context) => {
            try {
                const {username, name, password, gender} = input
                if(!username || !name || !password || gender) throw new Error("All fields are required!!");
                const existingUser = User.findOne({username})
                if(existingUser) throw new Error("User already Exists!!")
                
                const salt = await bcrypt.genSalt(20)
                const hashPassword =  await bcrypt.hash(password, salt)
                
                //https://avatar-placeholder.iran.liara.run/
                const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`
                const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`

                const newUser = User({
                    username,
                    name,
                    password: hashPassword,
                    gender,
                    profilePicture: gender === "male" ? boyProfilePic : girlProfilePic
                })

                await newUser.save();
                await context.login(newUser)
                return newUser
            } catch (error) {
                console.error("Error in signUp: ", error);
                throw new Error (error.message || "Internal server Error!!") 
            }
        },

        login: async (_, {input}, context) => {
            try {
                const {username, password} = input
                const {user} = await context.authenticate("graphql-local", { username, password })
                
                await context.login(user)
                return user
            } catch (error) {
                console.error("Error in login: ", error);
                throw new Error (error.message || "Internal server Error!!") 
            }
        },
        logout: async(_, _, context) => {
            try {
                await context.logout()
                req.session.destroy((error) => {
                    if(error) throw error
                })
                res.clearCookie("connect.sid")

                return {message: "Logged Out Successfully"}
            } catch (error) {
                console.error("Error in logout: ", error);
                throw new Error (error.message || "Internal server Error!!") 
            }
        }
    },
    Query: {
        // users: (parent, args, context, info) => {
        // users: () => {
        //     return users
        // },
        authUser: async (_,_,context) => {
            try {
                const user = await context.getUser()
                return user;
            } catch (error) {
                console.error("Error in authUser: ", error);
                throw new Error (error.message || "Internal server Error!!") 
            }
        },
        user: async (_,{userId}) => {
            try {
                const user = await User.findById(userId)
                return user
            } catch (error) {
                console.error("Error in user query: ", error);
                throw new Error (error.message || "Internal server Error!!") 
            }
        }
    },
}

export default userResolver