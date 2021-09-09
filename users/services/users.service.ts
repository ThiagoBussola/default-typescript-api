import UsersDao from '../daos/users.dao'
import { CRUD } from '../../common/interfaces/crud.interface'
import { CreateUserDto } from '../dto/create.user.dto'
import { PutUserDto } from '../dto/put.user.dto'
import { PatchUserDto } from '../dto/patch.user.dto'

class UsersService implements CRUD {
  async create (resource: CreateUserDto) {
    return await UsersDao.addUser(resource)
  }

  async deleteById (id: string) {
    return await UsersDao.removeUserById(id)
  }

  async list (limit: number, page: number) {
    return await UsersDao.getUsers(limit, page)
  }

  async patchById (id: string, resource: PatchUserDto): Promise<any> {
    return await UsersDao.updateUserById(id, resource)
  }

  async putById (id: string, resource: PutUserDto): Promise<any> {
    return await UsersDao.updateUserById(id, resource)
  }

  async readById (id: string) {
    return await UsersDao.getUserById(id)
  }

  async getUserByEmail (email: string) {
    return await UsersDao.getUserByEmail(email)
  }

  async getUserByEmailWithPassword (email: string) {
    return await UsersDao.getUserByEmailWithPassword(email)
  }
}

export default new UsersService()
