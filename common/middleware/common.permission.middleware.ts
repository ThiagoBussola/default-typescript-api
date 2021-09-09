import express from 'express'
class CommonPermissionMiddleware {
  // factory

  async onlySameUserOrAdminCanDoThisAction (req: express.Request, res: express.Response, next: express.NextFunction) {
    // eslint-disable-next-line @typescript-eslint/prefer-optional-chain
    if (req.params && req.params.userId && req.params.userId === res.locals.jwt.userId
    ) {
      return next()
    } else {
      return res.status(403).send()
    }
  }
}

export default new CommonPermissionMiddleware()
