
import { adminApp, errorLogger } from '../config.js';

export const createUser = async (body, { role }) => {
    try {
        const counter = await adminApp.firestore().collection('users').count().get()
        const user = await adminApp.auth().createUser(body)

        const { count } = counter.data()
        //console.log({ count, email: body.email })
        await adminApp.firestore().collection('users').doc(`${user.uid}`).set({ email: body.email, role, name: body.displayName, image: body.photoURL, order: count, deleted: false, friendList: [] }, { merge: true })
        await adminApp.firestore().collection('preferences').doc(`${user.uid}`).set({ notifications: true, sms: true });
        await adminApp.firestore().collection('indexes').doc(`${count}`).set({ uid: user.uid })

        return {
            success: true, body: {
                uid: user.uid, order: count, setup: {
                    role: 'OK',
                    pref: 'OK',
                    index: 'OK'
                }
            }
        }
    } catch (error) {
        errorLogger.log('error', error.message)
        return { success: false, error }
    }
}


export const updateUser = async (body, { role, uid }) => {
    try {

        const user = await adminApp.auth().getUser(uid);
        if (user) {

            await adminApp.auth().updateUser(uid, body);
            await adminApp.firestore().collection('users').doc(`${user.uid}`).set({ email: body.email, role, name: body.displayName }, { merge: true })

            //console.log({ updateUser })
            return { success: true, body: { create: 'OK', setup: { role: 'OK' } } }
        } else {
            return { success: false, msg: 'User not found' }
        }

    } catch (error) {
        errorLogger.log('error', error.message)
        return { success: false, error }
    }
}


export const deleteUser = async ({ uid }) => {
    try {

        const user = await adminApp.auth().getUser(uid);
        if (user) {

            await adminApp.auth().updateUser(uid, { disabled: true });
            //const deletedUser = await adminApp.auth().deleteUser(uid);
            await adminApp.firestore().collection('users').doc(`${user.uid}`).set({ deleted: true }, { merge: true })

            //console.log({ disabledUser })
            return { success: true, body: { deleted: 'OK', setup: { role: 'OK' } } }
        } else {
            return { success: false, msg: 'User not found' }
        }

    } catch (error) {
        errorLogger.log('error', error.message)
        return { success: false, error }
    }
}

export default {
    createUser,
    updateUser,
    deleteUser
}