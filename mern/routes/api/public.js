const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  if (req.session.userId) {
    const user = await User.findOne({ username: req.session.userId }).exec();

    res.json(user.public);
  } else {
    res.status(403).json({ error: 'could not retrieve user public status' })
  }
})

router.put('/:id', async (req, res) => {
  console.log('params', req.params.id);
  console.log('body', req.body.isPublic);

  User.findByIdAndUpdate(
    req.params.id,
    { $set: { public: req.body.isPublic } }
  )
    .then(res => console.log('updated privacy status'))
    .catch(err => console.log('could not update privacy'))
})

module.exports = router;