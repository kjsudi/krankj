const UserModel = require("../models/users.model");
const config = require("../../common/config/env.config");
const permissionLevels = config.permissionLevels;
const adminUsers = config.adminUsers;
const crypto = require("crypto");

const setPermissionOnUser = (email) => {
  let permissionValue = 0;
  permission = permissionLevels.NORMAL_USER;

  if (isAdminUser(email)) {
    permission = permissionLevels.ADMIN;
  }

  for (let i in permissionLevels) {
    permissionValue += permissionLevels[i];
    if (permissionLevels[i] === permission) {
      break;
    }
  }
  return permissionValue;
};

const isAdminUser = (email) => {
  return adminUsers.some((admin) => admin === email);
};

exports.insert = (req, res) => {
  let salt = crypto.randomBytes(16).toString("base64");
  let hash = crypto
    .createHmac("sha512", salt)
    .update(req.body.password)
    .digest("base64");
  req.body.password = salt + "$" + hash;
  req.body.permissionLevel = setPermissionOnUser(req.body.email);
  req.body.revokeAccess = false;
  UserModel.createUser(req.body)
    .then((result) => {
      res.status(201).send({ id: result._id });
    })
    .catch((err) => res.status(400).send({ errors: err }));
};

exports.list = (req, res) => {
  let limit =
    req.query.limit && req.query.limit <= 100 ? parseInt(req.query.limit) : 10;
  let page = 0;
  if (req.query) {
    if (req.query.page) {
      req.query.page = parseInt(req.query.page);
      page = Number.isInteger(req.query.page) ? req.query.page : 0;
    }
  }
  UserModel.list(limit, page)
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((err) => res.status(500).send({ errors: err }));
};

exports.getById = (req, res) => {
  UserModel.findById(req.params.userId)
    .then((result) => {
      res.status(200).send(result);
    })
    .catch(() => res.status(400).send({ error: "Userid does not exist" }));
};
exports.patchById = (req, res) => {
  if (req.body.password) {
    let salt = crypto.randomBytes(16).toString("base64");
    let hash = crypto
      .createHmac("sha512", salt)
      .update(req.body.password)
      .digest("base64");
    req.body.password = salt + "$" + hash;
  }

  UserModel.patchUser(req.params.userId, req.body)
    .then((result) => {
      res.status(204).send({});
    })
    .catch((err) => res.status(400).send({ error: "Could not update user" }));
};

exports.removeById = (req, res) => {
  UserModel.removeById(req.params.userId)
    .then(() => {
      res.status(200).send({
        msg: `User id: ${req.params.userId} has been successfully deleted`,
      });
    })
    .catch((err) =>
      res.status(500).send({ error: `User ${err.value} could not be deleted` })
    );
};
