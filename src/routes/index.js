import { Router } from "express";


import usersRoute from './users.route.js';
import logsRoute from './logs.route.js';

import postsRoute from './posts.route.js';

const router = Router();

router.use('/users', usersRoute)
router.use('/logs', logsRoute)
router.use('/posts', postsRoute)

if(process.env.dev === '1') {
    console.log('TEMP routes loaded')
}
export default router;