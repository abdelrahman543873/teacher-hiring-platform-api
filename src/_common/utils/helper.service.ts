import * as path from 'path';
import * as crypto from 'crypto';
import * as fs from 'fs';
import * as slug from 'speakingurl';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcryptjs';
import { generate } from 'voucher-code-generator';
import { Injectable } from '@nestjs/common';
import { Upload } from '../uploader/uploader.type';
import { Request } from 'express';
import { ImageExtensionsAsSet } from './image.extensions';
import { VideoExtensionsAsSet } from './video.extensions';
import { ICreateVerificationCode } from './helper.types';
import { env } from './env';
import { User } from 'src/user/models/user.model';
import { LangEnum, StatusEnum, UserRoleEnum } from 'src/user/user.enum';
import { BaseHttpException } from '../exceptions/base-http-exception';
import { isISO31661Alpha2 } from 'class-validator';
import { TokenPayload } from 'src/auth/auth-token-payload.type';
import { UserRepository } from 'src/user/repositories/user.repository';

@Injectable()
export class HelperService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  slugify(value: string): string {
    if (value.charAt(value.length - 1) === '-') value = value.slice(0, value.length - 1);
    return `${slug(value, { titleCase: true })}-${
      generate({
        charset: '123456789abcdefghgklmnorstuvwxyz',
        length: 4
      })[0]
    }`.toLowerCase();
  }

  updateProvidedFields<T>(model: T, input: Record<string, any>): T {
    Object.keys(input).map(field => (model[field] = input[field]));
    return model;
  }

  async getFileName(file: Upload | string) {
    if (typeof file === 'string') return file;

    const { filename } = await file;
    return filename;
  }

  upperFirstWord(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  isImage(filePath: string): boolean {
    if (!filePath) return false;
    return ImageExtensionsAsSet.has(path.extname(filePath).slice(1).toLowerCase());
  }

  isVideo(filePath: string): boolean {
    if (!filePath) return false;
    return VideoExtensionsAsSet.has(path.extname(filePath).slice(1).toLowerCase());
  }

  encryptStringWithRsaPublicKey(toEncrypt: string, relativeOrAbsolutePathToPublicKey: string) {
    const absolutePath = path.resolve(relativeOrAbsolutePathToPublicKey);
    const publicKey = fs.readFileSync(absolutePath, 'utf8');
    const buffer = Buffer.from(toEncrypt);
    const encrypted = crypto.publicEncrypt(publicKey, buffer);
    return encrypted.toString('base64');
  }

  decryptStringWithRsaPrivateKey(toDecrypt: string, relativeOrAbsolutePathToPrivateKey: string) {
    const absolutePath = path.resolve(relativeOrAbsolutePathToPrivateKey);
    const privateKey = fs.readFileSync(absolutePath, 'utf8');
    const buffer = Buffer.from(toDecrypt, 'base64');
    const decrypted = crypto.privateDecrypt(privateKey, buffer);
    return decrypted.toString('utf8');
  }

  createVerificationCode(): ICreateVerificationCode {
    const code = env.NODE_ENV === 'production' ? Math.floor(1000 + Math.random() * 9000) : 1234;
    const expiryDate = new Date(Date.now() + Number(env.OTP_EXPIRY_TIME));
    return { code, expiryDate };
  }

  isDateGraterThanNow(date: Date): boolean {
    const currentVal = date.getTime();
    const nowVal = Date.now();
    return currentVal > nowVal;
  }

  async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 12);
  }

  generateAuthToken(id: string): string {
    return jwt.sign({ userId: id }, env.JWT_SECRET);
  }

  async checkPasswordAndHashIt(
    user: User,
    oldPassword: string,
    newPassword: string,
    lang: LangEnum
  ): Promise<string> {
    if (!(await bcrypt.compare(oldPassword, user.password))) throw new BaseHttpException(lang, 611);
    return await this.hashPassword(newPassword);
  }

  getLocale(req: Request): { lang: LangEnum; country: string } {
    if (!req) return { lang: LangEnum.EN, country: 'EG' };
    const locale = <string>req.headers.lang || 'eg-en';
    let country = locale.split('-')[0].toUpperCase();
    if (!country || !isISO31661Alpha2(country)) country = 'EG';
    const lang = locale.split('-')[1] === 'ar' ? LangEnum.AR : LangEnum.EN;
    return { lang, country };
  }

  async getCurrentUser(req: Request): Promise<User> {
    const token = this.getAuthToken(req);
    if (!token) return null;
    const { userId } = <TokenPayload>jwt.verify(token, env.JWT_SECRET);
    return await this.userRepository.findCurrentUserForContext(userId);
  }

  getAuthToken(req: Request): string {
    if (req && req.headers && (req.headers.authorization || req.headers.Authorization)) {
      let auth: string;
      if (req.headers.authorization) auth = req.headers.authorization;
      if (req.headers.Authorization) auth = <string>req.headers.Authorization;
      return auth.split(' ')[1];
    }
    return null;
  }

  hasPermission(permission: string, user: User): boolean {
    if (!user || !user.securityGroup || !user.securityGroup.id) return false;
    return user.securityGroup.permissions.includes(permission);
  }

  hasRole(rule: UserRoleEnum, user: User): boolean {
    if (!user || !user.role) return false;
    return user.role === rule;
  }

  hasStatus(status: StatusEnum[], user: User): boolean {
    if (!user) return false;
    return status.includes(user.status);
  }
}
