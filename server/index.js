import express from "express"
import http from "http"
import cors from 'cors'
import dotenv from "dotenv"

import passport from "passport"
import session from "express-session"
import connectMongo from "connect-mongodb-session";

//apollo imports
import { ApolloServer } from "@apollo/server"
import { expressMiddleware } from "@apollo/server/express4"
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer"

import { buildContext } from "graphql-passport";

import typeDefs from "./typeDefs/index.js"
import resolvers from "./resolvers/index.js"

import { connectDB } from "./db/connectDB.js"
import { configurePassport } from "./passport/passport.config.js"

dotenv.config()
configurePassport()

const app = express();
const httpServer = http.createServer(app);

const mongoDBStore = connectMongo(session)

const store = new mongoDBStore({
    uri: process.env.MONGO_URI,
    collection: "sessions"
})
//error handling in store
store.on("error", (error) => console.log(error))

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 1000 * 60 * 60 * 24 * 7, //cookie will expire in 7 days
            httpOnly: true,
        },
        store: store,
    })
)

app.use(passport.initialize())
app.use(passport.session())

const server = new ApolloServer({
    typeDefs: typeDefs,
    resolvers: resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({httpServer})]
})

await server.start()

app.use(
    '/',
    cors({
        origin: "http://localhost:3000",
        credentials: true
    }),
    express.json(),
    expressMiddleware(server, {
            context: async({req, res}) => buildContext(req, res)
        } 
    )
);

await new Promise((resolve) =>
    httpServer.listen({ port: 4000 }, resolve),
);
await connectDB()


console.log(`🚀 Server ready at http://localhost:4000/`)