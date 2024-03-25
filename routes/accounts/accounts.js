const validateAccounts = require('../validate');

let accounts = [];

module.exports = function(app) {
  app.post('/accounts', (req, res) => {
    const { error } = validateAccounts(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const account = {
      id: accounts.length + 1,
      email: req.body.email,
      name: req.body.name,
      password: req.body.password
    };
    accounts.push(account);
    res.status(201).send(account);
  });
};