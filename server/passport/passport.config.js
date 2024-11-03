import passport from "passport";
import bcrypt from "bcryptjs"

import User from "../models/userModel.js";
import { GraphQLLocalStrategy } from "graphql-passport";


export const configurePassport = async () => {
    passport.serializeUser((user, done) => {
        console.log("Serializing the user.");
        done(null, user.id)
    })

    passport.deserializeUser(async (id, done) => {
        console.log("Deserializing the user.");
        try {
            const user = await User.findById(id)
            done(null, user)
        } catch (error) {
            done(error, null)
        }
    })

    passport.use(
        new GraphQLLocalStrategy(async (username, password, done) => { // Change here
            try {
                const user = await User.findOne({ username });
                if (!user) throw new Error("Invalid Username or Password!!");
                const validPassword = await bcrypt.compare(password, user.password); // Use password here
                if (!validPassword) throw new Error("Invalid Username or Password!!");
                return done(null, user);
            } catch (error) {
                return done(error, null);
            }
        })
    );
    
}