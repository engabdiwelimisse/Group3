import { ApiError } from '../utils/ApiError.js';

export function handleImageUpload(req, res, next) {
  if (!req.file) {
    return next(new ApiError(400, 'VALIDATION_ERROR', 'No image file was provided', { image: 'required' }));
  }

  const url = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
  res.status(201).json({ url });
}
