import { expect, it, describe } from 'vitest'
import { RegisterService } from './register.js'
import { compare } from 'bcryptjs'
import { InMemoryUsersRepository } from '@/repositories/in-memory-users-repository.js'
import { EmailAlreadyExistsError } from './errors/email-already-exists-error.js'

describe('Register test', () => {
  it('should hash user password upon registration', async () => {
    const inMemoryUsersRepository = new InMemoryUsersRepository()
    const registerUserCase = new RegisterService(inMemoryUsersRepository)

    const password = '123456'

    const user = await registerUserCase.execute({
      email: 'test@test.com',
      name: 'Test User',
      password,
    })

    const isPasswordCorrectlyHashed = await compare(
      password,
      user.password_hash,
    )

    expect(isPasswordCorrectlyHashed).toBe(true)
  })

  it('should not be able to register with the same email twice', async () => {
    const inMemoryUsersRepository = new InMemoryUsersRepository()
    const registerUserCase = new RegisterService(inMemoryUsersRepository)

    const email = 'test@test.com'

    await registerUserCase.execute({
      email,
      name: 'Test User',
      password: '123456',
    })

    await expect(() => {
      return registerUserCase.execute({
        email,
        name: 'Test User',
        password: '123456',
      })
    }).rejects.toBeInstanceOf(EmailAlreadyExistsError)
  })

  it('should be able to register a new user', async () => {
    const inMemoryUsersRepository = new InMemoryUsersRepository()
    const registerUserCase = new RegisterService(inMemoryUsersRepository)

    const user = await registerUserCase.execute({
      email: 'test@test.com',
      name: 'Test User',
      password: '123456',
    })

    expect(user.id).toEqual(expect.any(String))
  })
})
