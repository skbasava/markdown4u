import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ConversionService } from './conversion.service';

@Controller('conversion')
export class ConversionController {
  constructor(private readonly conversionService: ConversionService) {}

  @Post('convert')
  @UseInterceptors(FileInterceptor('file'))
  async convertFile(@UploadedFile() file: Express.Multer.File) {
    return this.conversionService.convertToMarkdown(file);
  }
}
