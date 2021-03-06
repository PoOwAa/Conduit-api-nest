import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/**
 * Service dealing with app config based operations.
 *
 * @class
 */
@Injectable()
export class AppConfigService {
  constructor(private configService: ConfigService) {}

  get env(): string {
    return this.configService.get<string>('app.env');
  }

  get name(): string {
    return this.configService.get<string>('app.name');
  }

  get port(): number {
    return Number(this.configService.get<number>('app.port'));
  }

  get jwtSecret(): string {
    return this.configService.get<string>('app.jwtSecret');
  }
}
