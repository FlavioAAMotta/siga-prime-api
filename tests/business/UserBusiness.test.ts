
import { UserBusiness } from "../../src/business/UserBusiness"
import { HashManager } from "../../src/services/HashManager"
import { IdGenerator } from "../../src/services/IdGenerator"
import { TokenManager, USER_ROLES } from "../../src/services/TokenManager"
import { UserDatabase } from "../../src/data/UserDatabase"
import { LoginInputDTO, SignupInputDTO, UserRole } from "../../src/model/User"

describe("UserBusiness", () => {
    let userBusiness: UserBusiness
    let userDatabaseMock: any
    let idGeneratorMock: any
    let hashManagerMock: any
    let tokenManagerMock: any

    beforeEach(() => {
        userDatabaseMock = {
            findUserByEmail: jest.fn(),
            insertUser: jest.fn(),
            insertUserRole: jest.fn(),
            findUserRole: jest.fn()
        }
        idGeneratorMock = {
            generate: jest.fn().mockReturnValue("id-mock")
        }
        hashManagerMock = {
            hash: jest.fn().mockReturnValue("hash-mock"),
            compare: jest.fn().mockReturnValue(true)
        }
        // TokenManager not used in signup yet, but good to have ready
        tokenManagerMock = {
            createToken: jest.fn().mockReturnValue("token-mock"),
            getPayload: jest.fn()
        }

        userBusiness = new UserBusiness(
            userDatabaseMock as unknown as UserDatabase,
            idGeneratorMock as unknown as IdGenerator,
            hashManagerMock as unknown as HashManager,
            tokenManagerMock as unknown as TokenManager
        )
    })

    test("Signup successful", async () => {
        const input: SignupInputDTO = {
            email: "test@example.com",
            password: "password123"
        }

        userDatabaseMock.findUserByEmail.mockResolvedValue(null)

        await userBusiness.signup(input)

        expect(userDatabaseMock.findUserByEmail).toHaveBeenCalledWith(input.email)
        expect(hashManagerMock.hash).toHaveBeenCalledWith(input.password)
        expect(idGeneratorMock.generate).toHaveBeenCalled()
        expect(userDatabaseMock.insertUser).toHaveBeenCalled()
        expect(userDatabaseMock.insertUserRole).toHaveBeenCalledWith("id-mock", UserRole.ADMIN)
    })

    test("Signup failure: User already exists", async () => {
        const input: SignupInputDTO = {
            email: "test@example.com",
            password: "password123"
        }

        userDatabaseMock.findUserByEmail.mockResolvedValue({ id: "existing-id" })

        await expect(userBusiness.signup(input)).rejects.toThrow("User already exists")
    })

    test("Signup failure: Missing email", async () => {
        const input: SignupInputDTO = {
            email: "",
            password: "password123"
        }

        await expect(userBusiness.signup(input)).rejects.toThrow("Email and password are required")
    })

    test("Login successful", async () => {
        const input: LoginInputDTO = {
            email: "test@example.com",
            password: "password123"
        }

        const userMock = {
            id: "id-mock",
            email: input.email,
            password: "hash-mock"
        }

        userDatabaseMock.findUserByEmail.mockResolvedValue(userMock)
        hashManagerMock.compare.mockResolvedValue(true)
        userDatabaseMock.findUserRole.mockResolvedValue(UserRole.ADMIN)
        tokenManagerMock.createToken.mockReturnValue("token-mock")

        const result = await userBusiness.login(input)

        expect(result).toBe("token-mock")
        expect(userDatabaseMock.findUserByEmail).toHaveBeenCalledWith(input.email)
        expect(hashManagerMock.compare).toHaveBeenCalledWith(input.password, userMock.password)
        expect(userDatabaseMock.findUserRole).toHaveBeenCalledWith(userMock.id)
        expect(tokenManagerMock.createToken).toHaveBeenCalled()
    })

    test("Login failure: User not found", async () => {
        const input: LoginInputDTO = {
            email: "test@example.com",
            password: "password123"
        }

        userDatabaseMock.findUserByEmail.mockResolvedValue(null)

        await expect(userBusiness.login(input)).rejects.toThrow("Invalid credentials")
    })

    test("Login failure: Incorrect password", async () => {
        const input: LoginInputDTO = {
            email: "test@example.com",
            password: "password123"
        }

        const userMock = {
            id: "id-mock",
            email: input.email,
            password: "hash-mock"
        }

        userDatabaseMock.findUserByEmail.mockResolvedValue(userMock)
        hashManagerMock.compare.mockResolvedValue(false)

        await expect(userBusiness.login(input)).rejects.toThrow("Invalid credentials")
    })
})
