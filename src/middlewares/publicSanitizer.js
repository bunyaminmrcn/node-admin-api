import perfectExpressSanitizer from "perfect-express-sanitizer";

const sanitizeRegisterData = (req, res, next) => {
  const options = { xss: true, noSql: true, sql: true, level: 2 };

  //console.log({ role: req.body.role})
  const sanitizedData = perfectExpressSanitizer.sanitize.prepareSanitize(
    req.body,
    options
  );

  req.body = { ...sanitizedData };

  next();
};


export { sanitizeRegisterData };