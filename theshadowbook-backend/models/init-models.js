var DataTypes = require("sequelize").DataTypes;
var _Cards = require("./Cards");
var _Chakra = require("./Chakra");
var _Cleansing = require("./Cleansing");
var _Color = require("./Color");
var _Coven = require("./Coven");
var _Crystal = require("./Crystal");
var _CrystalChakra = require("./CrystalChakra");
var _CrystalCleansing = require("./CrystalCleansing");
var _CrystalDomain = require("./CrystalDomain");
var _CrystalElement = require("./CrystalElement");
var _CrystalMoonPhase = require("./CrystalMoonPhase");
var _CrystalZodiac = require("./CrystalZodiac");
var _Deck = require("./Deck");
var _DeckType = require("./DeckType");
var _Domain = require("./Domain");
var _Element = require("./Element");
var _MoonPhase = require("./MoonPhase");
var _Status = require("./Status");
var _User = require("./User");
var _UserCoven = require("./UserCoven");
var _UserCrystal = require("./UserCrystal");
var _UserDeck = require("./UserDeck");
var _Zodiac = require("./Zodiac");
var _Shape = require("./Shape");

function initModels(sequelize) {
  var Cards = _Cards(sequelize, DataTypes);
  var Chakra = _Chakra(sequelize, DataTypes);
  var Cleansing = _Cleansing(sequelize, DataTypes);
  var Color = _Color(sequelize, DataTypes);
  var Coven = _Coven(sequelize, DataTypes);
  var Crystal = _Crystal(sequelize, DataTypes);
  var CrystalChakra = _CrystalChakra(sequelize, DataTypes);
  var CrystalCleansing = _CrystalCleansing(sequelize, DataTypes);
  var CrystalDomain = _CrystalDomain(sequelize, DataTypes);
  var CrystalElement = _CrystalElement(sequelize, DataTypes);
  var CrystalMoonPhase = _CrystalMoonPhase(sequelize, DataTypes);
  var CrystalZodiac = _CrystalZodiac(sequelize, DataTypes);
  var Deck = _Deck(sequelize, DataTypes);
  var DeckType = _DeckType(sequelize, DataTypes);
  var Domain = _Domain(sequelize, DataTypes);
  var Element = _Element(sequelize, DataTypes);
  var MoonPhase = _MoonPhase(sequelize, DataTypes);
  var Status = _Status(sequelize, DataTypes);
  var User = _User(sequelize, DataTypes);
  var UserCoven = _UserCoven(sequelize, DataTypes);
  var UserCrystal = _UserCrystal(sequelize, DataTypes);
  var UserDeck = _UserDeck(sequelize, DataTypes);
  var Zodiac = _Zodiac(sequelize, DataTypes);
  var Shape = _Shape(sequelize, DataTypes);

  CrystalChakra.belongsTo(Chakra, { as: "chakra", foreignKey: "chakraId"});
  Chakra.hasMany(CrystalChakra, { as: "CrystalChakras", foreignKey: "chakraId"});
  CrystalCleansing.belongsTo(Cleansing, { as: "cleansing", foreignKey: "cleansingId"});
  Cleansing.hasMany(CrystalCleansing, { as: "CrystalCleansings", foreignKey: "cleansingId"});
  UserCrystal.belongsTo(Color, { as: "primaryColor_Color", foreignKey: "primaryColor"});
  Color.hasMany(UserCrystal, { as: "UserCrystals", foreignKey: "primaryColor"});
  UserCrystal.belongsTo(Color, { as: "secondaryColor_Color", foreignKey: "secondaryColor"});
  Color.hasMany(UserCrystal, { as: "secondaryColor_UserCrystals", foreignKey: "secondaryColor"});
  UserCrystal.belongsTo(Color, { as: "tertiaryColor_Color", foreignKey: "tertiaryColor"});
  Color.hasMany(UserCrystal, { as: "tertiaryColor_UserCrystals", foreignKey: "tertiaryColor"});
  UserCoven.belongsTo(Coven, { as: "coven", foreignKey: "covenId"});
  Coven.hasMany(UserCoven, { as: "UserCovens", foreignKey: "covenId"});
  CrystalChakra.belongsTo(Crystal, { as: "crystal", foreignKey: "crystalId"});
  Crystal.hasMany(CrystalChakra, { as: "CrystalChakras", foreignKey: "crystalId"});
  CrystalCleansing.belongsTo(Crystal, { as: "crystal", foreignKey: "crystalId"});
  Crystal.hasMany(CrystalCleansing, { as: "CrystalCleansings", foreignKey: "crystalId"});
  CrystalDomain.belongsTo(Crystal, { as: "crystal", foreignKey: "crystalId"});
  Crystal.hasMany(CrystalDomain, { as: "CrystalDomains", foreignKey: "crystalId"});
  CrystalElement.belongsTo(Crystal, { as: "crystal", foreignKey: "crystalId"});
  Crystal.hasMany(CrystalElement, { as: "CrystalElements", foreignKey: "crystalId"});
  CrystalMoonPhase.belongsTo(Crystal, { as: "crystal", foreignKey: "crystalId"});
  Crystal.hasMany(CrystalMoonPhase, { as: "CrystalMoonPhases", foreignKey: "crystalId"});
  CrystalZodiac.belongsTo(Crystal, { as: "crystal", foreignKey: "crystalId"});
  Crystal.hasMany(CrystalZodiac, { as: "CrystalZodiacs", foreignKey: "crystalId"});
  UserCrystal.belongsTo(Crystal, { as: "crystal_Crystal", foreignKey: "crystal"});
  Crystal.hasMany(UserCrystal, { as: "UserCrystals", foreignKey: "crystal"});
  Cards.belongsTo(Deck, { as: "deck", foreignKey: "deckId"});
  Deck.hasMany(Cards, { as: "Cards", foreignKey: "deckId"});
  UserDeck.belongsTo(Deck, { as: "deck", foreignKey: "deckId"});
  Deck.hasMany(UserDeck, { as: "UserDecks", foreignKey: "deckId"});
  Deck.belongsTo(DeckType, { as: "id_DeckType", foreignKey: "id"});
  DeckType.hasOne(Deck, { as: "Deck", foreignKey: "id"});
  CrystalDomain.belongsTo(Domain, { as: "domain", foreignKey: "domainId"});
  Domain.hasMany(CrystalDomain, { as: "CrystalDomains", foreignKey: "domainId"});
  CrystalElement.belongsTo(Element, { as: "element", foreignKey: "elementId"});
  Element.hasMany(CrystalElement, { as: "CrystalElements", foreignKey: "elementId"});
  CrystalMoonPhase.belongsTo(MoonPhase, { as: "moonPhase", foreignKey: "moonPhaseId"});
  MoonPhase.hasMany(CrystalMoonPhase, { as: "CrystalMoonPhases", foreignKey: "moonPhaseId"});
  UserCrystal.belongsTo(Status, { as: "status_Status", foreignKey: "status"});
  Status.hasMany(UserCrystal, { as: "UserCrystals", foreignKey: "status"});
  UserDeck.belongsTo(Status, { as: "status_Status", foreignKey: "status"});
  Status.hasMany(UserDeck, { as: "UserDecks", foreignKey: "status"});
  UserCoven.belongsTo(User, { as: "user", foreignKey: "userId"});
  User.hasMany(UserCoven, { as: "UserCovens", foreignKey: "userId"});
  UserCrystal.belongsTo(User, { as: "owner_User", foreignKey: "owner"});
  User.hasMany(UserCrystal, { as: "UserCrystals", foreignKey: "owner"});
  UserDeck.belongsTo(User, { as: "user", foreignKey: "userId"});
  User.hasMany(UserDeck, { as: "UserDecks", foreignKey: "userId"});
  CrystalZodiac.belongsTo(Zodiac, { as: "zodiac", foreignKey: "zodiacId"});
  Zodiac.hasMany(CrystalZodiac, { as: "CrystalZodiacs", foreignKey: "zodiacId"});
  User.belongsTo(Zodiac, { as: "moonSign_Zodiac", foreignKey: "moonSign"});
  Zodiac.hasMany(User, { as: "Users", foreignKey: "moonSign"});
  User.belongsTo(Zodiac, { as: "risingSign_Zodiac", foreignKey: "risingSign"});
  Zodiac.hasMany(User, { as: "risingSign_Users", foreignKey: "risingSign"});
  User.belongsTo(Zodiac, { as: "sunSign_Zodiac", foreignKey: "sunSign"});
  Zodiac.hasMany(User, { as: "sunSign_Users", foreignKey: "sunSign"});
  UserCrystal.belongsTo(Shape, { as: "UserShape", foreignKey: "shape"});
  Shape.hasMany(UserCrystal, { as: "UserCrystals", foreignKey: "shape"});

  return {
    Cards,
    Chakra,
    Cleansing,
    Color,
    Coven,
    Crystal,
    CrystalChakra,
    CrystalCleansing,
    CrystalDomain,
    CrystalElement,
    CrystalMoonPhase,
    CrystalZodiac,
    Deck,
    DeckType,
    Domain,
    Element,
    MoonPhase,
    Status,
    User,
    UserCoven,
    UserCrystal,
    UserDeck,
    Zodiac,
    Shape
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
