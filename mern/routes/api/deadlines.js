const express = require('express');
const router = express.Router();
const Deadline = require('../../models/Deadline');

router.get('/', async (req, res) => {
  if (req.session.userId) {
    const user = await User.findOne({ username: req.session.userId }).exec();
    const userDeadline = await Deadline.findOne({ userId: user._id }).exec();

    if (!userDeadline) {
      const deadlineObj = await Deadline.create({
        userId: user._id
      });

      res.json(deadlineObj.deadline);
    } else {
      res.json(userDeadline);
    }
  } else {
    res.status(403).json({ error: 'could not retrieve deadline' })
  }
})

router.put('/:id', async (req, res) => {
  Deadline.findByIdAndUpdate(req.params.id, { $set: { deadline: req.body.deadline, timePosted: new Date } })
    .then(deadline => {
      res.json({ message: 'deadline updated!' })
    })
    .catch(err => console.log('could not update deadline'));
})

module.exports = router;