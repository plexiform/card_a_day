const express = require('express');
const router = express.Router();
const Goal = require('../../models/Goal.js');

router.post('/', async (req, res) => {
  const username = req.session.userId;
  const user = await User.findOne({ username }).exec();

  await Goal.create({
    userId: user._id,
    goalName: req.body.goal
  })
    .then(goal => res.json({ confirm: 'goal added!' }))
    .catch(err => res.status(400).json({ errormessage: 'could not add goal' }))
});

router.get('/', async (req, res) => {
  if (req.session.userId) {
    const user = await User.findOne({ username: req.session.userId }).exec();
    const goals = await Goal.find({ userId: user._id }).exec();

    res.json(goals);
  } else {
    res.status(403).json({ err: 'couldnt retrieve goals' });
  }
});
//{ $push: { friends: objFriends } },

router.put('/', async (req, res) => {
  await Goal.findOneAndUpdate(
    { goalName: req.body.goal },
    {
      $push: { goalTags: req.body.schedId },
    },
    { useFindAndModify: false })
    .then(res.json({ confirm: 'timeblock added to goals' }))
    .catch(err => res.status(400).json({ error: 'yikes' }))

});

module.exports = router;