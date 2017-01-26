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
  return new Promise(function (resolve, reject) {
    Customer.findOne({apiKey: customer.apiKey}, function (error, _customer) {
      if (error) {
        reject(error);
      }
      if (_customer) {
        if (customer.url && _customer.url && _customer.url.indexOf(customer.url) === -1 &&
            customer.url.indexOf(_customer.url) === -1) {
          console.warn(
            `Invalid referer: ${customer.url} FOR ${_customer.name} (${_customer.apiKey})`);
        }
        resolve(_customer);
      }
      reject();
    });
  });
};