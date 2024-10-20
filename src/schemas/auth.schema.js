import * as Yup from 'yup'

const login = {
    schema: {
        /*
        query: {
            yupSchema: true
        },
        */
        body: {
            yupSchema: Yup.object().shape({
                email: Yup.string().email().min(5).max(30).required(),
                password: Yup.string().min(8).max(30).required()
            }),
        },
        /*
        params: {
            yupSchema: true
        },
        */
    },
}


const register = {
    schema: {
        /*
        query: {
            yupSchema: true
        },
        */
        body: {
            yupSchema: Yup.object().shape({
                email: Yup.string().email().min(5).max(30).required(),
                password: Yup.string()
                .min(8, 'Password must be at least 8 characters long')
                .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
                .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
                .matches(/[0-9]/, 'Password must contain at least one number')
                .matches(/[^a-zA-Z0-9]/, 'Password must contain at least one special character')
                .required('Password is required'),
                fullName: Yup.string().min(5).max(30).required()
                //photoURL: Yup.string().min(5).max(140).required()
            }),
        },
    },
}


export default { login, register };