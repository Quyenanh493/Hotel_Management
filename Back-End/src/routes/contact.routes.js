import express from 'express';
import contactController from '../controllers/contactController';

const router = express.Router();

/**
 * @route POST /api/v1/contact/send-email
 * @desc Gửi email liên hệ từ form liên hệ
 * @access Public
 */
router.post('/send-email', contactController.handleSendContactEmail);

export default router; 