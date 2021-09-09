import { CreateUserDto } from '../dto/create.user.dto'
import { PatchUserDto } from '../dto/patch.user.dto'
import { PutUserDto } from '../dto/put.user.dto'

import mongooseService from '../../common/services/mongoose.service'

import shortid from 'shortid'
import debug from 'debug'

const log: debug.IDebugger = debug('app:in-memory-dao')

class UsersDao {
  Schema = mongooseService.getMongoose().Schema

  userSchema = new this.Schema({
    _id: String,
    email: String,
    password: { type: String, select: false },
    firstName: String,
    lastName: String
  },
  { id: false, timestamps: true })

  User = mongooseService.getMongoose().model('Users', this.userSchema)

  constructor () {
    log('Created new instance of UsersDao')
  }

  async addUser (userFields: CreateUserDto) {
    const userId = shortid.generate()
    const user = new this.User({
      _id: userId,
      ...userFields
    })

    await user.save()
    // as we are going to return the entire user in the route the select false doesn't work in .save(),
    // so we are doing the search for the newly created user and returning it without the password
    const findNewUSer = await this.getUserById(user._id)

    return findNewUSer
  }

  async getUserByEmail (email: string) {
    return this.User.findOne({ email: email }).exec()
  }

  // this function is necessary to have the password as we are inhibiting the user from searching the password in any route
  // through mongoose and filters in searches.
  async getUserByEmailWithPassword (email: string) {
    return this.User.findOne({ email: email })
      .select('_id email +password')
      .exec()
  }

  async getUserById (userId: string) {
    return this.User.findById({ _id: userId }).exec()
  }

  async getUsers (limit = 25, page = 0) {
    return this.User.find()
      .limit(limit)
      .skip(limit * page)
      .exec()
  }

  async updateUserById (userId: string, userFields: PatchUserDto | PutUserDto) {
    const existingUser = await this.User.findByIdAndUpdate(userId,
      { $set: userFields },
      { new: true }
    ).exec()

    return existingUser
  }

  async removeUserById (userId: string) {
    return this.User.findByIdAndDelete(userId).select('-password').exec()
  }
}

export default new UsersDao()
