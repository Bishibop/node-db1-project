const express = require("express");

const db = require("../data/dbConfig.js");

const server = express();

server.use(express.json());

server.get('/accounts', async (req, res) => {
  try {
    const query = req.query;
    let accounts = db('accounts');
    if (query) {
      if (query.sortby) {
        const order = query.sortdir ? query.sortdir : 'desc';
        accounts = accounts.orderBy(query.sortby, order);
      }
      if (query.limit) {
        accounts = accounts.limit(query.limit);
      }
    }
    res.status(200).json(await accounts);
  } catch (err) {
    console.log('Error: ', err);
    res.status(500).json({
      errorMessage: "The accounts information could not be retrieved."
    });
  }
});

server.get('/accounts/:id', async (req, res) => {
  try {
    const account = await db('accounts').where({ id: req.params.id })
    if (account.length) {
      res.status(200).json(account[0]);
    } else {
      res.status(400).json({
        message: 'invalid account id'
      });
    }
  } catch (err) {
    console.log('Error: ', err);
    res.status(500).json({
      errorMessage: "The account information could not be retrieved."
    });
  }
});

server.post('/accounts', async (req, res) => {
  try {
    if (!Object.keys(req.body).length) {
      res.status(400).json({
        message: "missing account data"
      });
    } else if (!req.body.name || !req.body.budget ) {
      res.status(400).json({
        message: "missing required data fields: name and budget"
      });
    } else {
      const [accountID] = await db('accounts').insert(req.body);
      res.status(201).json(accountID);
    }
  } catch (err) {
    console.log('Error: ', err);
    res.status(500).json({
      errorMessage: "The account could not be created"
    });
  }
});

server.put('/accounts/:id', async (req, res) => {
  try {
    if (!Object.keys(req.body).length) {
      res.status(400).json({
        message: "missing account data"
      });
    } else {
      const count = await db('accounts')
        .where({id: req.params.id}).update(req.body);
      if (count) {
        res.status(200).json({message: 'Record updated' });
      } else {
        res.status(400).json({
          message: 'invalid account id'
        });
      }
    }
  } catch (err) {
    console.log('Error: ', err);
    res.status(500).json({
      errorMessage: "The account could not be updated"
    });
  }
});

server.delete('/accounts/:id', async (req, res) => {
  try {
    const count = await db('accounts').where({id: req.params.id}).del();
    if (count) {
      res.status(200).json({message: 'Record deleted' });
    } else {
      res.status(400).json({
        message: 'invalid account id'
      });
    }
  } catch (err) {
    console.log('Error: ', err);
    res.status(500).json({
      errorMessage: "The account could not be updated"
    });
  }
});

module.exports = server;
