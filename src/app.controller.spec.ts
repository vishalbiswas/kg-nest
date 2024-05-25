import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should convert CSV', () => {
      const request = `name.firstName, name.lastName, age, address.line1, address.line2, address.city, address.state, gender
      Rohit, Prasad, 35, A-563 Rakshak Society, New Pune Road, Pune, Maharashtra, male`;

      const expected = [
        {
          name: {
            firstName: 'Rohit',
            lastName: 'Prasad',
          },
          age: 35,
          address: {
            line1: 'A-563 Rakshak Society',
            line2: 'New Pune Road',
            city: 'Pune',
            state: 'Maharashtra',
          },
          gender: 'male',
        },
      ];
      expect(appController.convertToJson(request)).toEqual(expected);
    });
  });
});
