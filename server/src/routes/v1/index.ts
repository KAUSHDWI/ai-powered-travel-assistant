import { Router } from 'express';
import chatRoutes from './chat.routes.js';
import leadRoutes from './lead.routes.js';
import authRoutes from './auth.routes.js';

const router = Router();

router.use('/chat', chatRoutes);
router.use('/', leadRoutes);
router.use('/auth', authRoutes);

export default router;
