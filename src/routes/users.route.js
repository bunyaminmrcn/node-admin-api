import { Router } from "express";
import { expressYupMiddleware } from 'express-yup-middleware'
import { sanitizeBodyData ,sanitizeParamsData  } from "../middlewares/dataSanitizer.js";

const router = Router();
import usersShema from '../schemas/users.schema.js'
import usersService from '../services/user.service.js';

router.get('/', (req, res) => {
    return res.json({ msg: 'OK' })
})
router.post('/create', sanitizeBodyData, expressYupMiddleware({ schemaValidator: usersShema.addUser }), async (req, res) => {

    const { name, email, password, rx_ } = req.body;

    //console.log({ role })

    const userBody = {
        email,
        emailVerified: false,
        //phoneNumber: '+11234567890',
        password,
        displayName: name,
        photoURL: "https://avatar.iran.liara.run/username?username=" +name.replace('_', '+').replace(' ', '+'),
        disabled: false
    };
    const result = await usersService.createUser(userBody, { role: rx_ });

    if(result.success) {
        return res.json(result)
    } else {
        return res.status(400).json(result)
    }

})


router.put('/update/:uid', sanitizeParamsData, sanitizeBodyData, expressYupMiddleware({ schemaValidator: usersShema.editUser }), async (req, res) => {

    const { uid } = req.params;
    const { name, email, password, rx_ } = req.body;

    //console.log({ role })

    const userBody = {
        email,
        emailVerified: false,
        //phoneNumber: '+11234567890',
        password,
        displayName: name,
        photoURL: 'http://www.example.com/12345678/photo.png',
        disabled: false
    };

    const result = await usersService.updateUser(userBody, { role: rx_, uid });

    if(result.success) {
        return res.json(result)
    } else {
        return res.status(400).json(result)
    }

})


router.delete('/delete/:uid', sanitizeParamsData, expressYupMiddleware({ schemaValidator: usersShema.deleteUser }), async (req, res) => {

    const { uid } = req.params;
    
    const result = await usersService.deleteUser({ uid });

    if(result.success) {
        return res.json(result)
    } else {
        return res.status(400).json(result)
    }

})

export default router;