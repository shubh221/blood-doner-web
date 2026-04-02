const User = require('../models/User');

// @route   GET /api/donors?bloodGroup=&location=
// @access  Private
const getDonors = async (req, res) => {
  const { bloodGroup, location } = req.query;

  // Build query - only return users who are donors
  const query = { isDonor: true };

  if (bloodGroup) {
    query.bloodGroup = bloodGroup; // Exact match
  }

  if (location) {
    // Case-insensitive partial match
    query.location = { $regex: location, $options: 'i' };
  }

  try {
    const donors = await User.find(query).select('name bloodGroup contact location -_id');
    res.json(donors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getDonors };
