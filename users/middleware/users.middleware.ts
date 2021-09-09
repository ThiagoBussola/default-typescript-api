import express from 'express'
import userService from '../services/users.service'

class UsersMiddleware {
  async validateSameEmailDoesntExist (req: express.Request, res: express.Response, next: express.NextFunction) {
    const user = await userService.getUserByEmail(req.body.email)
    if (user) {
      res.status(400).send({ errors: ['User email already exists'] })
    } else {
      next()
    }
  }

  async validateSameEmailBelongToSameUser (req: express.Request, res: express.Response, next: express.NextFunction) {
    if (res.locals.user._id === req.params.userId) {
      next()
    } else {
      res.status(400).send({ errors: ['Invalid email'] })
    }
  }

  // Here we need to use an arrow function to bind `this` correctly
  validatePatchEmail = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (req.body.email) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      this.validateSameEmailBelongToSameUser(req, res, next)
    } else {
      next()
    }
  }

  async validateUserExists (req: express.Request, res: express.Response, next: express.NextFunction
  ) {
    const user = await userService.readById(req.params.userId)
    if (user) {
      res.locals.user = user
      next()
    } else {
      res.status(404).send({
        errors: [`User ${req.params.userId} not found`]
      })
    }
  }

  async extractUserId (req: express.Request, res: express.Response, next: express.NextFunction) {
    req.body._id = req.params.userId
    next()
  }
}

export default new UsersMiddleware()
