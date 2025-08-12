const express = require('express');
const router = express.Router();
const workerController = require('../controllers/workerControllers');
const upload = require('../multer');

router.post('/mnb/api/worker', upload.single('photo'), workerController.createWorker);
router.get('/mnb/api/workers', workerController.getWorkers);
router.put('/mnb/api/updateWorker/:id', upload.single('photo'), workerController.updateWorker);
router.delete('/mnb/api/deleteWorker/:id', workerController.deleteWorker);

module.exports = router;
