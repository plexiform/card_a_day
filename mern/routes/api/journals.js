const express = require('express');
const router = express.Router();
const Journal = require('../../models/Journal');
const ThreeGoodThings = require('../../models/ThreeGoodThings');

router.post('/journal', async (req, res) => {
  if (req.session.userId) {
    const user = await User.findOne({ username: req.session.userId }).exec();
    const entry = req.body.journalEntry;
    const values = req.body.values;

    await Journal.create({
      userId: user._id,
      journalEntry: entry,
      values,
      date: new Date(Date.now())
    })
      .then(journal => res.json({ confirm: 'journal entry created!' }))
      .catch(err => res.status(400).json({ processingerror: 'I couldnt add this entry' }))

  } else {
    res.status(400).json({ message: 'could not post journal entry' })
  }
});

router.get('/entries', async (req, res) => {
  if (req.session.userId) {
    const user = await User.findOne({ username: req.session.userId }).exec();
    const entries = await Journal.find({ userId: user._id }).exec();

    entries.sort((a, b) => b.date - a.date);
    res.json(entries);
  } else {
    res.status(403).json({ message: 'could not retrieve entries' })
  }
})

// :id is username
router.get('/entries/:id', async (req, res) => {
  const user = await User.findOne({ username: req.params.id }).exec();

  const entries = await Journal.find({ userId: user._id }).exec();
  entries.sort((a, b) => b.date - a.date);
  res.json(entries);
})

router.get('/threegoodthings/:date', async (req, res) => {
  if (req.session.userId) {
    const user = await User.findOne({ username: req.session.userId }).exec();
    const date = req.params.date;

    const threeGoodThings =
      await ThreeGoodThings.find({
        userId: user._id,
      }).exec();

    res.json(threeGoodThings);
  } else {
    res.status(403).json({ message: 'could not retrieve 3 good things' })
  }
});

router.post('/threegoodthings', async (req, res) => {
  if (req.session.userId) {
    const user = await User.findOne({ username: req.session.userId }).exec();
    const { first, second, third } = req.body;

    await ThreeGoodThings.create({
      userId: user._id,
      first: {
        goodThing: first.goodThing,
        cause: first.cause
      },
      second: {
        goodThing: second.goodThing,
        cause: second.cause
      },
      third: {
        goodThing: third.goodThing,
        cause: third.cause
      }
    })
  } else {
    res.status(400).json({ message: 'could not enter three good things' })
  }
});

module.exports = router;