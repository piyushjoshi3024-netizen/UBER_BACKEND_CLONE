const User = require('../models/user.model');
const { ApiError } = require('../utils/ApiError');

class UserService {
  async createUser(payload) {
    const { authUserId, name, email, phone, role = 'rider' } = payload;

    if (!authUserId || !name || !email || !phone) {
      throw new ApiError('authUserId, name, email, and phone are required', 400);
    }

    const existingUser = await User.findOne({ authUserId });

    if (existingUser) {
      return existingUser;
    }

    const normalizedEmail = String(email).trim().toLowerCase();

    const user = await User.create({
      _id: authUserId,
      authUserId,
      name: String(name).trim(),
      email: normalizedEmail,
      phone: String(phone).trim(),
      role,
    });

    return user;
  }

  async getUserById(userId) {
    const user = await User.findById(userId);

    if (!user) {
      throw new ApiError('User not found', 404);
    }

    return user;
  }

  async getAllUsers() {
    return User.find({}).sort({ createdAt: -1 });
  }

  async updateUser(userId, updatePayload, requester) {
    const user = await User.findById(userId);

    if (!user) {
      throw new ApiError('User not found', 404);
    }

    if (requester.role !== 'admin' && requester.userId !== userId) {
      throw new ApiError('Forbidden: cannot update this user', 403);
    }

    const allowedFields = ['name', 'phone', 'profileImage'];
    const updates = {};

    Object.keys(updatePayload).forEach((key) => {
      if (allowedFields.includes(key)) {
        updates[key] = updatePayload[key];
      }
    });

    if (Object.keys(updates).length === 0) {
      throw new ApiError('No valid fields provided to update', 400);
    }

    Object.assign(user, updates);
    await user.save();

    return user;
  }

  async deleteUser(userId, requester) {
    const user = await User.findById(userId);

    if (!user) {
      throw new ApiError('User not found', 404);
    }

    if (requester.role !== 'admin' && requester.userId !== userId) {
      throw new ApiError('Forbidden: cannot delete this user', 403);
    }

    await user.deleteOne();

    return { message: 'User deleted successfully' };
  }

  async blockUser(userId) {
    const user = await User.findById(userId);

    if (!user) {
      throw new ApiError('User not found', 404);
    }

    user.isBlocked = true;
    await user.save();

    return user;
  }

  async unblockUser(userId) {
    const user = await User.findById(userId);

    if (!user) {
      throw new ApiError('User not found', 404);
    }

    user.isBlocked = false;
    await user.save();

    return user;
  }
}

module.exports = new UserService();
