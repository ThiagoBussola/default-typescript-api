import { CommonRoutesConfig } from '../common/common.routes.config'
import UsersMiddleware from './middleware/user.middleware'
import UsersController from './controllers/user.controller'
import express from 'express'
import BodyValidationMiddleware from '../common/middleware/body.validation.middleware'
import { body } from 'express-validator'

export class UsersRoutes extends CommonRoutesConfig {
  constructor (app: express.Application) {
    super(app, 'UserRoutes')
  }

  /*
  Request: The Request is the way Express.js represents the HTTP request to be handled.
    This type upgrades and extends the native Node.js request type.
  Response: The Request is the way Express.js represents the HTTP request to be handled.
    This type upgrades and extends the native Node.js request type.
  NextFunction: Serves as a callback function, allowing control to pass through any other middleware functions.
     Along the way, all middleware will share the same request and response objects before the controller finally sends
     a response back to the requester.
  */

  configureRoutes () {
    this.app.route('/users')
      .get(UsersController.listUsers)
      .post(
        body('email').isEmail(),
        body('password').isLength({ min: 5 }).withMessage('Must include password (5+ characters)'),
        BodyValidationMiddleware.verifyBodyFieldsErrors,
        UsersMiddleware.validateSameEmailDoesntExist,
        UsersController.createUser
      )

    this.app.param('userId', UsersMiddleware.extractUserId)

    this.app.route('/users/:userId')
      .all(UsersMiddleware.validateUserExists)
      .get(UsersController.getUserById)
      .delete(UsersController.removeUser)

    this.app.put('/users/:userId', [
      body('email').isEmail(),
      body('password').isLength({ min: 5 }).withMessage('Must include password (5+ characters)'),
      body('firstName').isString(),
      body('lastName').isString(),
      body('permissionFlags').isInt(),
      BodyValidationMiddleware.verifyBodyFieldsErrors,
      UsersMiddleware.validateSameEmailBelongToSameUser,
      UsersController.put
    ])

    this.app.patch('/users/:userId', [
      body('email').isEmail().optional(),
      body('password').isLength({ min: 5 }).withMessage('Password must be 5+ characters').optional(),
      body('firstName').isString().optional(),
      body('lastName').isString().optional(),
      body('permissionFlags').isInt().optional(),
      BodyValidationMiddleware.verifyBodyFieldsErrors,
      UsersMiddleware.validatePatchEmail,
      UsersController.patch
    ])

    return this.app
  }
}
