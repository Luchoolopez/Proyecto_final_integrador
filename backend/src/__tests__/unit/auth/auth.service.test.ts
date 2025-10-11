import { User } from '../../../models/user.model';
import { AuthService } from '../../../services/auth.service';
import { AuthHelpers } from '../../../utils/auth/auth.helpers';
import { TokenManager } from '../../../utils/auth/token.manager';
import { AUTH_ERROR_MESSAGES } from '../../../utils/auth/auth.constants';

jest.mock('../../../models/user.model');
jest.mock('../../../utils/auth/auth.helpers');
jest.mock('../../../utils/auth/token.manager');

describe('AuthService', () => {
    let authService: AuthService;

    beforeEach(() => {
        authService = new AuthService();
        jest.clearAllMocks();
    });

    describe('register', () => {
        it('should register a new user successfully', async () => {
            const registerData = {
                nombre: 'Test User',
                email: 'test@test.com',
                password: 'password123',
                telefono: '1234567890'
            };

            const mockUser = {
                id: 1,
                ...registerData,
                rol: 'usuario',
                activo: true,
                update: jest.fn()
            };

            (User.findOne as jest.Mock).mockResolvedValue(null);
            (AuthHelpers.hashPassword as jest.Mock).mockResolvedValue('hashedPassword');
            (User.create as jest.Mock).mockResolvedValue(mockUser);
            (TokenManager.generateAccessToken as jest.Mock).mockReturnValue('mockAccessToken');
            (TokenManager.generateRefreshToken as jest.Mock).mockReturnValue('mockRefreshToken');
            (AuthHelpers.sanitizeUserForResponse as jest.Mock).mockReturnValue({ 
                id: mockUser.id,
                nombre: mockUser.nombre,
                email: mockUser.email
            });

            const result = await authService.register(registerData);

            expect(result).toHaveProperty('user');
            expect(result).toHaveProperty('accessToken', 'mockAccessToken');
            expect(result).toHaveProperty('refreshToken', 'mockRefreshToken');
            expect(User.create).toHaveBeenCalled();
            expect(mockUser.update).toHaveBeenCalled();
        });

        it('should throw error when email already exists', async () => {
            const registerData = {
                nombre: 'Test User',
                email: 'existing@test.com',
                password: 'password123'
            };

            (User.findOne as jest.Mock).mockResolvedValue({ id: 1, email: registerData.email });

            await expect(authService.register(registerData))
                .rejects
                .toThrow(AUTH_ERROR_MESSAGES.EMAIL_ALREADY_EXISTS);
        });
    });

    describe('login', () => {
        it('should login user successfully', async () => {
            const loginData = {
                email: 'test@test.com',
                password: 'password123'
            };

            const mockUser = {
                id: 1,
                email: loginData.email,
                password: 'hashedPassword',
                activo: true,
                update: jest.fn()
            };

            (User.findOne as jest.Mock).mockResolvedValue(mockUser);
            (AuthHelpers.comparePassword as jest.Mock).mockResolvedValue(true);
            (TokenManager.generateAccessToken as jest.Mock).mockReturnValue('mockAccessToken');
            (TokenManager.generateRefreshToken as jest.Mock).mockReturnValue('mockRefreshToken');
            (AuthHelpers.sanitizeUserForResponse as jest.Mock).mockReturnValue({
                id: mockUser.id,
                email: mockUser.email
            });

            const result = await authService.login(loginData);

            expect(result).toHaveProperty('user');
            expect(result).toHaveProperty('accessToken', 'mockAccessToken');
            expect(result).toHaveProperty('refreshToken', 'mockRefreshToken');
            expect(mockUser.update).toHaveBeenCalled();
        });

        it('should throw error when user not found', async () => {
            const loginData = {
                email: 'nonexistent@test.com',
                password: 'password123'
            };

            (User.findOne as jest.Mock).mockResolvedValue(null);

            await expect(authService.login(loginData))
                .rejects
                .toThrow(AUTH_ERROR_MESSAGES.INVALID_CREDENTIALS);
        });

        it('should throw error when account is inactive', async () => {
            const loginData = {
                email: 'inactive@test.com',
                password: 'password123'
            };

            const mockUser = {
                id: 1,
                email: loginData.email,
                password: 'hashedPassword',
                activo: false
            };

            (User.findOne as jest.Mock).mockResolvedValue(mockUser);

            await expect(authService.login(loginData))
                .rejects
                .toThrow(AUTH_ERROR_MESSAGES.ACCOUNT_INACTIVE);
        });

        it('should throw error when password is incorrect', async () => {
            const loginData = {
                email: 'test@test.com',
                password: 'wrongpassword'
            };

            const mockUser = {
                id: 1,
                email: loginData.email,
                password: 'hashedPassword',
                activo: true
            };

            (User.findOne as jest.Mock).mockResolvedValue(mockUser);
            (AuthHelpers.comparePassword as jest.Mock).mockResolvedValue(false);

            await expect(authService.login(loginData))
                .rejects
                .toThrow(AUTH_ERROR_MESSAGES.INVALID_CREDENTIALS);
        });
    });
});