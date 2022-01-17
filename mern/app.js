const express = require('express');
const app = express();
const connectToDB = require('./config/db');
const cors = require('cors');

const routines = require('./routes/api/routines');
const schedules = require('./routes/api/schedules');
const values = require('./routes/api/values');
const goals = require('./routes/api/goals');

const User = require('./models/User');
const cookieParser = require('cookie-parser');
const { response } = require('express');
const bcrypt = require('bcryptjs');
const session = require('express-session');
//const db = config.get('mongoURI');

require("dotenv").config();
const MongoDBStore = require('connect-mongodb-session')(session);

const path = require("path");

const store = new MongoDBStore({
  uri: process.env.mongoURI,
  collection: "mySessions"
});

connectToDB();

app.use(cors({ origin: true, credentials: true }));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(session({
  secret: "secrettunnelsecrettunnel",
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 24 },
  store: store,
  resave: false,
  unset: 'destroy'
}));


app.use('/api/routines', routines);
app.use('/api/schedules', schedules);
app.use('/api/values', values);
app.use('/api/goals', goals);
app.use('/api/journals', journals); // access to journals + threeGoodThings entries

// changed '/' to '/api' to prevent conflict on heroku
app.get('/api', (req, res) => {
  //console.log('id:', req.session)
  console.log('server port', process.env.PORT);
  if (req.session.userId) {
    res.json(req.session.userId);
  } else {
    res.json({ message: 'no id!' });
  }
});

app.get('/api/cards', async (req, res) => {
  // cards: { date: { routines: [], schedules: [] } }
  // const cards = {};

  const cards =
    [
      ['January', {}],
      ['February', {}],
      ['March', {}],
      ['April', {}],
      ['May', {}],
      ['June', {}],
      ['July', {}],
      ['August', {}],
      ['September', {}],
      ['October', {}],
      ['November', {}],
      ['December', {}]
    ];

  const generateCalendarMonth = (monthNo, year) => {
    const months = {
      1: 31, 2: 29, 3: 31, 4: 30, 5: 31, 6: 30, 7: 31, 8: 31, 9: 30, 10: 31, 11: 30, 12: 31
    }

    const addZero = (num) => String(num).length < 2 ? `0${num}` : num;

    for (i = 1; i <= months[Number(monthNo)]; i++) {
      const date = `${year}-${addZero(monthNo)}-${addZero(i)}`

      cards[monthNo - 1][1][date] = {};

      // if the date.routines property doesn't exist...
      if (!!cards[monthNo - 1][1][date].routines === false) {
        cards[monthNo - 1][1][date].routines = [];
      }
      // if the date.schedules property doesn't exist...
      if (!!cards[monthNo - 1][1][date].schedules === false) {
        cards[monthNo - 1][1][date].schedules = [];
      }
    }

    return cards;
  }

  if (req.session.userId) {
    const user = await User.findOne({ username: req.session.userId }).exec();
    const routines = await Routine.find({ userId: user._id }).exec();
    const schedules = await Schedule.find({ userId: user._id }).exec();

    //schedule -> timeBlock -> startTime
    //routine -> routineItems -> date

    const convertFromUtc = (fullDate) => {
      // fullDate is a Date object
      const toISO = fullDate.toISOString();
      const tzoffset = (new Date()).getTimezoneOffset() * 60000;
      const date = (new Date(new Date(toISO).getTime() - tzoffset)).toISOString();

      return date.substring(0, 10);
    };

    routines.forEach(routine => {
      const date = routine.routineItems.date.toISOString().substring(0, 10);
      const monthNo = date.substring(5, 7);
      const year = date.substring(0, 4);

      if (Object.keys(cards[Number(monthNo - 1)][1]).length === 0) {
        generateCalendarMonth(monthNo, year);
      }

      cards[monthNo - 1][1][date].routines.push(routine);

    });

    schedules.forEach(schedule => {
      const date = convertFromUtc(schedule.timeBlock.startTime);
      const monthNo = date.substring(5, 7);
      const year = date.substring(0, 4);
      /*
      if (monthNo == '01') {
        console.log('hello from Jan (01)!', Boolean(Object.keys(cards[monthNo - 1][1].length === 0)));
      } // TRUE, it is empty, so we call generateCalenderMonth...

      */

      if (Object.keys(cards[monthNo - 1][1]).length === 0) {
        generateCalendarMonth(monthNo, year);
      }


      cards[monthNo - 1][1][date].schedules.push(schedule);

    });

    for (i = 0; i < 12; i++) {
      Object.keys(cards[i][1]).forEach((key) => {
        const currentCard = cards[i][1][key];
        const routines = currentCard.routines;
        const schedules = currentCard.schedules;

        routines.sort((a, b) => a.routineItems.date - b.routineItems.date);
        schedules.sort((a, b) => a.timeBlock.startTime - b.timeBlock.startTime);
      });
    }

    res.json({
      cards
    });

  } else {
    res.status(403);
  }
});

app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username }).exec();
    const isDehashed = bcrypt.compareSync(password, user.password);

    if (!user || !isDehashed) {
      res.status(401);
      res.json({ message: "invalid login" });
      return;
    };

    const session = req.session;
    session.userId = username;

    res.json(session);
  } catch (err) {
    console.log('pass', err);
  }
});

app.post('/logout', (req, res) => {
  req.session.destroy();
  res.end();
  //res.redirect('/login');
  //console.log('AFTER:', req.session);
});

app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username }).exec();
  if (user) {
    res.status(500);
    res.json({
      message: 'user already exists'
    });
    return;
  }

  const hashedPw = bcrypt.hashSync(password);
  //User.create({ username, password });
  await User.create({
    username: username,
    password: hashedPw
  });

  res.json({
    message: 'successs'
  })
});


const port = process.env.PORT || 8082;

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.resolve(__dirname, "../client/build/")));

  app.get("/*", function (request, response) {
    response.sendFile(path.resolve(__dirname, "../client/build/", "index.html"));
  });
}

app.listen(port, () => console.log(`Listening on port ${port}`));


