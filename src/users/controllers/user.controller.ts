// we import express to add types to the request/response objects from our controller functions
import express from 'express'

// we import our newly created user services
import usersService from '../services/users.service'

// we import the argon2 library for password hashing
import argon2 from 'argon2'

/*
  Request: The Request is the way Express.js represents the HTTP request to be handled.
    This type upgrades and extends the native Node.js request type.
  Response: The Request is the way Express.js represents the HTTP request to be handled.
    This type upgrades and extends the native Node.js request type.
  NextFunction: Serves as a callback function, allowing control to pass through any other middleware functions.
     Along the way, all middleware will share the same request and response objects before the controller finally sends
     a response back to the requester.
  */

class UserController {
  async createUser (req: express.Request, res: express.Response) {
    req.body.password = await argon2.hash(req.body.password)
    const user = await usersService.create(req.body)
    res.status(201).send(user)
  }

  async getUserById (req: express.Request, res: express.Response) {
    const user = await usersService.readById(req.body._id)
    res.status(200).send(user)
  }

  async listUsers (req: express.Request, res: express.Response) {
    const users = await usersService.list(100, 0)
    res.status(200).send(users)
  }

  // depois retornar o usuário atualizado
  async put (req: express.Request, res: express.Response) {
    req.body.password = await argon2.hash(req.body.password)
    const updatedUser = await usersService.putById(req.body._id, req.body)
    res.status(200).send(updatedUser)
  }

  async patch (req: express.Request, res: express.Response) {
    if (req.body.password) {
      req.body.password = await argon2.hash(req.body.password)
    }
    const updatedUser = await usersService.patchById(req.body._id, req.body)
    res.status(200).send(updatedUser)
  }

  async removeUser (req: express.Request, res: express.Response) {
    const removedUser = await usersService.deleteById(req.body._id)
    res.status(200).send(removedUser)
  }
}

export default new UserController()
