import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { RegisterDto, LoginDto, AuthResponse } from '../dto/auth.dto';
import { AppError } from '../../../utils/AppError';
import { config } from '../../../config/server';

const prisma = new PrismaClient();

export class AuthService {
  private generateTokens(userId: number, role: string) {
    const payload = { userId: userId.toString(), role };
    
    const accessToken = jwt.sign(
      payload,
      config.JWT_SECRET,
      { expiresIn: config.JWT_EXPIRES_IN }
    );

    const refreshToken = jwt.sign(
      payload,
      config.JWT_REFRESH_SECRET,
      { expiresIn: config.JWT_REFRESH_EXPIRES_IN }
    );

    return { accessToken, refreshToken };
  }

  async register(userData: RegisterDto): Promise<AuthResponse> {
    const { name, email, password } = userData;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      throw new AppError('User with this email already exists', 400);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Split name into firstName and lastName
    const nameParts = name.trim().split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(' ') || '';

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash: hashedPassword,
        firstName,
        lastName,
        username: email, // Use email as username for now
        role: 'user', // Default role
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        createdAt: true,
      }
    });

    // Generate tokens
    const { accessToken, refreshToken } = this.generateTokens(user.id, user.role);

    return {
      user: {
        id: user.id.toString(),
        name: `${user.firstName} ${user.lastName}`.trim(),
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt,
      },
      token: accessToken,
      refreshToken,
    };
  }

  async login(credentials: LoginDto): Promise<AuthResponse> {
    const { email, password } = credentials;

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        passwordHash: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        createdAt: true,
      }
    });

    if (!user) {
      throw new AppError('Invalid email or password', 400);
    }

    if (!user.isActive) {
      throw new AppError('Account is deactivated', 400);
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new AppError('Invalid email or password', 400);
    }

    // Generate tokens
    const { accessToken, refreshToken } = this.generateTokens(user.id, user.role);

    return {
      user: {
        id: user.id.toString(),
        name: `${user.firstName} ${user.lastName}`.trim(),
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt,
      },
      token: accessToken,
      refreshToken,
    };
  }

  async logout(token: string): Promise<void> {
    // In a production app, you might want to blacklist the token
    // For now, we'll just acknowledge the logout
    // You could store blacklisted tokens in Redis or database
    console.log(`User logged out with token: ${token.substring(0, 20)}...`);
  }

  async verifyToken(token: string): Promise<{ userId: string; role: string }> {
    try {
      const decoded = jwt.verify(token, config.JWT_SECRET) as { userId: string; role: string };
      return decoded;
    } catch (error) {
      throw new AppError('Invalid or expired token', 401);
    }
  }
} 