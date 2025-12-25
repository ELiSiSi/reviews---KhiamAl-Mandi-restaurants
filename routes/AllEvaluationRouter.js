import express from 'express';
import { AllEvaluation , deleteAllEvaluations} from '../servers/AllEvaluationServer.js';



const router = express.Router();

router.get('/all-evaluation', AllEvaluation);
router.delete('/api/deleteall', deleteAllEvaluations);

export default router;
