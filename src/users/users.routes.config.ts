import { CommonRoutesConfig } from '../common/common.routes.config'
import UsersMiddleware from './middleware/user.middleware'
import UsersController from './controllers/user.controller'
import express from 'express'
import BodyValidationMiddleware from '../common/middleware/body.validation.middleware'
import { body } from 'express-validator'
import jwtMiddleware from '../auth/middleware/jwt.middleware'
import permissionMiddleware from '../common/middleware/common.permission.middleware'
import { PermissionFlag } from '../common/middleware/common.permissionflag.enum'

export class UsersRoutes extends CommonRoutesConfig {
  constructor (app: express.Application) {
    super(app, 'UserRoutes')
  }

  configureRoutes () {
    this.app.route('/users')
      .get(
        // adding jwt validation, only authenticated users can list users
        jwtMiddleware.validJWTNeeded,
        permissionMiddleware.permissionFlagRequired(
          PermissionFlag.ADMIN_PERMISSION
        ),
        UsersController.listUsers
      )
      .post(
        body('email').isEmail(),
        body('password').isLength({ min: 5 }).withMessage('Must include password (5+ characters)'),
        BodyValidationMiddleware.verifyBodyFieldsErrors,
        UsersMiddleware.validateSameEmailDoesntExist,
        UsersController.createUser
      )

    this.app.param('userId', UsersMiddleware.extractUserId)

    this.app.route('/users/:userId')
    // for all routes that include a userId, we want only that same user or an admin to have access
      .all(
        UsersMiddleware.validateUserExists,
        jwtMiddleware.validJWTNeeded,
        permissionMiddleware.onlySameUserOrAdminCanDoThisAction
      )
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
      UsersMiddleware.userCantChangePermission,
      permissionMiddleware.permissionFlagRequired(
        PermissionFlag.PAID_PERMISSION
      ),
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
      UsersMiddleware.userCantChangePermission,
      permissionMiddleware.permissionFlagRequired(
        PermissionFlag.PAID_PERMISSION
      ),
      UsersController.patch
    ])

    return this.app
  }
}
