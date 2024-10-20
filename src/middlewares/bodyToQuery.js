

export const toQuery = ({ schema }) => (req, res, next) => {
    //console.log({ body: req.body, query: req.query, schema })
    for (let i = 0; i < schema.length; i++) {
        const sh_ = schema[i];
        req.query[`${sh_}`] = req.body[`${sh_}`]
    }
    next();
}