import { User } from '../../../models/user.model';
import { UserService } from '../../../services/user.service';
import { UserFormatter } from '../../../utils/user/user.formatter';
import { ServiceHelpers } from '../../../utils/user/user.helpers';
import { ERROR_MESSAGES } from '../../../utils/user/user.constants';

// Mock de Sequelize
jest.mock('../../../models/user.model');

describe('UserService', () => {
    let userService: UserService;

    beforeEach(() => {
        userService = new UserService();
        jest.clearAllMocks();
    });

    describe('getUser', () => {
        it('should get a user by id successfully', async () => {
            const mockUser = {
                id: 1,
                nombre: 'Test User',
                email: 'test@test.com',
                rol: 'usuario',
                activo: true
            };

            (User.findByPk as jest.Mock).mockResolvedValue(mockUser);

            const result = await userService.getUser(1);
            expect(result).toEqual(mockUser);
            expect(User.findByPk).toHaveBeenCalledWith(1);
        });

        it('should throw error when user is not found', async () => {
            (User.findByPk as jest.Mock).mockResolvedValue(null);

            await expect(userService.getUser(1))
                .rejects
                .toThrow(ERROR_MESSAGES.USER_NOT_FOUND);
        });

        it('should throw error when id is not provided', async () => {
            await expect(userService.getUser(0))
                .rejects
                .toThrow(ERROR_MESSAGES.USER_NOT_FOUND);
        });
    });

    describe('getUsers', () => {
        it('should get all users successfully', async () => {
            const mockUsers = [
                {
                    id: 1,
                    nombre: 'User 1',
                    email: 'user1@test.com',
                    rol: 'usuario',
                    activo: true
                },
                {
                    id: 2,
                    nombre: 'User 2',
                    email: 'user2@test.com',
                    rol: 'usuario',
                    activo: true
                }
            ];

            (User.findAll as jest.Mock).mockResolvedValue(mockUsers);
            jest.spyOn(UserFormatter, 'formatUserListResponse').mockReturnValue(mockUsers);

            const result = await userService.getUsers();
            expect(result).toEqual(mockUsers);
            expect(User.findAll).toHaveBeenCalled();
        });
    });

    describe('updateUser', () => {
        it('should update user successfully', async () => {
            const mockUser = {
                id: 1,
                nombre: 'Test User',
                email: 'test@test.com',
                rol: 'usuario',
                activo: true,
                update: jest.fn(),
            };

            const updateData = {
                nombre: 'Updated User',
                email: 'updated@test.com'
            };

            (User.findByPk as jest.Mock).mockResolvedValue(mockUser);
            mockUser.update.mockResolvedValue({ ...mockUser, ...updateData });

            const result = await userService.updateUser(1, updateData);
            expect(mockUser.update).toHaveBeenCalled();
            expect(result).toBeDefined();
        });

        it('should throw error when updating non-existent user', async () => {
            (User.findByPk as jest.Mock).mockResolvedValue(null);

            await expect(userService.updateUser(1, { nombre: 'Test' }))
                .rejects
                .toThrow(ERROR_MESSAGES.USER_NOT_FOUND);
        });
    });

    describe('changePassword', () => {
        it('should change password successfully', async () => {
            const mockUser = {
                id: 1,
                password: 'hashedOldPassword',
                save: jest.fn()
            };

            (User.findByPk as jest.Mock).mockResolvedValue(mockUser);
            jest.spyOn(ServiceHelpers, 'comparePassword').mockResolvedValue(true);
            jest.spyOn(ServiceHelpers, 'hashPassword').mockResolvedValue('hashedNewPassword');

            await userService.changePassword(1, 'oldPassword', 'newPassword');
            expect(mockUser.save).toHaveBeenCalled();
        });

        it('should throw error when old password is incorrect', async () => {
            const mockUser = {
                id: 1,
                password: 'hashedOldPassword'
            };

            (User.findByPk as jest.Mock).mockResolvedValue(mockUser);
            jest.spyOn(ServiceHelpers, 'comparePassword').mockResolvedValue(false);

            await expect(userService.changePassword(1, 'wrongPassword', 'newPassword'))
                .rejects
                .toThrow(ERROR_MESSAGES.INVALID_PASSWORD);
        });
    });

    describe('deleteUser', () => {
        it('should delete user successfully', async () => {
            const mockUser = {
                id: 1,
                nombre: 'Test User',
                email: 'test@test.com',
                destroy: jest.fn()
            };

            (User.findByPk as jest.Mock).mockResolvedValue(mockUser);
            mockUser.destroy.mockResolvedValue(undefined);

            await userService.deleteUser(1);
            expect(mockUser.destroy).toHaveBeenCalled();
        });

        it('should throw error when deleting non-existent user', async () => {
            (User.findByPk as jest.Mock).mockResolvedValue(null);

            await expect(userService.deleteUser(1))
                .rejects
                .toThrow(ERROR_MESSAGES.USER_NOT_FOUND);
        });
    });
});