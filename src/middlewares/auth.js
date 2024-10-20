import jwt from 'jsonwebtoken';
// get the resolved path to the file
import { env } from '../config.js'

const authenticateJWT = (req, res, next) => {
    const authHeader = req.get('Authorization');
    //console.log({authHeader })
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        jwt.verify(token, env.AUTH_SECRET, (err, user) => {
            if (err) {
                return res.sendStatus(403);
            }

            console.log({ user })
            req.user = user;
            next();
        });
    } else {
        res.sendStatus(401);
    }
}

export { authenticateJWT };