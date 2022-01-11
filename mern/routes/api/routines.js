const express = require('express');
const cors = require('cors');
const router = express.Router();
const Routine = require('../../models/Routine.js');
const bcrypt = require('bcryptjs');


router.get('/', async (req, res) => {

  if (req.session.userId) {
    const user = await User.findOne({ username: req.session.userId }).exec();
    const routines = await Routine.find({ userId: user._id }).exec();

    res.json(routines);
  } else {
    res.status(403);
    res.json({ message: 'couldnt fetch' });
  }
  res.end();
});


router.get('/:id', (req, res) => {
  Routine.findById(req.params.id)
    .then(routine => res.json(routine))
    .catch(err => res.status(404).json({ routinenotfound: 'Routine not found' }));
})

router.post('/', async (req, res) => {

  const username = req.session.userId;
  const user = await User.findOne({ username }).exec();
  const routine = req.body;

  await Routine.create({
    userId: user._id,
    // gratitude, values, value_affirmation, type_of_meditation, minutes_spent, date
    routineItems: routine
  })
    .then(routine => res.json({ confirm: 'Routine added!' }))
    .catch(err => res.status(400).json({ processingerror: 'I couldnt add this routine' }))

});


router.put('/', (req, res) => {
  Routine.findByIdAndUpdate(req.params.id, req.body)
    .then(routine => res.json({ updatesuccessful: 'entry updated!' }))
    .catch(err => res.status().json({ couldnotdelete: 'I couldnt update this routine' }))
})

router.delete('/:id', (req, res) => {
  Routine.findByIdAndRemove(req.params.id)
    .then()
    .catch()
})


module.exports = router;