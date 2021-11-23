const env = {
  database: 'studentdb',
  username: 'chakri',
  password: 'pani1999',
  host: 'localhost',
  dialect: 'postgres',
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};

module.exports = env;