import { Request, Response } from 'express';
import Users from '../models/UserModel';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from '../config/config';
import { IResponse } from '../types/IResponse';
import { CallbackError } from 'mongoose';

const getDefaultResponse = (): IResponse => ({
  status: 200,
  message: 'Okay',
  type: '',
});

const LoginUser = (req: Request, res: Response) => {
  const body = req.body;

  Users.findOne(
    { email: body.email },
    (error: CallbackError, userDB: { password: string; attempts: number }) => {
      let response: IResponse = getDefaultResponse();

      if (error) {
        response = {
          status: 500,
          message: 'Internal Server error',
          type: error.name,
        };
        return res.status(response.status).json(response);
      }

      /**
       * Return status 400 if user doesn't exist on database.
       */
      if (!userDB) {
        response = {
          status: 400,
          message: 'Incorrect username or password, please try again.',
          type: 'incorrect_user_or_password',
        };
        return res.status(response.status).json(response);
      }

      /**
       * Block user if exceeded tries login.
       */
      if (userDB.attempts >= 3) {
        Users.findOneAndUpdate(
          { email: body.email },
          {
            $set: {
              attempts: userDB.attempts + 1,
              blocked: 'S',
            },
          },
          { new: true },
          (error) => {
            if (error) {
              console.log(error);
            }
          }
        );

        response = {
          status: 400,
          message: 'Max tries exceeded. Please recover your password.',
          type: 'max_tries_exceeded',
        };
        return res.status(response.status).json(response);
      } else {
        /**
         * If the password is incorrect, add +1 to the attempts.
         */
        if (!bcrypt.compareSync(body.password, userDB.password)) {
          Users.findOneAndUpdate(
            { email: body.email },
            {
              $set: {
                attempts: userDB.attempts + 1,
              },
            },
            { new: true },
            (error) => {
              if (error) {
                console.log(error);
              }
            }
          );

          response = {
            status: 400,
            message: 'Incorrect username or password, please try again.',
            type: 'incorrect_user_or_password',
          };
          return res.status(response.status).json(response);
        }
      }

      /**
       * If login its okay set attempts to 0
       */
      Users.findOneAndUpdate(
        { email: body.email },
        {
          $set: {
            attempts: 0,
          },
        },
        { new: true },
        (error) => {
          if (error) {
            console.log(error);
          }
        }
      );

      const token = jwt.sign(
        {
          user: userDB,
        },
        config.TOKEN.seed,
        { expiresIn: config.TOKEN.token_expired }
      );

      res.json({
        access_token: token,
      });
    }
  );
};

export default {
  LoginUser,
};
