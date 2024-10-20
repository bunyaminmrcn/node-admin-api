import { Router } from "express";
import { expressYupMiddleware } from 'express-yup-middleware'
import { sanitizeBodyData, sanitizeParamsData } from "../middlewares/dataSanitizer.js";

const router = Router();
import postsShema from '../schemas/posts.schema.js'
import postsService from '../services/post.service.js';
import { toQuery } from "../middlewares/bodyToQuery.js";
import { postModelRequiredFields } from '../models/post.js'
import { selectMax } from "../helpers/index.js";


router.get('/', async (req, res) => {
    const user = req.user;
    console.log({user})
    const posts = await postsService.getPosts(user.role, user.uid);
    return res.json({ body: posts})
})
router.post('/create', toQuery({ schema: postModelRequiredFields }), sanitizeBodyData, expressYupMiddleware({ schemaValidator: postsShema.addPost }), async (req, res) => {

    //console.log({ user: req.user })
    const { authorId, public_, thumb, image, type, resources, tags } = req.body;



    const { tags: tags_, image: image_, thumb: thumb_ } = req.query;
    

    const postBody = {
        authorId, public: public_, thumb: selectMax(thumb, thumb_), image: selectMax(image, image_), type, resources, tags: selectMax(tags, tags_)
    };
    const result = await postsService.createPost(postBody);

    if (result.success) {
        return res.json(result)
    } else {
        return res.status(400).json(result)
    }

})


router.put('/update/:uid', sanitizeParamsData, sanitizeBodyData, expressYupMiddleware({ schemaValidator: postsShema.editPost }), async (req, res) => {

    const { userId, public_, thumb, image, type, resources, tags } = req.body;
    const payload = {
        authorId: userId,
        public: public_,
        thumb,
        image,
        type,
        resources,
        tags,
    }

    const result = await postsService.updatePost(userBody, { postId: uid });

    if (result.success) {
        return res.json(result)
    } else {
        return res.status(400).json(result)
    }

})


router.delete('/delete/:uid', sanitizeParamsData, expressYupMiddleware({ schemaValidator: postsShema.deletePost }), async (req, res) => {

    const { uid } = req.params;

    const result = await postsService.deletePost({ postId: uid });

    if (result.success) {
        return res.json(result)
    } else {
        return res.status(400).json(result)
    }

})

export default router;