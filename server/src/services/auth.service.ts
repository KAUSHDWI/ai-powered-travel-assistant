import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { Admin } from '../models/Admin.model.js';
import { env } from '../config/env.js';
import { JWT_CONFIG } from '../config/constants.js';
import { ApiError } from '../utils/apiError.js';
import { logger } from '../config/logger.js';
import type { AdminPayload, TokenPair } from '../types/index.js';

/**
 * Authenticate an admin user and return a JWT token pair.
 */
export async function loginAdmin(
  email: string,
  password: string
): Promise<{ admin: AdminPayload; tokens: TokenPair }> {
  const admin = await Admin.findOne({ email: email.toLowerCase() });

  if (!admin) {
    logger.warn({ email: '***' }, 'Login attempt for non-existent admin');
    throw ApiError.unauthorized('Invalid email or password');
  }

  const isPasswordValid = await admin.comparePassword(password);
  if (!isPasswordValid) {
    logger.warn({ adminId: admin._id }, 'Failed login attempt — invalid password');
    throw ApiError.unauthorized('Invalid email or password');
  }

  const payload: AdminPayload = {
    id: admin._id.toString(),
    email: admin.email,
    role: admin.role,
  };

  const tokens = generateTokenPair(payload);

  // Store hashed refresh token for rotation
  const refreshHash = await bcrypt.hash(tokens.refreshToken, 10);
  admin.refreshTokenHash = refreshHash;
  await admin.save();

  logger.info({ adminId: admin._id }, 'Admin logged in successfully');

  return { admin: payload, tokens };
}

/**
 * Refresh an access token using a valid refresh token.
 * Implements token rotation — old refresh token is invalidated.
 */
export async function refreshAccessToken(
  refreshToken: string
): Promise<TokenPair> {
  let decoded: AdminPayload & { type: string };

  try {
    decoded = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET) as AdminPayload & {
      type: string;
    };
  } catch {
    throw ApiError.unauthorized('Invalid or expired refresh token');
  }

  if (decoded.type !== JWT_CONFIG.REFRESH_TOKEN_TYPE) {
    throw ApiError.unauthorized('Invalid token type');
  }

  const admin = await Admin.findById(decoded.id);
  if (!admin || !admin.refreshTokenHash) {
    throw ApiError.unauthorized('Admin not found or session invalidated');
  }

  // Verify the refresh token matches the stored hash
  const isTokenValid = await bcrypt.compare(refreshToken, admin.refreshTokenHash);
  if (!isTokenValid) {
    // Possible token reuse attack — invalidate all sessions
    admin.refreshTokenHash = undefined;
    await admin.save();
    logger.warn({ adminId: admin._id }, 'Refresh token reuse detected — sessions invalidated');
    throw ApiError.unauthorized('Token has been revoked');
  }

  const payload: AdminPayload = {
    id: admin._id.toString(),
    email: admin.email,
    role: admin.role,
  };

  const tokens = generateTokenPair(payload);

  // Rotate: store new hashed refresh token
  admin.refreshTokenHash = await bcrypt.hash(tokens.refreshToken, 10);
  await admin.save();

  return tokens;
}

/**
 * Generate an access + refresh token pair.
 */
function generateTokenPair(payload: AdminPayload): TokenPair {
  const accessToken = jwt.sign(
    { ...payload, type: JWT_CONFIG.ACCESS_TOKEN_TYPE },
    env.JWT_ACCESS_SECRET,
    { expiresIn: env.JWT_ACCESS_EXPIRY as any }
  );

  const refreshToken = jwt.sign(
    { ...payload, type: JWT_CONFIG.REFRESH_TOKEN_TYPE },
    env.JWT_REFRESH_SECRET,
    { expiresIn: env.JWT_REFRESH_EXPIRY as any }
  );

  return { accessToken, refreshToken };
}
