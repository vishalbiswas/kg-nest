import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigService } from '@nestjs/config';
import { readFileSync } from 'fs';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly configService: ConfigService,
  ) {}

  @Post()
  convertToJson(@Body() body: string) {
    return this.appService.convertToJson(body);
  }

  @Post('file')
  @HttpCode(200)
  async convertFileToJson() {
    const csvPath = this.configService.getOrThrow<string>('INPUT_CSV_PATH');
    const csv = readFileSync(csvPath, 'utf-8');
    const allUsers = this.appService.convertToJson(csv);
    const count = await this.appService.insertRowsIntoDatabase(allUsers);
    await this.appService.printAgeDistribution();

    return { count };
  }
}
