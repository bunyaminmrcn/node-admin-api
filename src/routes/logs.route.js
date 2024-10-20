import { Router } from "express";

import { infoLogger, errorLogger } from "../config.js";
const router = Router();


router.post('/create-error', (req, res) => {
    try {
        throw new Error("App Error")
    } catch (error) {
        errorLogger.log('error', error.message)
        res.status(400).json({ msg: 'Error happened' })
    }
})



router.post('/create-log', (req, res) => {
    try {
        infoLogger.log('info', 'App info')
        res.json({ msg: 'OK' })
    } catch (error) {
        errorLogger.log('error', error.message)
        res.status(400).json({ msg: 'Error happened' })
    }
})

export default router;