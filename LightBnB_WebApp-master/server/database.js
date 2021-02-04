const properties = require("./json/properties.json");
const users = require("./json/users.json");
const { Pool } = require("pg");

const pool = new Pool({
  user: "vagrant",
  password: "123",
  host: "localhost",
  database: "lightbnb",
});

/// Users
/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function (email) {
  const query = "SELECT * FROM users WHERE email = $1;";
  return pool
    .query(query, [email])
    .then(({ rows }) => rows[0])
    .catch(() => null);
};
exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function (id) {
  const query = "SELECT * FROM users WHERE id = $1;";
  return pool
    .query(query, [id])
    .then(({ rows }) => rows[0])
    .catch(() => null);
};
exports.getUserWithId = getUserWithId;

/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser = function ({ name, email, password }) {
  const query =
    "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *";
  return pool
    .query(query, [name, email, password])
    .then(({ rows }) => rows[0])
    .catch(() => null);
};
exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function (guest_id, limit = 10) {
  const query =
    'SELECT reservations.*, properties.*, AVG(rating) AS "average_rating" FROM reservations JOIN properties ON reservations.property_id=properties.id JOIN property_reviews ON properties.id=property_reviews.property_id WHERE reservations.guest_id = $1 AND reservations.end_date < now()::DATE GROUP BY reservations.id, properties.id ORDER BY properties.cost_per_night LIMIT $2;';
  return pool
    .query(query, [guest_id, limit])
    .then(({ rows }) => rows)
    .catch(() => null);
};
exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
const getAllProperties = function ({
  city,
  owner_id,
  minimum_price_per_night,
  maximum_price_per_night,
  minimum_rating }
  , limit = 10) {
  let alreadyQueried = false;
  const queryParams = [];
  let queryString =
    'SELECT properties.*, AVG(rating) AS "average_rating" FROM properties LEFT JOIN property_reviews ON properties.id=property_id ';

  if (city || owner_id || minimum_price_per_night || maximum_price_per_night) {
    queryString += 'WHERE ';
  }

  if (city) {
    queryParams.push(`%${city}%`);
    queryString += `city LIKE $${queryParams.length} `;
    alreadyQueried = true;
  }

  if (owner_id) {
    if (alreadyQueried) {
      queryString += 'AND ';
    }
    queryParams.push(`${owner_id}`);
    queryString += `owner_id = $${queryParams.length} `;
    alreadyQueried = true;
  }

  if (minimum_price_per_night) {
    if (alreadyQueried) {
      queryString += 'AND ';
    }
    queryParams.push(`${minimum_price_per_night}`);
    queryString += `cost_per_night >= $${queryParams.length} `;
    alreadyQueried = true;
  }

  if (maximum_price_per_night) {
    if (alreadyQueried) {
      queryString += 'AND ';
    }
    queryParams.push(`${maximum_price_per_night}`);
    queryString += `cost_per_night <= $${queryParams.length} `;
  }

  queryString += 'GROUP BY properties.id ';

  if (minimum_rating) {
    queryParams.push(`${minimum_rating}`);
    queryString += `HAVING AVG(rating) >= $${queryParams.length} `;
  }

  queryString += 'ORDER BY cost_per_night ';


  queryParams.push(limit);
  queryString += `LIMIT $${queryParams.length};`;


  return pool
    .query(queryString, queryParams)
    .then(({ rows }) => {
      return rows;
    })
    .catch((err) => {
      throw new Error(err);
    });
};
exports.getAllProperties = getAllProperties;

/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function (property) {
  const queryString = 'INSERT INTO properties (owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, parking_spaces, number_of_bathrooms, number_of_bedrooms, country, street, city, province, post_code) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13,$14)RETURNING *';
  const queryParams = [property.owner_id,
    property.title,
    property.description,
    property.thumbnail_photo_url,
    property.cover_photo_url,
    property.cost_per_night,
    property.parking_spaces,
    property.number_of_bathrooms,
    property.number_of_bedrooms,
    property.country,
    property.street,
    property.city,
    property.province,
    property.post_code];

  return pool.query(queryString, queryParams)
    .then(({ rows }) => rows[0])
    .catch(() => null);
};
exports.addProperty = addProperty;
