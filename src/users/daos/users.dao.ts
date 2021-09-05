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
    lastName: String,
    permissionFlags: Number
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
      ...userFields,
      permissionFlag: 1
    })

    await user.save()
    // como vamos retornar o usuário inteiro na rota o select false não funciona no .save(),
    // então estamos realizando a busca do usuário recem criado e retornando ele sem a senha
    const findNewUSer = await this.getUserById(user._id)

    return findNewUSer
  }

  async getUserByEmail (email: string) {
    return await this.User.findOne({ email: email }).exec()
  }

  async getUserById (userId: string) {
    return await this.User.findById({ _id: userId }).exec() // .populate('User')
  }

  async getUsers (limit = 25, page = 0) {
    return await this.User.find()
      .limit(limit)
      .skip(limit * page)
      .exec()
  }

  async updateUserById (userId: string, userFields: PatchUserDto | PutUserDto) {
    const existingUser = await this.User.findByIdAndUpdate(
      { _id: userId },
      { $set: userFields },
      { new: true }
    ).exec()

    return existingUser
  }

  async removeUserById (userId: string) {
    return await this.User.deleteOne({ _id: userId }).exec()
  }
}

export default new UsersDao()
