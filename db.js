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

const getAllOrders = async () => {
  const database = await connect();
  return database.collection('orders').find({}).toArray();
};

const getAllAccounts = async () => {
  const database = await connect();
  return database.collection('accounts').find({}).toArray();
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

const getOrderById = async (id) => {
  const database = await connect();
  return database.collection('orders').findOne({
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

const updateOrder = async (order) => {
  const database = await connect();
  return database.collection('orders').updateOne(
    { _id: new ObjectID(order._id) },
    {
      $set: {
        car_id: order.car_id,
        firstName: order.firstName,
        lastName: order.price,
        email: order.email,
        phone: order.phone,
      },
    }
  );
};

const updateAccount = async (account) => {
  const database = await connect();
  return database.collection('accounts').updateOne(
    { _id: new ObjectID(account._id) },
    {
      $set: {
        username: account.username,
        password: account.password,
        lastName: account.lastName,
        firstName: account.firstName,
        email: account.email,
        phone: account.phone,
        keywords: account.keywords
      },
    }
  );
};

const deleteOrderById = async (id) => {
  const database = await connect();
  return database.collection('orders').deleteOne({ _id: new ObjectID(id) });
};

const deleteAccountById = async (id) => {
  const database = await connect();
  return database.collection('accounts').deleteOne({ _id: new ObjectID(id) });
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
  getAllAccounts,
  getAllOrders,
  getCarsByType,
  getCarsByModel,
  getCarsByPrice,
  getCarByName,
  getCarById,
  getOrderById,
  insertCar,
  updateCar,
  updateOrder,
  updateAccount,
  deleteCarById,
  deleteOrderById,
  deleteAccountById,
  insertOrder,
  getAccountByUsername,
  insertAccount,
  getAccountById,
  getAccountsByUsername,
  getAccountsByEmail,
  getAccountByEmail,
 
};
