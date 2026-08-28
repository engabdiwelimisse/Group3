import { ApiError } from '../utils/ApiError.js';

export function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const fields = {};
      for (const issue of result.error.issues) {
        fields[issue.path.join('.')] = issue.message;
      }
      return next(new ApiError(400, 'VALIDATION_ERROR', 'Invalid request data', fields));
    }
    req.body = result.data;
    next();
  };
}
