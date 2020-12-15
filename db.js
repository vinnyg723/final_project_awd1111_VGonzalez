const config = require('config');
const { MongoClient, ObjectID } = require('mongodb');

let _database = null;

const connect = async () => {
  if (!_database) {
    const dbUrl = config.get('db.url');
    const dbName = config.get('db.name');
    const poolSize = config.get('db.poolSize');
    const client = await MongoClient.connect(dbUrl, {
      useUnifiedTopology: true,
      poolSize: poolSize,
    });
    _database = client.db(dbName);
  }
  return _database;
};

const getAllCars = async () => {
  const database = await connect();
  return database.collection('cars').find({}).toArray();
};

const getCarsByModel = async (model) => {
  const database = await connect();
  return database.collection('cars').find({ model: model }).toArray();
};

const getCarsByPrice = async (price) => {
  const database = await connect();
  return database.collection('cars').find({ price: price }).toArray();
};

const getCarsByType = async (type) => {
  const database = await connect();
  return database.collection('cars').find({ type: type }).toArray();
};

const getCarByName = async (name) => {
  const database = await connect();
  return database.collection('cars').findOne({ name: name }).toArray();
};

const getCarById = async (id) => {
  const database = await connect();
  return database.collection('cars').findOne({
    _id: new ObjectID(id),
  });
};

const insertCar = async (car) => {
  const database = await connect();
  return database.collection('cars').insertOne(car);
};

const insertOrder = async (order) => {
  const database = await connect();
  return database.collection('orders').insertOne(order);
};

const updateCar = async (car) => {
  const database = await connect();
  return database.collection('cars').updateOne(
    { _id: new ObjectID(car._id) },
    {
      $set: {
        name: car.name,
        model: car.model,
        price: car.price,
        type: car.type,
        year: car.year,
        description: car.description,
        keywords: car.keywords
      },
    }
  );
};

const deleteCarById = async (id) => {
  const database = await connect();
  return database.collection('cars').deleteOne({ _id: new ObjectID(id) });
};

const insertAccount = async (account) => {
  const database = await connect();
  return database.collection('accounts').insertOne(account);
};

const getAccountByEmail = async (email) => {
  const database = await connect();
  return database.collection('accounts').findOne({
    email
  });
};

const getAccountByUsername = async (username) => {
  const database = await connect();
  return database.collection('accounts').findOne({
    username
  });
};

const getAccountsByUsername = async (username) => {
  const database = await connect();
  return database.collection('accounts').findOne({
    username
  });
};

const getAccountsByEmail = async (email) => {
  const database = await connect();
  return database.collection('accounts').findOne({
    email
  });
};

const getAccountById = async (id) => {
  const database = await connect();
  return database.collection('accounts').findOne({ _id: new ObjectID(id) });
};



module.exports = {
  connect,
  getAllCars,
  getCarsByType,
  getCarsByModel,
  getCarsByPrice,
  getCarByName,
  getCarById,
  insertCar,
  updateCar,
  deleteCarById,
  insertOrder,
  getAccountByUsername,
  insertAccount,
  getAccountById,
  getAccountsByUsername,
  getAccountsByEmail,
  getAccountByEmail
};
