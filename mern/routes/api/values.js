const express = require('express');
const router = express.Router();
const Value = require('../../models/Value.js');

router.post('/', async (req, res) => {
  const username = req.session.userId;
  const user = await User.findOne({ username }).exec();

  await Value.create({
    userId: user._id,
    valueAndReason: req.body
  })
    .then(value => res.json({ confirm: 'value added!' }))
    .catch(err => res.status(400).json({ errormessage: 'could not add value' }))
});

router.get('/', async (req, res) => {
  if (req.session.userId) {
    const user = await User.findOne({ username: req.session.userId }).exec();
    const values = await Value.find({ userId: user._id }).exec();

    res.json(values);
  } else {
    res.status(403).json({ err: 'couldnt retrieve values' });
  }
})

router.delete('/:id', async (req, res) => {
  console.log('u have reached delete')
  Value.findByIdAndRemove(req.params.id, req.body)
    .then(value => res.json({ msg: 'value successfully deleted' }))
    .catch(err => res.status(404).json({ error: 'no such value' }))
});

module.exports = router;