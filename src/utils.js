const bcrpypt = require("bcrypt");

const flattenObj = (obj = {}) => {
  const keys = Object.keys(obj);
  let flat = {};
  for (let key of keys) {
    if (typeof obj[key] === "object" && obj[key] !== null && !!obj[key]) {
      let nestedObj = flattenObj(obj[key]);
      flat = { ...flat, ...nestedObj };
    } else {
      if (Array.isArray(obj[key])) {
        const curr = obj[key];
        for (let val of curr) {
          if (typeof val[key] === "object" && val[key] !== null && !!val[key]) {
            let nestedObj = flattenObj(obj[key]);
            flat = { ...flat, ...nestedObj };
          } else flat[key] = obj[key];
        }
      } else flat[key] = obj[key];
    }
  }

  return flat;
};

const validateEmail = function (email) {
  const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(email);
};

function hashPassword(password = "") {
  return bcrpypt.hashSync(password, 10);
}

async function comparePasswords(plainTextPassword, hashedPassword) {
  const match = await bcrpypt.compare(plainTextPassword, hashedPassword);
  if (match) {
    return match;
  }
  return null;
}

const responseWithCode = (res, message, code, data = null) => {
  return res.status(code).json({ message, ...(data && { data }) });
};

module.exports = {
  flattenObj,
  validateEmail,
  hashPassword,
  comparePasswords,
  responseWithCode,
};
