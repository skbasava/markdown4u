import { Module } from '@nestjs/common';
import { ConversionController } from './conversion.controller';
import { ConversionService } from './conversion.service';

@Module({
  controllers: [ConversionController],
  providers: [ConversionService],
})
export class ConversionModule {}
