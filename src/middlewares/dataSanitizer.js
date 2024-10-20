import perfectExpressSanitizer from "perfect-express-sanitizer";

const sanitizeBodyData = (req, res, next) => {
  const options = { xss: true, noSql: true, sql: true, level: 5, allowedKeys: ['role'] };

  //console.log({ role: req.body.role})
  const sanitizedData = perfectExpressSanitizer.sanitize.prepareSanitize(
    req.body,
    options
  );

  //console.log({ sanitizedData })
  // update req.body with sanitized data

  req.body = { ...sanitizedData };

  next();
};


const sanitizeParamsData = (req, res, next) => {
  const options = { xss: true, noSql: true, sql: true, level: 5 };

  const sanitizedData = perfectExpressSanitizer.sanitize.prepareSanitize(
    req.params,
    options
  );

  //console.log({ reqParams: req.params, sanitizedData })

  //console.log({ sanitizedData })
  // update req.body with sanitized data
  req.params = sanitizedData

  next();
};

export { sanitizeBodyData, sanitizeParamsData };