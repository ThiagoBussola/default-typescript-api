import { CommonRoutesConfig } from '../common/common.routes.config'
import express from 'express'

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
      .get((req: express.Request, res: express.Response) => {
        res.status(200).send('List of Users')
      })
      .post((req: express.Request, res: express.Response) => {
        res.status(200).send('Post to Users')
      })

    this.app.route('/users/:userId')
      .all((req: express.Request, res: express.Response, next: express.NextFunction) => {
        // this middleware function runs before any request to /users/:userId
        // this function will help when for example we are doing authentications on the route.
        // but it doesn't accomplish anything just yet
        // it simply passes control to the next applicable function below using next()

        next()
      })
      .get((req: express.Request, res: express.Response) => {
        res.status(200).send(`GET requested for id: ${req.params.userId}`)
      })
      .put((req: express.Request, res: express.Response) => {
        res.status(200).send(`PUT requested for id: ${req.params.userId}`)
      })
      .patch((req: express.Request, res: express.Response) => {
        res.status(200).send(`PATCH requested for id: ${req.params.userId}`)
      })
      .delete((req: express.Request, res: express.Response) => {
        res.status(200).send(`DELETE requested for id: ${req.params.userId}`)
      })

    return this.app
  }
}
