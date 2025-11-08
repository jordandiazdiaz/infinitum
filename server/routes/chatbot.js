const express = require('express');
const {
  initializeChatbot,
  getQRCode,
  connectWhatsApp,
  disconnectWhatsApp,
  getChatbotStatus,
  getConversations,
  getConversation,
  sendMessage,
  convertToClient,
  assignConversation,
  closeConversation,
  getChatbotStats
} = require('../controllers/chatbotController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.post('/initialize', initializeChatbot);
router.post('/connect', connectWhatsApp);
router.post('/disconnect', disconnectWhatsApp);
router.get('/qr', getQRCode);
router.get('/status', getChatbotStatus);
router.get('/stats', getChatbotStats);
router.post('/send', sendMessage);

router.route('/conversations')
  .get(getConversations);

router.route('/conversations/:id')
  .get(getConversation);

router.post('/conversations/:id/convert', convertToClient);
router.put('/conversations/:id/assign', assignConversation);
router.put('/conversations/:id/close', closeConversation);

module.exports = router;
