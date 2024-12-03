import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile, VerifyCallback } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvConfig } from '#/shared/configs/env.config';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private configService: ConfigService<EnvConfig, true>) {
    super({
      clientID: configService.get('GOOGLE_CLIENT_ID', { infer: true }),
      clientSecret: configService.get('GOOGLE_CLIENT_SECRET', { infer: true }),
      callbackURL: configService.get('GOOGLE_CALLBACK_URL', { infer: true }),
      scope: ['email', 'profile'],
    });
  }

  validate(accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback) {
    const { name, emails, photos, id } = profile;

    const user = {
      email: this.getValueFromProfileData(emails?.[0]?.value),
      firstName: this.getValueFromProfileData(name?.givenName),
      lastName: this.getValueFromProfileData(name?.familyName),
      picture: this.getValueFromProfileData(photos?.[0]?.value),
      accessToken,
      googleId: id,
    };

    return done(null, user);
  }

  getValueFromProfileData(value: string | undefined): string {
    return value || '';
  }
}
