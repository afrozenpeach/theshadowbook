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
const { get } = require('http');
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
          next();
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

app.use('/api/user', checkAuth)

app.get('/api/user/:uid', async (req, res) => {
  let idToken = req.headers.authorization.substring(7);
  admin.auth().verifyIdToken(idToken).then(async d => {
    if (req.params.uid === d.uid) {
      let users = await models.User.findAll({
        where: {
          firebaseId: req.params.uid
        }
      });

      res.json({
        user: users[0]
      });
    } else {
      res.status(403).send('Unauthorized: UID does not match token.');
    }
  });
});

app.post('/api/user', async (req, res) => {
  let idToken = req.headers.authorization.substring(7);
  admin.auth().verifyIdToken(idToken).then(async d => {
    if (req.body.uid === d.uid) {
      await models.User.create({
        email: req.body.email,
        firebaseId: req.body.uid
      })

      let user = await models.User.findOne({
        where: {
          firebaseId: req.body.uid
        }
      });

      res.json({
        user: user
      });
    } else {
      res.status(403).send('Unauthorized: UID does not match token.');
    }
  });
});

app.put('/api/user', async (req, res) => {
  let idToken = req.headers.authorization.substring(7);
  admin.auth().verifyIdToken(idToken).then(async d => {
    let user = await models.User.findOne({
      where: {
        firebaseId: d.uid
      }
    });

    if (user.id === req.body.id) {
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
      });

      res.json({success: true});
    } else {
      res.status(403).send('Unauthorized: UID does not match token.');
    }
  });
});

app.put('/api/user/email', async (req, res) => {
  let idToken = req.headers.authorization.substring(7);
  admin.auth().verifyIdToken(idToken).then(async d => {
    let user = await models.User.findOne({
      where: {
        firebaseId: d.uid
      }
    });

    if (user.id === req.body.id) {
      await models.User.update({
        email: req.body.email
      }, {
        where: {
          id: req.body.id
        }
      });

      res.json({success: true});
    } else {
      res.status(403).send('Unauthorized: UID does not match token.');
    }
  });
});

app.get('/api/user/checkName/:name/:id', async (req, res) => {
  try {
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
  } catch (error) {
    res.json({success: false, error: error});
  }
});

app.get('/api/crystals', async (req, res) => {
  try {
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
  } catch (error) {
    res.json({success: false, error: error});
  }
});

app.get('/api/cleansings', async (req, res) => {
  try {
    let cleansings = await models.Cleansing.findAll({
      order: [['cleansing', 'ASC']]
    });

    res.json({
      cleansings: cleansings.map((c) => c.dataValues)
    });
  } catch (error) {
    res.json({success: false, error: error});
  }
});

app.get('/api/chakras', async (req, res) => {
  try {
    let chakras = await models.Chakra.findAll({
      order: [['chakra', 'ASC']]
    });

    res.json({
      chakras: chakras.map((c) => c.dataValues)
    });
  } catch (error) {
    res.json({success: false, error: error});
  }
});

app.get('/api/domains', async (req, res) => {
  try {
    let domains = await models.Domain.findAll({
      order: [['domain', 'ASC']]
    });

    res.json({
      domains: domains.map((d) => d.dataValues)
    });
  } catch (error) {
    res.json({success: false, error: error});
  }
});

app.get('/api/elements', async (req, res) => {
  try {
    let elements = await models.Element.findAll({
      order: [['element', 'ASC']]
    });

    res.json({
      elements: elements.map((e) => e.dataValues)
    });
  } catch (error) {
    res.json({success: false, error: error});
  }
});

app.get('/api/moonPhases', async (req, res) => {
  try {
    let moonPhases = await models.MoonPhase.findAll({
      order: [['moonPhase', 'ASC']]
    });

    res.json({
      moonPhases: moonPhases.map((m) => m.dataValues)
    });
  } catch (error) {
    res.json({success: false, error: error});
  }
});

app.get('/api/zodiac', async (req, res) => {
  try {
    let zodiacs = await models.Zodiac.findAll({
      order: [['sign', 'ASC']]
    });

    res.json({
      zodiacs: zodiacs.map((z) => z.dataValues)
    });
  } catch (error) {
    res.json({success: false, error: error});
  }
});

app.get('/api/crystals/:name/:subType', async (req, res) => {
  let crystalQueryString = {
    crystal: req.params.name
  }

  if (parseInt(req.params.name)) {
    crystalQueryString = {
        id: req.params.name
    };
  }

  let crystal = await models.Crystal.findOne({
    where: crystalQueryString,
    order: [['crystal', 'ASC']]
  });

  let subTypeQueryString = {
      crystal: crystal.id,
      type: req.params.subType
  };

  if (parseInt(req.params.subType)) {
    subTypeQueryString = {
        id: req.params.subType
    };
  }

  let crystalSubType = await models.CrystalSubType.findOne({
    where: subTypeQueryString,
    order: [['crystal', 'ASC']]
  });

  let returnValue = crystalSubType.dataValues;
  returnValue.Crystal = crystal.dataValues;

  returnValue.CrystalChakras = await models.CrystalChakra.findAll({
    where: {
      crystalId: crystalSubType.id,
      subType: null
    }
  });

  returnValue.CrystalCleansings = await models.CrystalCleansing.findAll({
    where: {
      crystalId: crystalSubType.id,
      subType: null
    }
  });

  returnValue.CrystalDomains = await models.CrystalDomain.findAll({
    where: {
      crystalId: crystalSubType.id,
      subType: null
    }
  });

  returnValue.CrystalElements = await models.CrystalElement.findAll({
    where: {
      crystalId: crystalSubType.id,
      subType: null
    }
  });

  returnValue.CrystalMoonPhases = await models.CrystalMoonPhase.findAll({
    where: {
      crystalId: crystalSubType.id,
      subType: null
    }
  });

  returnValue.CrystalZodiacs = await models.CrystalZodiac.findAll({
    where: {
      crystalId: crystal.id,
      subType: null
    }
  });

  if (crystalSubType) {
    res.json({
      crystal: returnValue
    });
  } else {
    res.json({
      crystal: null
    })
  }
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
      {as: "CrystalSubTypes", model: sequelize.model('CrystalSubType')}
    ],
    order: [['crystal', 'ASC']]
  });

  let returnValue = crystal.dataValues;

  returnValue.CrystalChakras = await models.CrystalChakra.findAll({
    where: {
      crystalId: crystal.id,
      subType: null
    }
  });

  returnValue.CrystalCleansings = await models.CrystalCleansing.findAll({
    where: {
      crystalId: crystal.id,
      subType: null
    }
  });

  returnValue.CrystalDomains = await models.CrystalDomain.findAll({
    where: {
      crystalId: crystal.id,
      subType: null
    }
  });

  returnValue.CrystalElements = await models.CrystalElement.findAll({
    where: {
      crystalId: crystal.id,
      subType: null
    }
  });

  returnValue.CrystalMoonPhases = await models.CrystalMoonPhase.findAll({
    where: {
      crystalId: crystal.id,
      subType: null
    }
  });

  returnValue.CrystalZodiacs = await models.CrystalZodiac.findAll({
    where: {
      crystalId: crystal.id,
      subType: null
    }
  });

  if (crystal) {
    res.json({
      crystal: returnValue
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
    });

    res.json({success: true});
  } catch (error) {
    res.status('500').json({success: false, error: error});
  }
});

app.post('/api/collection/crystals/', checkAuth, async (req, res) => {
  let idToken = req.headers.authorization.substring(7);
  admin.auth().verifyIdToken(idToken).then(async d => {
    let user = await models.User.findOne({
      where: {
        firebaseId: d.uid
      }
    });

    if (user.id === req.body.userId) {
      try {
        const crystal = await models.UserCrystal.create({
          owner: req.body.userId,
          crystal: req.body.id,
          status: req.body.status
        });

        res.json({success: true, crystal: crystal});
      } catch (error) {
        res.json({success: false, error: error});
      }
    } else {
      res.status(403).send('Unauthorized: UID does not match token.');
    }
  });
});

app.get('/api/collection/crystals/:userId', async (req, res) => {
  try {
    const crystals = await models.UserCrystal.findAll({
      where: {
        owner: req.params.userId
      }
    });

    res.json({success: true, crystals: crystals});
  } catch (error) {
    res.json({success: false, error: error});
  }
});

app.put('/api/collection/crystals', checkAuth, async (req, res) => {
  let idToken = req.headers.authorization.substring(7);
  admin.auth().verifyIdToken(idToken).then(async d => {
    let userCrystal = await models.UserCrystal.findOne({
      where: {
        id: req.body.id
      }
    });

    let user = await models.User.findOne({
      where: {
        firebaseId: d.uid
      }
    });

    if (userCrystal.owner === user.id) {
      await models.UserCrystal.update({
        id: req.body.id,
        name: req.body.name,
        primaryColor: req.body.primaryColor,
        secondaryColor: req.body.secondaryColor,
        teriaryColor: req.body.teriaryColor,
        aura: req.body.aura,
        sizeX: req.body.sizeX,
        sizeY: req.body.sizeY,
        sizeZ: req.body.sizeZ,
        weight: req.body.weight,
        karat: req.body.karat,
        status: req.body.status,
        shape: req.body.shape,
        notes: req.body.notes,
        subType: req.body.subType
      }, {
        where: {
          id: req.body.id
        }
      });

      res.json({success: true});
    } else {
      res.status(403).send('Unauthorized: UID does not match token.');
    }
  });
});

app.get('/api/colors', async (req, res) => {
  try {
    const colors = await models.Color.findAll({
      order: [['color', 'ASC']]
    });

    res.json({success: true, colors: colors});
  } catch (error) {
    res.json({success: false, error: error});
  }
});

app.get('/api/statuses', async (req, res) => {
  try {
    const statuses = await models.Status.findAll({
      order: [['status', 'ASC']]
    });

    res.json({success: true, statuses: statuses});
  } catch (error) {
    res.json({success: false, error: error});
  }
});

app.delete('/api/collection/crystals/:id', checkAuth, async (req, res) => {
  let idToken = req.headers.authorization.substring(7);
  admin.auth().verifyIdToken(idToken).then(async d => {
    let userCrystal = await models.UserCrystal.findOne({
      where: {
        id: req.params.id
      }
    });

    let user = await models.User.findOne({
      where: {
        firebaseId: d.uid
      }
    });

    if (userCrystal.owner === user.id) {
      try {
        await models.UserCrystal.destroy({
          where: {
            id: req.params.id
          }
        });

        res.json({succes: true});
      } catch (error) {
        res.json({success: false, error: error});
      }
    } else {
      res.status(403).send('Unauthorized: UID does not match token.');
    }
  });
});

app.get('/api/shapes', async (req, res) => {
  try {
    const shapes = await models.Shape.findAll({
      order: [['shape', 'ASC']]
    });

    res.json({success: true, shapes: shapes});
  } catch (error) {
    res.json({success: false, error: error});
  }
});

app.get('/api/decks', async (req, res) => {
  try {
    const decks = await models.Deck.findAll({
      order: [['name', 'ASC']]
    });

    res.json({success: true, decks: decks});
  } catch (error) {
    res.json({success: false, error: error});
  }
});

app.post('/api/collection/decks/', checkAuth, async (req, res) => {
  let idToken = req.headers.authorization.substring(7);
  admin.auth().verifyIdToken(idToken).then(async d => {
    let userDeck = await models.UserDeck.findOne({
      where: {
        id: req.body.id
      }
    });

    let user = await models.User.findOne({
      where: {
        firebaseId: d.uid
      }
    });

    if (userDeck.owner === user.id) {
      try {
        const deck = await models.UserDeck.create({
          owner: req.body.userId,
          deck: req.body.id,
          status: req.body.status
        });

        res.json({success: true, deck: deck});
      } catch (error) {
        res.json({success: false, error: error});
      }
    } else {
      res.status(403).send('Unauthorized: UID does not match token.');
    }
  });
});

app.get('/api/collection/decks/:userId', async (req, res) => {
  try {
    const decks = await models.UserDeck.findAll({
      where: {
        owner: req.params.userId
      }
    });

    res.json({success: true, decks: decks});
  } catch (error) {
    res.json({success: false, error: error});
  }
});

app.put('/api/collection/decks', checkAuth, async (req, res) => {
  let idToken = req.headers.authorization.substring(7);
  admin.auth().verifyIdToken(idToken).then(async d => {
    let userDeck = await models.UserDeck.findOne({
      where: {
        id: req.body.id
      }
    });

    let user = await models.User.findOne({
      where: {
        firebaseId: d.uid
      }
    });

    if (userDeck.owner === user.id) {
      await models.UserDeck.update({
        id: req.body.id,
        name: req.body.name,
        status: req.body.status,
        notes: req.body.notes
      }, {
        where: {
          id: req.body.id
        }
      });

      res.json({success: true});
    } else {
      res.status(403).send('Unauthorized: UID does not match token.');
    }
  });
});

app.get('/api/deckTypes', async (req, res) => {
  try {
    let deckTypes = await models.DeckType.findAll({
      order: [['type', 'ASC']]
    });

    res.json({success: true, deckTypes: deckTypes});
  } catch (error) {
    res.json({success: false, error: error});
  }
});

app.post('/api/decks', checkAdmin, async (req, res) => {
  try {
    let deck = await models.Deck.create({
      name: req.body.deck.name,
      author: req.body.deck.author,
      artist: req.body.deck.artist,
      publisher: req.body.deck.publisher,
      type: req.body.deck.type
    });

    if (req.body.deck.type === 1) {
      await models.Card.bulkCreate([
        {
          deck: deck.id,
          name: 'The Fool'
        },
        {
          deck: deck.id,
          name: 'The Magician'
        },
        {
          deck: deck.id,
          name: 'The High Priestess'
        },
        {
          deck: deck.id,
          name: 'The Empress'
        },
        {
          deck: deck.id,
          name: 'The Emperor'
        },
        {
          deck: deck.id,
          name: 'The Hierophant'
        },
        {
          deck: deck.id,
          name: 'The Lovers'
        },
        {
          deck: deck.id,
          name: 'The Chariot'
        },
        {
          deck: deck.id,
          name: 'Strength'
        },
        {
          deck: deck.id,
          name: 'The Hermit'
        },
        {
          deck: deck.id,
          name: 'The Wheel of Fortune'
        },
        {
          deck: deck.id,
          name: 'Justice'
        },
        {
          deck: deck.id,
          name: 'The Hanged Man'
        },
        {
          deck: deck.id,
          name: 'Death'
        },
        {
          deck: deck.id,
          name: 'Temperance'
        },
        {
          deck: deck.id,
          name: 'The Devil'
        },
        {
          deck: deck.id,
          name: 'The Tower'
        },
        {
          deck: deck.id,
          name: 'The Star'
        },
        {
          deck: deck.id,
          name: 'The Moon'
        },
        {
          deck: deck.id,
          name: 'The Sun'
        },
        {
          deck: deck.id,
          name: 'Judgment'
        },
        {
          deck: deck.id,
          name: 'The World'
        },
        {
          deck: deck.id,
          name: 'Ace of Wands'
        },
        {
          deck: deck.id,
          name: 'Two of Wands'
        },
        {
          deck: deck.id,
          name: 'Three of Wands'
        },
        {
          deck: deck.id,
          name: 'Four of Wands'
        },
        {
          deck: deck.id,
          name: 'Five of Wands'
        },
        {
          deck: deck.id,
          name: 'Six of Wands'
        },
        {
          deck: deck.id,
          name: 'Seven of Wands'
        },
        {
          deck: deck.id,
          name: 'Eight of Wands'
        },
        {
          deck: deck.id,
          name: 'Nine of Wands'
        },
        {
          deck: deck.id,
          name: 'Ten of Wands'
        },
        {
          deck: deck.id,
          name: 'Page of Wands'
        },
        {
          deck: deck.id,
          name: 'Knight of Wands'
        },
        {
          deck: deck.id,
          name: 'Queen of Wands'
        },
        {
          deck: deck.id,
          name: 'King of Wands'
        },
        {
          deck: deck.id,
          name: 'Ace of Cups'
        },
        {
          deck: deck.id,
          name: 'Two of Cups'
        },
        {
          deck: deck.id,
          name: 'Three of Cups'
        },
        {
          deck: deck.id,
          name: 'Four of Cups'
        },
        {
          deck: deck.id,
          name: 'Five of Cups'
        },
        {
          deck: deck.id,
          name: 'Six of Cups'
        },
        {
          deck: deck.id,
          name: 'Seven of Cups'
        },
        {
          deck: deck.id,
          name: 'Eight of Cups'
        },
        {
          deck: deck.id,
          name: 'Nine of Cups'
        },
        {
          deck: deck.id,
          name: 'Ten of Cups'
        },
        {
          deck: deck.id,
          name: 'Page of Cups'
        },
        {
          deck: deck.id,
          name: 'Knight of Cups'
        },
        {
          deck: deck.id,
          name: 'Queen of Cups'
        },
        {
          deck: deck.id,
          name: 'King of Cups'
        },
        {
          deck: deck.id,
          name: 'Ace of Swords'
        },
        {
          deck: deck.id,
          name: 'Two of Swords'
        },
        {
          deck: deck.id,
          name: 'Three of Swords'
        },
        {
          deck: deck.id,
          name: 'Four of Swords'
        },
        {
          deck: deck.id,
          name: 'Five of Swords'
        },
        {
          deck: deck.id,
          name: 'Six of Swords'
        },
        {
          deck: deck.id,
          name: 'Seven of Swords'
        },
        {
          deck: deck.id,
          name: 'Eight of Swords'
        },
        {
          deck: deck.id,
          name: 'Nine of Swords'
        },
        {
          deck: deck.id,
          name: 'Ten of Swords'
        },
        {
          deck: deck.id,
          name: 'Page of Swords'
        },
        {
          deck: deck.id,
          name: 'Knight of Swords'
        },
        {
          deck: deck.id,
          name: 'Queen of Swords'
        },
        {
          deck: deck.id,
          name: 'King of Swords'
        },
        {
          deck: deck.id,
          name: 'Ace of Pentacles'
        },
        {
          deck: deck.id,
          name: 'Two of Pentacles'
        },
        {
          deck: deck.id,
          name: 'Three of Pentacles'
        },
        {
          deck: deck.id,
          name: 'Four of Pentacles'
        },
        {
          deck: deck.id,
          name: 'Five of Pentacles'
        },
        {
          deck: deck.id,
          name: 'Six of Pentacles'
        },
        {
          deck: deck.id,
          name: 'Seven of Pentacles'
        },
        {
          deck: deck.id,
          name: 'Eight of Pentacles'
        },
        {
          deck: deck.id,
          name: 'Nine of Pentacles'
        },
        {
          deck: deck.id,
          name: 'Ten of Pentacles'
        },
        {
          deck: deck.id,
          name: 'Page of Pentacles'
        },
        {
          deck: deck.id,
          name: 'Knight of Pentacles'
        },
        {
          deck: deck.id,
          name: 'Queen of Pentacles'
        },
        {
          deck: deck.id,
          name: 'King of Pentacles'
        }
      ]);
    }

    res.json({success: true, deck: deck});
  } catch (error) {
    res.json({success: false, error: error});
  }
});

app.get('/api/decks/:name', async (req, res) => {
  try {
    let queryString = {
      name: req.params.name
    };

    if (parseInt(req.params.name)) {
      queryString = {
          id: req.params.name
      };
    }

    let deck = await models.Deck.findOne({
      where: queryString,
      include: [
        {as: "DeckType", model: sequelize.model('DeckType')},
        {as: "DeckCards", model: sequelize.model('Card')}
      ],
      order: [['name', 'ASC']]
    });

    res.json({succes: true, deck: deck});
  } catch (error) {
    res.json({success: false, error: error});
  }
});

app.put('/api/decks/:id', checkAdmin, async (req, res) => {
  try {
    const result = await sequelize.transaction(async (t) => {
      await models.Deck.update(
        {
          name: req.body.deck.name,
          author: req.body.deck.author,
          artist: req.body.deck.artist,
          publisher: req.body.deck.publisher,
          type: req.body.deck.type
        },
        {
          where: { id: req.body.deck.id },
          transaction: t
        },
      );

      return true;
    });

    if (result) {
      res.json({success: true});
    }
  } catch (error) {
    res.json({success: false});
  }
});

app.delete('/api/collection/decks/:id', checkAuth, async (req, res) => {
  let idToken = req.headers.authorization.substring(7);
  admin.auth().verifyIdToken(idToken).then(async d => {
    let userDeck = await models.UserDeck.findOne({
      where: {
        id: req.params.id
      }
    });

    let user = await models.User.findOne({
      where: {
        firebaseId: d.uid
      }
    });

    if (userDeck.owner === user.id) {
      try {
        await models.UserDeck.destroy({
          where: {
            id: req.params.id
          }
        });

        res.json({succes: true});
      } catch (error) {
        res.json({success: false, error: error});
      }
    } else {
      res.status(403).send('Unauthorized: UID does not match token.');
    }
  });
});

app.get('/api/crystalSubTypes', async (req, res) => {
  try {
    const crystalSubTypes = await models.CrystalSubType.findAll({
      order: [['crystal', 'ASC'], ['type', 'ASC']]
    });

    res.json({success: true, crystalSubTypes: crystalSubTypes});
  } catch (error) {
    res.json({success: false, error: error});
  }
});

app.post('/api/crystalSubTypes', checkAdmin, async (req, res) => {
  try {
    const crystalSubType = await models.CrystalSubType.create({
      crystal: req.body.crystal,
      type: req.body.type
    });

    res.json({succes: true, crystalSubType: crystalSubType});
  } catch (error) {
    res.json({success: false, error: error});
  }
});

app.delete('/api/crystalSubTypes/:id', checkAdmin, async (req, res) => {
  try {
    await models.CrystalSubType.destroy({
      where: {
        id: req.params.id
      }
    });

    res.json({success: true});
  } catch (error) {
    res.json({success: false, error: error});
  }
});

app.put('/api/crystalSubTypes/:id', checkAdmin, async (req, res) => {
  try {
    const result = await sequelize.transaction(async (t) => {
      await models.CrystalSubType.update(
        { type: req.body.subType.type },
        {
          where: { id: req.body.subType.id },
          transaction: t
        },
      );

      await models.CrystalChakra.destroy(
        {
          where: { subType: req.body.subType.id },
          transaction: t
        }
      );

      for (let c of req.body.subType.chakras) {
        await models.CrystalChakra.create(
          {
            crystalId: req.body.crystal,
            subType: req.body.subType.id,
            chakraId: c
          },
          { transaction: t }
        );
      }

      await models.CrystalCleansing.destroy(
        {
          where: { subType: req.body.subType.id },
          transaction: t
        }
      );

      for (let c of req.body.subType.cleansings) {
        await models.CrystalCleansing.create(
          {
            crystalId: req.body.crystal,
            subType: req.body.subType.id,
            cleansingId: c
          },
          { transaction: t }
        );
      }

      await models.CrystalDomain.destroy(
        {
          where: { subType: req.body.subType.id },
          transaction: t
        }
      );

      for (let d of req.body.subType.domains) {
        await models.CrystalDomain.create(
          {
            crystalId: req.body.crystal,
            subType: req.body.subType.id,
            domainId: d
          },
          { transaction: t }
        );
      }

      await models.CrystalElement.destroy(
        {
          where: { subType: req.body.subType.id },
          transaction: t
        }
      );

      for (let e of req.body.subType.elements) {
        await models.CrystalElement.create(
          {
            crystalId: req.body.crystal,
            subType: req.body.subType.id,
            elementId: e
          },
          { transaction: t }
        );
      }

      await models.CrystalMoonPhase.destroy(
        {
          where: { subType: req.body.subType.id },
          transaction: t
        }
      );

      for (let m of req.body.subType.moonPhases) {
        await models.CrystalMoonPhase.create(
          {
            crystalId: req.body.crystal,
            subType: req.body.subType.id,
            moonPhaseId: m
          },
          { transaction: t }
        );
      }

      await models.CrystalZodiac.destroy(
        {
          where: { subType: req.body.subType.id },
          transaction: t
        }
      );

      for (let z of req.body.subType.zodiacs) {
        await models.CrystalZodiac.create(
          {
            crystalId: req.body.crystal,
            subType: req.body.subType.id,
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
    res.json({success: false, error: error});
  }
});

module.exports = app;