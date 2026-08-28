import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { uploadImage } from '../middleware/upload.js';
import { handleImageUpload } from '../controllers/uploadController.js';
import { ApiError } from '../utils/ApiError.js';

const router = Router();

router.post('/image', requireAuth, (req, res, next) => {
  uploadImage(req, res, (err) => {
    if (err) {
      if (err instanceof ApiError) return next(err);
      if (err.code === 'LIMIT_FILE_SIZE') {
        return next(new ApiError(400, 'FILE_TOO_LARGE', 'Image must be 5MB or smaller'));
      }
      return next(err);
    }
    handleImageUpload(req, res, next);
  });
});

export default router;
