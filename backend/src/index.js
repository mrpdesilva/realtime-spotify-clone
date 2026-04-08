import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import { clerkClient, clerkMiddleware, getAuth } from '@clerk/express'
import fileupload from 'express-fileupload'
import path from 'path'

import { connectDB } from './lib/db.js'

import userRoutes from './routes/user.route.js'
import adminRoutes from './routes/admin.route.js'
import authRoutes from './routes/auth.route.js'
import songRoutes from './routes/song.route.js'
import albumRoutes from './routes/album.route.js'
import statRoutes from './routes/stat.route.js'
import { createServer } from 'http'
import { initializeSocket } from './lib/socket.js'
import cron from 'node-cron'
import fs from 'fs'

dotenv.config()

const app = express()
const PORT = process.env.PORT
const __dirname = path.resolve()

const httpServer = createServer(app)
initializeSocket(httpServer)

app.use(cors({
    origin: process.env.NODE_ENV === "production"
        ? process.env.FRONTEND_URL
        : "http://localhost:3000",
    credentials: true
}))

app.use(express.json())
app.use(clerkMiddleware()) //this will add auth to req obj => req.auth.userId
app.use(fileupload({
    useTempFiles: true,
    tempFileDir: path.join(__dirname, 'tmp'),
    createParentPath: true,
    limits: {
        fileSize: 10 * 1024 * 1024, //10mb
    }
}))

//cron jobs
const tempDir = path.join(process.cwd(), "tmp")
cron.schedule("0 * * * *", () => {
    if (fs.existsSync(tempDir)) {
        fs.readdir(tempDir, (err, files) => {
            if (err) {
                console.log("error", err)
                return
            }

            for (const file of files) {
                fs.unlink(path.join(tempDir, file), (err) => { })
            }
        })
    }
})

app.use("/api/users", userRoutes)
app.use("/api/admin", adminRoutes)
app.use("/api/auth", authRoutes)
app.use("/api/songs", songRoutes)
app.use("/api/albums", albumRoutes)
app.use("/api/stats", statRoutes)

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../frontend/dist")))
    app.get("{*path}", (req, res) => {
        res.sendFile(path.join(__dirname, "../frontend/dist/index.html"))
    })
}

//error handler
app.use((err, req, res, next) => {
    console.log(err)
    res.status(500).json({ message: process.env.NODE_ENV === "production" ? "Internal server error" : err.message })
})

httpServer.listen(PORT, () => {
    console.log('Server started on port ' + PORT)
    connectDB()
})