const express = require('express');
const router = express.Router();
const Journal = require('../../models/Journal');
const ThreeGoodThings = require('../../models/ThreeGoodThings');

router.post('/journal', async (req, res) => {
  if (req.session.userId) {
    const user = await User.findOne({ username: req.session.userId }).exec();
    const entry = req.body.journalEntry;
    console.log('testbod', req.body);

    await Journal.create({
      userId: user._id,
      journalEntry: entry,
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

    res.json(entries);
  } else {
    res.status(403).json({ message: 'could not retrieve entries' })
  }
})

router.post('/threegoodthings', async (req, res) => {

});

module.exports = router;