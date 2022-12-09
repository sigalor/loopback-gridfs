const mongodb = require('mongodb');
const { generateMongoDBURL, MongoDB } = require('loopback-connector-mongodb');
const debug = require('debug')('loopback:connector:gridfs');

class GridFS extends MongoDB {
  constructor(settings, dataSource) {
    super(settings, dataSource);
  }

  create(modelName, data, options, callback) {
    console.log(modelName, data, options, callback);
    return super(create);
  }
}

// from https://github.com/loopbackio/loopback-connector-mongodb/blob/master/lib/mongodb.js#L98
// just with GridFS instead of MongoDB
exports.initialize = function (dataSource, callback) {
  if (!mongodb) {
    return;
  }

  const s = dataSource.settings;

  s.safe = s.safe !== false;
  s.w = s.w || 1;
  s.writeConcern = s.writeConcern || {
    w: s.w,
    wtimeout: s.wtimeout || null,
    j: s.j || null,
    journal: s.journal || null,
    fsync: s.fsync || null,
  };
  s.url = s.url || generateMongoDBURL(s);
  // useNewUrlParser and useUnifiedTopology are default now
  dataSource.connector = new MongoDB(s, dataSource);
  dataSource.ObjectID = mongodb.ObjectId;

  if (callback) {
    if (s.lazyConnect) {
      process.nextTick(function () {
        callback();
      });
    } else {
      dataSource.connector.connect(callback);
    }
  }
};
