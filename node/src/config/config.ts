/**
 * Token expired
 */
 const TOKEN_EXPIRED = process.env.TOKEN_EXPIRED || '1d';

 /**
  * Token seed
  */
 const SEED = process.env.SEED || 'secret';
 
 const TOKEN = {
     seed: SEED,
     token_expired: TOKEN_EXPIRED
 }
 
 /**
  * Config Enviroment of backend server
  */
 const SERVER_HOSTNAME = process.env.SERVER_HOSTNAME || 'localhost';
 const SERVER_PORT = process.env.SERVER_PORT || 3000;

 const SERVER = {
     hostname: SERVER_HOSTNAME,
     port: SERVER_PORT
 };

 export default {
     SERVER,
     TOKEN
 }