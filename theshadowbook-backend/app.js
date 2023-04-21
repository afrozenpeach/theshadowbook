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
        res.status(403).send('Unauthorized: Invalid token')
      });
  } else {
    res.status(403).send('Unauthorized: No token')
  }
}

function checkAdmin(req, res, next) {
  if (req.headers.authorization) {
    let authToken = req.headers.authorization.substring(7);
    admin.auth().verifyIdToken(authToken)
      .then(async (decodedToken)=> {
        let user = await models.User.findOne({
          where: {
            firebaseId: decodedToken.uid
          }
        });

        if (user.isAdmin) {
          next()
        } else {
          res.status(403).send('Unauthorized: User not an admin');
        }
      }).catch(() => {
        res.status(403).send('Unauthorized: Invalid token');
      });
  } else {
    res.status(403).send('Unauthorized: No token');
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
});

app.get('/api/crystals', async (req, res) => {
  let crystals = await models.Crystal.findAll({
    include: [
      {as: "CrystalChakras", model: sequelize.model('CrystalChakra')},
      {as: "CrystalCleansings", model: sequelize.model('CrystalCleansing')},
      {as: "CrystalDomains", model: sequelize.model('CrystalDomain')},
      {as: "CrystalElements", model: sequelize.model('CrystalElement')},
      {as: "CrystalMoonPhases", model: sequelize.model('CrystalMoonPhase')},
      {as: "CrystalZodiacs", model: sequelize.model('CrystalZodiac')},
    ]
  });

  res.json({
    crystals: crystals.map((c) => c.dataValues)
  });
});

app.get('/api/cleansings', async (req, res) => {
  let cleansings = await models.Cleansing.findAll({
    order: [['cleansing', 'ASC']]
  });

  res.json({
    cleansings: cleansings.map((c) => c.dataValues)
  });
});

app.get('/api/chakras', async (req, res) => {
  let chakras = await models.Chakra.findAll({
    order: [['chakra', 'ASC']]
  });

  res.json({
    chakras: chakras.map((c) => c.dataValues)
  });
});

app.get('/api/domains', async (req, res) => {
  let domains = await models.Domain.findAll({
    order: [['domain', 'ASC']]
  });

  res.json({
    domains: domains.map((d) => d.dataValues)
  });
});

app.get('/api/elements', async (req, res) => {
  let elements = await models.Element.findAll({
    order: [['element', 'ASC']]
  });

  res.json({
    elements: elements.map((e) => e.dataValues)
  });
});

app.get('/api/moonPhases', async (req, res) => {
  let moonPhases = await models.MoonPhase.findAll({
    order: [['moonPhase', 'ASC']]
  });

  res.json({
    moonPhases: moonPhases.map((m) => m.dataValues)
  });
});

app.get('/api/zodiac', async (req, res) => {
  let zodiacs = await models.Zodiac.findAll({
    order: [['sign', 'ASC']]
  });

  res.json({
    zodiacs: zodiacs.map((z) => z.dataValues)
  });
});

app.get('/api/crystals/:name', async (req, res) => {
  let queryString = {
      crystal: req.params.name
  };

  if (parseInt(req.params.name)) {
    queryString = {
        id: req.params.name
    };
  }

  let crystal = await models.Crystal.findOne({
    where: queryString,
    include: [
      {as: "CrystalChakras", model: sequelize.model('CrystalChakra')},
      {as: "CrystalCleansings", model: sequelize.model('CrystalCleansing')},
      {as: "CrystalDomains", model: sequelize.model('CrystalDomain')},
      {as: "CrystalElements", model: sequelize.model('CrystalElement')},
      {as: "CrystalMoonPhases", model: sequelize.model('CrystalMoonPhase')},
      {as: "CrystalZodiacs", model: sequelize.model('CrystalZodiac')},
    ],
    order: [['crystal', 'ASC']]
  });

  if (crystal) {
    res.json({
      crystal: crystal.dataValues
    });
  } else {
    res.json({
      crystal: null
    })
  }
});

app.put('/api/crystals/:id', checkAdmin, async (req, res) => {
  try {

    const result = await sequelize.transaction(async (t) => {
      await models.Crystal.update(
        { crystal: req.body.crystal.crystal },
        {
          where: { id: req.body.crystal.id },
          transaction: t
        },
      );

      await models.CrystalChakra.destroy(
        {
          where: { crystalId: req.body.crystal.id },
          transaction: t
        }
      );

      for (let c of req.body.crystal.chakras) {
        await models.CrystalChakra.create(
          {
            crystalId: req.body.crystal.id,
            chakraId: c
          },
          { transaction: t }
        );
      }

      await models.CrystalCleansing.destroy(
        {
          where: { crystalId: req.body.crystal.id },
          transaction: t
        }
      );

      for (let c of req.body.crystal.cleansings) {
        await models.CrystalCleansing.create(
          {
            crystalId: req.body.crystal.id,
            cleansingId: c
          },
          { transaction: t }
        );
      }

      await models.CrystalDomain.destroy(
        {
          where: { crystalId: req.body.crystal.id },
          transaction: t
        }
      );

      for (let d of req.body.crystal.domains) {
        await models.CrystalDomain.create(
          {
            crystalId: req.body.crystal.id,
            domainId: d
          },
          { transaction: t }
        );
      }

      await models.CrystalElement.destroy(
        {
          where: { crystalId: req.body.crystal.id },
          transaction: t
        }
      );

      for (let e of req.body.crystal.elements) {
        await models.CrystalElement.create(
          {
            crystalId: req.body.crystal.id,
            elementId: e
          },
          { transaction: t }
        );
      }

      await models.CrystalMoonPhase.destroy(
        {
          where: { crystalId: req.body.crystal.id },
          transaction: t
        }
      );

      for (let m of req.body.crystal.moonPhases) {
        await models.CrystalMoonPhase.create(
          {
            crystalId: req.body.crystal.id,
            moonPhaseId: m
          },
          { transaction: t }
        );
      }

      await models.CrystalZodiac.destroy(
        {
          where: { crystalId: req.body.crystal.id },
          transaction: t
        }
      );

      for (let z of req.body.crystal.zodiacs) {
        await models.CrystalZodiac.create(
          {
            crystalId: req.body.crystal.id,
            zodiacId: z
          },
          { transaction: t }
        );
      }

      return true;
    });

    if (result) {
      res.json({success: true});
    }
  } catch (error) {
    res.json({success: false});
  }
});

app.post('/api/crystals', checkAdmin, async (req, res) => {
  try {

    const result = await sequelize.transaction(async (t) => {
      let crystal = await models.Crystal.create(
        { crystal: req.body.crystal.crystal },
        {
          transaction: t
        },
      );

      for (let c of req.body.crystal.chakras) {
        await models.CrystalChakra.create(
          {
            crystalId: crystal.id,
            chakraId: c
          },
          { transaction: t }
        );
      }

      for (let c of req.body.crystal.cleansings) {
        await models.CrystalCleansing.create(
          {
            crystalId: crystal.id,
            cleansingId: c
          },
          { transaction: t }
        );
      }

      for (let d of req.body.crystal.domains) {
        await models.CrystalDomain.create(
          {
            crystalId: crystal.id,
            domainId: d
          },
          { transaction: t }
        );
      }

      for (let e of req.body.crystal.elements) {
        await models.CrystalElement.create(
          {
            crystalId: crystal.id,
            elementId: e
          },
          { transaction: t }
        );
      }

      for (let m of req.body.crystal.moonPhases) {
        await models.CrystalMoonPhase.create(
          {
            crystalId: crystal.id,
            moonPhaseId: m
          },
          { transaction: t }
        );
      }

      for (let z of req.body.crystal.zodiacs) {
        await models.CrystalZodiac.create(
          {
            crystalId: crystal.id,
            zodiacId: z
          },
          { transaction: t }
        );
      }

      return true;
    });

    if (result) {
      res.json({success: true});
    } else {
      res.json({success: false});
    }
  } catch (error) {
    res.json({success: false, error: error});
  }
});

module.exports = app;