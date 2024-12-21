import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import * as FormData from 'form-data';

@Injectable()
export class ConversionService {
  constructor(private httpService: HttpService) {}

  async convertToMarkdown(file: Express.Multer.File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file.buffer, {
      filename: file.originalname,
      contentType: file.mimetype,
    });

    try {
      const response = await firstValueFrom(
        this.httpService.post('http://python-converter:5000/convert', formData, {
          headers: {
            ...formData.getHeaders(),
          },
        })
      );
      return response.data.markdown;
    } catch (error) {
      console.error('Conversion error:', error);
      throw new HttpException('Conversion failed', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
