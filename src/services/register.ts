import { UsersRepository } from '@/repositories/users-repository-interface'
import { hash } from 'bcryptjs'
import { EmailAlreadyExistsError } from './errors/email-already-exists-error'
import { User } from '@prisma/client'

interface IRegister {
  name: string
  email: string
  password: string
}

export class RegisterService {
  constructor(private usersRepository: UsersRepository) {}

  async execute({ name, email, password }: IRegister): Promise<User> {
    const userEmailAlreadyExists = await this.usersRepository.findByEmail(email)

    if (userEmailAlreadyExists) {
      throw new EmailAlreadyExistsError()
    }

    const passwordHash = await hash(password, 6)

    const user = await this.usersRepository.create({
      name,
      email,
      password_hash: passwordHash,
    })

    return user
  }
}
