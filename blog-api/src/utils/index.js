import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import paginateWithDateFallback from './pagination.js'

const responseSuccessCreator = (
  req,
  res,
  statusCode,
  message = "Succesful",
  data = {}
) => {
  const responseObj = {
    message: message,
    data: data,
  };
  return res.send(responseObj).status(statusCode);
};

const responseErrorCreator = (
  req,
  res,
  statusCode,
  message = "Something went wrong",
  data = {}
) => {
  const responseObj = {
    message: message,
    data: data,
  };
  return res.send(responseObj).status(statusCode);
};

const hashPassword = async (plainPassword) => {
  const saltRounds = 10;
  const hash = await bcrypt.hash(plainPassword, saltRounds);
  return hash;
};

const comparePassword = async (plainPassword, hashedPassword) => {
  const match = await bcrypt.compare(plainPassword, hashedPassword);
  return match;
};

const generateToken = (payload, expiresIn = '12h') =>{
    const token = jwt.sign(payload, process.env.AUTH_SECRET, { expiresIn });
    return token;
  }

export { responseSuccessCreator, responseErrorCreator, hashPassword, comparePassword, generateToken, paginateWithDateFallback };
