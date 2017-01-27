/**
 * Proudly created by ohad on 25/01/2017.
 */
const Customer = require('./customer');
/**
 * @param {Customer} customer
 * @returns {Promise} that is resolved if the provided credentials should be approved, or
 * rejected otherwise.
 */
exports.auth = function (customer) {
  return new Promise((resolve, reject) => {
    Customer.findOne({apiKey: customer.apiKey}, (error, actualCustomer) => {
      if (error) reject(error);
      if (actualCustomer) {
        if (customer.url && actualCustomer.url && actualCustomer.url.indexOf(customer.url) === -1 &&
            customer.url.indexOf(actualCustomer.url) === -1) {
          console.warn(
            `Invalid referer: ${customer.url} FOR ${actualCustomer.name} (${actualCustomer.apiKey})`);
        }
        resolve(actualCustomer);
      }
      reject();
    });
  });
};

/**
 * @param {http.IncomingMessage} request
 * @returns {boolean} whether the request should be responded with development resources (which
 * be unstable).
 */
exports.isDev = function (request) {
  if (request.query && request.query.prod === 'true') return false;
  if (request.hostname === 'localhost') return true;
  return typeof request.headers === 'object' &&
         request.headers['x-forwarded-for'] === '77.139.207.58';
};
