const { Router } = require('express');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const Schedule = require('../../models/Schedule.js')

const goals = require('./goals.js');

router.use('/api/goals', goals);

router.get('/', async (req, res) => {
  if (req.session.userId) {
    const user = await User.findOne({ username: req.session.userId }).exec();
    const timeBlocks = await Schedule.find({ userId: user._id }).exec();
    res.json(timeBlocks);
  }
  res.end();
})

router.get('/:id', async (req, res) => {
  const id = req.params.id;
  const taggedScheds = await Schedule.findById(id);

  res.json(taggedScheds);
});

router.post('/aggregate', async (req, res) => {
  const user = await User.findOne({ username: req.session.userId }).exec();

  const dateToday = req.body.date;
  const tomorrow = new Date();
  tomorrow.setDate(new Date(dateToday).getDate() + 1);

  if (req.session.userId) {

    const schedules = await Schedule.find(
      {
        $and: [
          { userId: user._id },
          {
            'timeBlock.startTime': {
              $gte: new Date(dateToday),
              $lt: new Date(tomorrow)
            }
          }
        ]
      }).exec();

    // req.body.date;
    const averagePercent = schedules.reduce((sum, curr) => {
      return sum + curr.percentPomos;
    }, 0) / schedules.length;

    res.json(averagePercent);
  } else {
    res.status(403)
  }
})

router.post('/', async (req, res) => {
  const username = req.session.userId;
  const user = await User.findOne({ username }).exec();
  const timeBlock = req.body;
  const percentPomos = 0;

  await Schedule.create({
    userId: user._id,
    timeBlock: timeBlock,
    percentPomos: percentPomos,
    finished: false
  })
    .then(sched => {
      res.json(sched)
    })
    .catch(err => res.status(400).json({ processingerror: 'couldnt add schedule' }))
})

router.put('/api/goals/:id', (req, res) => {

});


router.put('/:id', (req, res) => {
  const percentPomos = (req.body.sched.numPomos / req.body.sched.maxPomos) * 100;
  const data = {
    userId: req.body.userId,
    timeBlock: req.body.sched,
    percentPomos,
    finished: req.body.finished
  }

  Schedule.findByIdAndUpdate(req.params.id, { $set: data })
    .then(schedule => {
      res.json({ message: "update successful!" })
    })
    .catch(err => res.status({ error: "couldnt update entry" }))
});

module.exports = router;