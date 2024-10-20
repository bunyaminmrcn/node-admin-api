import * as Yup from 'yup'

const addPost = {
    schema: {
        /*
        query: {
            yupSchema: true
        },
        */
        body: {
            yupSchema: Yup.object().shape({
                authorId: Yup.string().length(28).required(),
                public_: Yup.boolean(),
                thumb: Yup.string().required(),
                image: Yup.string().required(),
                type: Yup.mixed().oneOf(['single_image', 'single_video', 'multi_image', 'mix']),
                resources: Yup.lazy(val => (Array.isArray(val) ? Yup.array().of(Yup.string()) : Yup.string())),
                tags: Yup.string()
            }),
        },
        /*
        params: {
            yupSchema: true
        },
        */
    },
}


const editPost = {
    schema: {
        /*
        query: {
            yupSchema: true
        },
        */
        body: {
            yupSchema: Yup.object().shape({
                authorId: Yup.string().length(28).required(),
                public_: Yup.boolean(),
                thumb: Yup.string().required(),
                image: Yup.string().required(),
                //type: Yup.mixed().oneOf(['single_image', 'single_video', 'multi_image', 'mix']),
                resources: Yup.lazy(val => (Array.isArray(val) ? Yup.array().of(Yup.string()) : Yup.string())),
                tags: Yup.string()
            }),
        },
        params: {
            yupSchema: Yup.object().shape({
                uid: Yup.string().length(28).required()
            })
        },

    },
}


const deletePost = {
    schema: {
        params: {
            yupSchema: Yup.object().shape({
                uid: Yup.string().length(28).required()
            })
        },
    },
}

export default { addPost, editPost, deletePost };