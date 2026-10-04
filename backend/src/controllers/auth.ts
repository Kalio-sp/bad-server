import { Request, Response, NextFunction } from "express";
import { constants } from "http2";
import User from "../models/user";
import BadRequestError from "../errors/bad-request-error";
import UnauthorizedError from "../errors/unauthorized-error";
import { ACCESS_TOKEN } from "../../config";

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = await User.create(req.body);

    const accessToken = user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
    });

    res.status(constants.HTTP_STATUS_CREATED).json({
      user,
      accessToken,
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, password } = req.body;

    const user = await User.findUserByCredentials(email, password);

    const accessToken = user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
    });

    res.json({
      user,
      accessToken,
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    res.clearCookie("refreshToken");
    res.sendStatus(constants.HTTP_STATUS_NO_CONTENT);
  } catch (error) {
    next(error);
  }
};

export const getCurrentUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    res.json(req.user);
  } catch (error) {
    next(error);
  }
};

export const getCurrentUserRoles = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    res.json({
      roles: req.user?.roles,
    });
  } catch (error) {
    next(error);
  }
};

export const refreshAccessToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.cookies.refreshToken;

    if (!token) {
      throw new UnauthorizedError("Нет refresh токена");
    }

    const payload = ACCESS_TOKEN;

    res.json({
      token: payload,
    });
  } catch (error) {
    next(error);
  }
};

export const updateCurrentUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = await User.findByIdAndUpdate(req.user?._id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      throw new BadRequestError("Пользователь не найден");
    }

    res.json(user);
  } catch (error) {
    next(error);
  }
};
