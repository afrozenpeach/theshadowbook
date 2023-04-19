var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors')
const admin = require('firebase-admin')
const serviceAccount = require("./config/fbServiceAccountKey.json");
const { Sequelize } = require('sequelize');
const { configure } = require('sequelize-pg-utilities');
const config = require('./config/config.json');
const { name, user, password, options } = configure(config)
const sequelize = new Sequelize(name, user, password, options);
const { Op } = require("sequelize");
var initModels = require("./models/init-models");
var models = initModels(sequelize);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

var app = express();

app.use(cors())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

function checkAuth(req, res, next) {
  if (req.headers.authorization) {
    let authToken = req.headers.authorization.substring(7);
    admin.auth().verifyIdToken(authToken)
      .then(() => {
        next()
      }).catch(() => {
        res.status(403).send('Unauthorized')
      });
  } else {
    res.status(403).send('Unauthorized')
  }
}

app.use('/api/', checkAuth)

app.get('/api/user/:uid', async (req, res) => {
  let users = await models.User.findAll({
    where: {
      firebaseId: req.params.uid
    }
  });

  res.json({
    user: users[0]
  });
});

app.post('/api/user', async (req, res) => {
  await models.User.create({
    email: req.body.email,
    firebaseId: req.body.uid
  })
});

app.put('/api/user', async (req, res) => {
  await models.User.update({
    name: req.body.name,
    email: req.body.email,
    profile: req.body.profile,
    sunSign: req.body.sunSign,
    moonSign: req.body.moonSign,
    risingSign: req.body.risingSign
  }, {
    where: {
      id: req.body.id
    }
  })
});

app.put('/api/user/email', async (req, res) => {
  await models.User.update({
    email: req.body.email
  }, {
    where: {
      id: req.body.id
    }
  })
});

app.get('/api/zodiac', async (req, res) => {
  let zodiac = await models.Zodiac.findAll({
    order: [
      ['sign', 'ASC']
    ]
  });

  res.json({
    zodiac: zodiac
  });
});

app.get('/api/user/checkName/:name/:id', async (req, res) => {
  let users = await models.User.findAll({
    attributes: ['name', 'firebaseid'],
    where: {
      [Op.and]: [
        { name: req.params.name },
        {
          firebaseid: {
            [Op.ne]: req.params.id
          }
        }
      ]
    }
  });

  res.json({
    isValid: users.length === 0
  });
})

module.exports = app;