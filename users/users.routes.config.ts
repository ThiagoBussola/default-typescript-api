import { CommonRoutesConfig } from '../common/common.routes.config'
import UsersController from './controllers/users.controller'
import UsersMiddleware from './middleware/users.middleware'
import jwtMiddleware from '../auth/middleware/jwt.middleware'
import permissionMiddleware from '../common/middleware/common.permission.middleware'
import BodyValidationMiddleware from '../common/middleware/body.validation.middleware'
import { body } from 'express-validator'

import express from 'express'

export class UsersRoutes extends CommonRoutesConfig {
  constructor (app: express.Application) {
    super(app, 'UsersRoutes')
  }

  configureRoutes (): express.Application {
    this.app.route('/users')
      .get(
        // adding jwt validation, only authenticated users can list users
        jwtMiddleware.validJWTNeeded,
        UsersController.listUsers
      )
      .post(
        body('email').isEmail(),
        body('password')
          .isLength({ min: 5 })
          .withMessage('Must include password (5+ characters)'),
        BodyValidationMiddleware.verifyBodyFieldsErrors,
        UsersMiddleware.validateSameEmailDoesntExist,
        UsersController.createUser
      )

    this.app.param('userId', UsersMiddleware.extractUserId)
    this.app.route('/users/:userId')
      .all(
        // for all routes that include a userId, we want only that same user or an admin to have access
        UsersMiddleware.validateUserExists,
        jwtMiddleware.validJWTNeeded,
        permissionMiddleware.onlySameUserOrAdminCanDoThisAction
      )
      .get(UsersController.getUserById)
      .delete(UsersController.removeUser)

    this.app.put('/users/:userId', [
      body('email').isEmail(),
      body('password')
        .isLength({ min: 5 })
        .withMessage('Must include password (5+ characters)'),
      body('firstName').isString(),
      body('lastName').isString(),
      BodyValidationMiddleware.verifyBodyFieldsErrors,
      UsersMiddleware.validateSameEmailBelongToSameUser,
      UsersController.put
    ])

    this.app.patch('/users/:userId', [
      body('email').isEmail().optional(),
      body('password')
        .isLength({ min: 5 })
        .withMessage('Password must be 5+ characters')
        .optional(),
      body('firstName').isString().optional(),
      body('lastName').isString().optional(),
      BodyValidationMiddleware.verifyBodyFieldsErrors,
      UsersMiddleware.validatePatchEmail,
      UsersController.patch
    ])

    return this.app
  }
}
