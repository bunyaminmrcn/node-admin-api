import { Router } from "express";
import { adminApp } from "../config.js";
import authSchema from "../schemas/auth.schema.js";
import { expressYupMiddleware } from 'express-yup-middleware'
import { sanitizeBodyData } from "../middlewares/dataSanitizer.js";
import { sanitizeRegisterData } from "../middlewares/publicSanitizer.js";

import jwt from 'jsonwebtoken';

import { env } from '../config.js';
import userService from "../services/user.service.js";
const { AUTH_SECRET } = env;


const router = Router();

/*
router.post('/', async (req, res) => {
    const results = await adminApp.auth().listUsers(100);
    if(results.users.length !== 0) {

        for (let i = 0; i < results.users.length; i++) {
            const user = results.users[i];
            const deleted =  await adminApp.auth().deleteUser(user.uid)
        }
        res.json({msg: 'OK'})
    } else {
        res.json({msg: 'No users'})
    }
})

*/
router.post('/login', sanitizeBodyData, expressYupMiddleware({ schemaValidator: authSchema.login }), async (req, res) => {
    const { email, password } = req.body;

    try {
        const response = await fetch(
            `http://localhost:9099/identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=test`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    password,
                    returnSecureToken: true,
                }),
            }
        )
        if (!response.ok) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const { idToken, refreshToken, localId } = await response.json()

        if (localId === undefined) {
            return res.status(500).send('Internal Server Error');
        }
        const creds = await adminApp.firestore().collection('users').doc(`${localId}`).get()

        if (!creds.exists) {
            await creds.ref.set({ deleted: false, role: 'User' }, { merge: true })
        };

        const fbToken = idToken;
        const data = creds.data()
        const role = data?.role || 'User';
        const now = new Date().toISOString();

        console.log({ now, role, AUTH_SECRET })
        const jwtToken = jwt.sign({ uid: localId, role, signedAt: now }, AUTH_SECRET, { expiresIn: '1h' });
        return res.json({ fbToken, jwtToken, refreshToken })

    } catch (error) {
        console.log({ error })
        return res.status(500).send('Internal Server Error');
    }

})


router.post('/register', sanitizeRegisterData, expressYupMiddleware({ schemaValidator: authSchema.register }), async (req, res) => {
    const { email, password, fullName } = req.body;

    try {

        const newUserResult = await userService.createUser({ email, password, displayName: fullName , photoURL: "https://avatar.iran.liara.run/username?username=" + fullName.replace(' ', '+')}, { role: 'User' })

        if (newUserResult.success) {
            const uid = newUserResult.body.uid
            const fbToken = await adminApp.auth().createCustomToken(uid, // { admin: true }
            )
            const jwtToken = jwt.sign({ uid, role: 'User', signedAt: new Date().toISOString() }, AUTH_SECRET, { expiresIn: '1h' });
            return res.json({ fbToken, jwtToken });
        } else {
            return res.status(401).json({ errors: newUserResult.error });
        }


    } catch (error) {
        return res.status(401).json({ message: error.message, type: error.code });
    }
})

export default router;
