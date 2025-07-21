const express = require('express');
const upload = require('../upload');
const teamControllers = require('../controllers/teamControllers');

const router = express.Router();

// Dummy admin middleware (replace with real auth check)
const isAdmin = (req, res, next) => {
  // e.g., if (req.user && req.user.isAdmin) return next();
  next();
};

// Create new team member (Admin only)
router.post('/mnb/api/teamMember', isAdmin, upload.single('image'), teamControllers.createTeamMember);

// Get all team members (Public)
router.get('/mnb/api/teamMembers', teamControllers.getTeamMembers);

// Get single team member by ID (Public)
router.get('/mnb/api/teamMember/:id', teamControllers.getTeamMember);

// Update team member by ID (Admin only)
router.put('/mnb/api/teamMember/:id', isAdmin, upload.single('image'), teamControllers.updateTeamMember);

// Delete team member by ID (Admin only)
router.delete('/mnb/api/teamMember/:id', isAdmin, teamControllers.deleteTeamMember);

module.exports = router;
