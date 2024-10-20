import * as Yup from 'yup'

const addUser = {
  schema: {
    /*
    query: {
        yupSchema: true
    },
    */
    body: {
      yupSchema: Yup.object().shape({
        name: Yup.string().required(),
        email: Yup.string().email().required(),
        rx_: Yup.mixed().oneOf(['User', 'Admin', 'SuperAdmin']),
        password: Yup.string().min(3).max(20).required()
      }),
    },
    /*
    params: {
        yupSchema: true
    },
    */
  },
}


const editUser = {
  schema: {
    /*
    query: {
        yupSchema: true
    },
    */
    body: {
      yupSchema: Yup.object().shape({
        name: Yup.string().required(),
        email: Yup.string().email().required(),
        rx_: Yup.mixed().oneOf(['User', 'Admin', 'SuperAdmin']),
        password: Yup.string().min(3).max(20).required()
      }),
    },
    params: {
      yupSchema: Yup.object().shape({
        uid: Yup.string().length(28).required()
      })
    },

  },
}


const deleteUser = {
  schema: {
    params: {
      yupSchema: Yup.object().shape({
        uid: Yup.string().length(28).required()
      })
    },
  },
}

export default { addUser, editUser, deleteUser };