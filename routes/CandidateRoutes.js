const express = require('express');
const router = express.Router();

require('dotenv').config()

const {AddCandidates,updateCandidate,deleteCandidate,voteCandidate,voteCount,getAllCandidates} = 
require('../controllers/Candidate');
const {jwtAuthMiddleware} = require('../middlewares/jwtAuth');

router.post('/add',jwtAuthMiddleware,AddCandidates);
router.put('/update/:candidateId',jwtAuthMiddleware,updateCandidate);
router.delete('/delete/:candidateId',jwtAuthMiddleware,deleteCandidate);
router.post('/vote/:candidateId',jwtAuthMiddleware,voteCandidate);
router.get('/votecount',voteCount);
router.get('/Allcandidates',getAllCandidates);

module.exports = router;