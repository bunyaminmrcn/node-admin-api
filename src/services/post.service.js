
import { adminApp, errorLogger } from '../config.js';



const getUser = async (authorId) => {
    const userResponse = await adminApp.firestore().collection('users').doc(`${authorId}`).get();
    const user = userResponse.data();
    delete user.role;
    delete user.email;
    delete user.friendList;
    return user;
}

export const getPosts = async (role, uid) => {
    try {
        const postsResponse = await adminApp.firestore().collection('posts').get();
        let posts = postsResponse.docs.map(async post => {
            const data = post.data()
            return {
                ...(data),
                uid: post.id,
                author: await getUser(data.authorId)
            }
        })

        posts = await Promise.all(posts);
        const friendListResponse = await adminApp.firestore().collection('users').doc(`${uid}`).get();
        const { friendList } = friendListResponse.data();
        posts = posts.filter(post => {
            if (post.public || post.authorId == uid || friendList.includes(uid) || ['Admin', 'SuperAdmin'].includes(role)) {
                return post
            }
        });

        console.log(posts[0])
        return posts;
    } catch (err) {
        console.log({ err })
        return []
    }
}
export const createPost = async (body) => {
    try {
        const addedDoc = await adminApp.firestore().collection('posts').add(body);
        const doc = await addedDoc.get();
        return { success: true, body: { ...(doc.data()), uid: doc.id } }
    } catch (error) {
        errorLogger.log('error', error.message)
        return { success: false, error }
    }
}


export const updatePost = async (body, { postId }) => {
    try {

        const post = await adminApp.firestore().collection('posts').doc(`${postId}`).get();
        if (post.exists) {
            const updatedPost = await post.ref.set(body, { merge: true })
            return { success: true, body: updatedPost }
        } else {
            return { success: false, msg: 'User not found' }
        }

    } catch (error) {
        errorLogger.log('error', error.message)
        return { success: false, error }
    }
}


export const deletePost = async ({ postId }) => {
    try {

        const post = await adminApp.firestore().collection('posts').doc(`${postId}`).get();
        if (post.exists) {

            const deletedPost = await post.ref.set({ deleted: true }, { merge: true })
            return { success: true, body: deletedPost }
        } else {
            return { success: false, msg: 'User not found' }
        }

    } catch (error) {
        errorLogger.log('error', error.message)
        return { success: false, error }
    }
}

export default {
    getPosts,
    createPost,
    updatePost,
    deletePost
}