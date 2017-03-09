/**
 * Proudly created by ohad on 08/03/2017.
 */
const _              = require('lodash'),
      bodyParser     = require('body-parser'),
      cookieParser   = require('cookie-parser'),
      expressSession = require('express-session'),
      passport       = require('passport'),
      Strategy       = require('passport-local').Strategy,
      router         = require('express').Router(),
      Datastore      = require('@google-cloud/datastore'),
      Const          = require('../common/const');

const datastore = Datastore();

router.use('/', function (req, res, next) {
  if (process.env.NODE_ENV === Const.ENV.DEV) {
    res.header('Access-Control-Allow-Origin', 'http://localhost');
  } else {
    res.header('Access-Control-Allow-Origin', 'https://dashboard.brainpal.io');
  }
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

router.use(cookieParser());
router.use(bodyParser.urlencoded({extended: true}));
router.use(expressSession({
                            secret: require('../../credentials/express.session.secret'),
                            resave: false, saveUninitialized: false
                          }));
router.use(passport.initialize());
router.use(passport.session());

passport.use(new Strategy(
  function (email, password, cb) {
    if (!_.isString(email)) {
      console.error(`Auth: not today my dear! email (=${email}) is not a string`);
    }
    datastore.runQuery(datastore.createQuery(Const.KIND.CUSTOMER).filter('email', '=', email))
             .then((results) => {
               if (_.isEmpty(results[0]) || results[0][0].password !== password) {
                 cb(null, false);
               }
               cb(null, results[0][0]);
             })
             .catch((err) => { cb(err); });
  }));

passport.serializeUser(function (user, cb) {
  cb(null, user[Datastore.KEY]);
});

passport.deserializeUser(function (key, cb) {
  datastore.runQuery(datastore.createQuery(Const.KIND.CUSTOMER).filter('__key__', '=', key))
           .then((results) => {
             if (results[0].legnth) cb(null, results[0][0]);
             cb(new Error(`Auth: user not found (id = ${key})`))
           })
           .catch((err) => { cb(err);});
});

const baseUrl = process.env.NODE_ENV === Const.ENV.DEV ?
                'http://localhost:3000' : 'https://dashboard.brainpal.io';
router.post('/', passport.authenticate('local', {failureRedirect: baseUrl + '/auth'}),
            function (req, res) {
              res.redirect(baseUrl);
            });

router.get('/logout',
           function (req, res) {
             req.logout();
             res.redirect(baseUrl + '/auth');
           });

module.exports = router;