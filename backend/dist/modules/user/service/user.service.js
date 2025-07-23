"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const server_1 = require("../../../config/server");
const user_repository_1 = require("../repository/user.repository");
const error_handler_1 = require("../../../utils/error-handler");
class UserService {
    constructor() {
        this.userRepository = new user_repository_1.UserRepository();
    }
    async register(userData) {
        const existingUser = await this.userRepository.findByEmail(userData.email);
        if (existingUser) {
            throw new error_handler_1.ConflictError('User with this email already exists');
        }
        const hashedPassword = await bcryptjs_1.default.hash(userData.password, server_1.config.BCRYPT_ROUNDS);
        const user = await this.userRepository.create({
            ...userData,
            password: hashedPassword,
        });
        const { accessToken, refreshToken } = this.generateTokens(user);
        return {
            user: this.mapToResponseDto(user),
            accessToken,
            refreshToken,
        };
    }
    async createUser(userData) {
        const existingUser = await this.userRepository.findByEmail(userData.email);
        if (existingUser) {
            throw new error_handler_1.ConflictError('User with this email already exists');
        }
        const hashedPassword = await bcryptjs_1.default.hash(userData.password, server_1.config.BCRYPT_ROUNDS);
        const user = await this.userRepository.create({
            ...userData,
            password: hashedPassword,
        });
        return this.mapToResponseDto(user);
    }
    async login(credentials) {
        const user = await this.userRepository.findByEmail(credentials.email);
        if (!user) {
            throw new error_handler_1.AuthenticationError('Invalid email or password');
        }
        if (!user.isActive) {
            throw new error_handler_1.AuthenticationError('Account is deactivated');
        }
        const isPasswordValid = await bcryptjs_1.default.compare(credentials.password, user.password);
        if (!isPasswordValid) {
            throw new error_handler_1.AuthenticationError('Invalid email or password');
        }
        const { accessToken, refreshToken } = this.generateTokens(user);
        return {
            user: this.mapToResponseDto(user),
            accessToken,
            refreshToken,
        };
    }
    async refreshToken(refreshToken) {
        try {
            const decoded = jsonwebtoken_1.default.verify(refreshToken, server_1.config.JWT_REFRESH_SECRET);
            const user = await this.userRepository.findById(decoded.id);
            if (!user || !user.isActive) {
                throw new error_handler_1.AuthenticationError('Invalid refresh token');
            }
            return this.generateTokens(user);
        }
        catch (error) {
            throw new error_handler_1.AuthenticationError('Invalid refresh token');
        }
    }
    async getProfile(userId) {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new error_handler_1.NotFoundError('User not found');
        }
        return this.mapToResponseDto(user);
    }
    async updateProfile(userId, updateData) {
        const existingUser = await this.userRepository.findById(userId);
        if (!existingUser) {
            throw new error_handler_1.NotFoundError('User not found');
        }
        if (updateData.email && updateData.email !== existingUser.email) {
            const emailExists = await this.userRepository.existsByEmail(updateData.email, userId);
            if (emailExists) {
                throw new error_handler_1.ConflictError('Email is already in use');
            }
        }
        const updatedUser = await this.userRepository.update(userId, updateData);
        return this.mapToResponseDto(updatedUser);
    }
    async changePassword(userId, passwordData) {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new error_handler_1.NotFoundError('User not found');
        }
        const isCurrentPasswordValid = await bcryptjs_1.default.compare(passwordData.currentPassword, user.password);
        if (!isCurrentPasswordValid) {
            throw new error_handler_1.ValidationError('Current password is incorrect');
        }
        const hashedNewPassword = await bcryptjs_1.default.hash(passwordData.newPassword, server_1.config.BCRYPT_ROUNDS);
        await this.userRepository.updatePassword(userId, hashedNewPassword);
    }
    async getUsers(query) {
        const result = await this.userRepository.findMany(query);
        return {
            users: result.users.map(user => this.mapToResponseDto(user)),
            meta: {
                total: result.total,
                page: result.page,
                limit: result.limit,
                totalPages: result.totalPages,
            },
        };
    }
    async getUserById(id) {
        const user = await this.userRepository.findById(id);
        if (!user) {
            throw new error_handler_1.NotFoundError('User not found');
        }
        return this.mapToResponseDto(user);
    }
    async deleteUser(id) {
        const user = await this.userRepository.findById(id);
        if (!user) {
            throw new error_handler_1.NotFoundError('User not found');
        }
        await this.userRepository.delete(id);
    }
    generateTokens(user) {
        const payload = {
            id: user.id,
            email: user.email,
            role: user.role,
        };
        const accessToken = jsonwebtoken_1.default.sign(payload, server_1.config.JWT_SECRET, {
            expiresIn: server_1.config.JWT_EXPIRES_IN,
        });
        const refreshToken = jsonwebtoken_1.default.sign(payload, server_1.config.JWT_REFRESH_SECRET, {
            expiresIn: server_1.config.JWT_REFRESH_EXPIRES_IN,
        });
        return { accessToken, refreshToken };
    }
    mapToResponseDto(user) {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }
}
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map