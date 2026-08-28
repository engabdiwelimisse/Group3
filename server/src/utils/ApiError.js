export class ApiError extends Error {
  constructor(statusCode, code, message, fields = {}) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.fields = fields;
  }
}
