import { Injectable } from '@nestjs/common';
import { promises as fs } from 'fs';
import * as path from 'path';
import * as pdf from 'pdf-parse';
import * as mammoth from 'mammoth';
import * as XLSX from 'xlsx';
import * as ExifParser from 'exif-parser';
import * as tesseract from 'node-tesseract-ocr';
import * as speech from '@google-cloud/speech';
import * as cheerio from 'cheerio';
import * as TurndownService from 'turndown';

@Injectable()
export class ConversionService {
  async convertToMarkdown(file: Express.Multer.File): Promise<string> {
    const ext = path.extname(file.originalname).toLowerCase();

    switch (ext) {
      case '.pdf':
        return this.convertPDF(file.buffer);
      case '.docx':
        return this.convertWord(file.buffer);
      case '.xlsx':
        return this.convertExcel(file.buffer);
      case '.pptx':
        return this.convertPowerPoint(file.buffer);
      case '.jpg':
      case '.jpeg':
      case '.png':
        return this.convertImage(file.buffer);
      case '.mp3':
      case '.wav':
        return this.convertAudio(file.buffer);
      case '.html':
        return this.convertHTML(file.buffer);
      default:
        throw new Error('Unsupported file type');
    }
  }

  private async convertPDF(buffer: Buffer): Promise<string> {
    const data = await pdf(buffer);
    return data.text;
  }

  private async convertWord(buffer: Buffer): Promise<string> {
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  }

  private async convertExcel(buffer: Buffer): Promise<string> {
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    let markdown = '';

    workbook.SheetNames.forEach((sheetName) => {
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
      markdown += `# ${sheetName}\n\n`;
      markdown += jsonData.map((row) => `| ${row.join(' | ')} |`).join('\n');
      markdown += '\n\n';
    });

    return markdown;
  }

  private async convertPowerPoint(buffer: Buffer): Promise<string> {
    // PowerPoint conversion is complex and may require a third-party service
    // For this example, we'll return a placeholder message
    return '# PowerPoint Conversion\n\nPowerPoint conversion is not implemented in this example.';
  }

  private async convertImage(buffer: Buffer): Promise<string> {
    const parser = ExifParser.create(buffer);
    const result = parser.parse();

    let markdown = '# Image Metadata\n\n';
    for (const [key, value] of Object.entries(result.tags)) {
      markdown += `- **${key}**: ${value}\n`;
    }

    markdown += '\n# OCR Text\n\n';
    const ocrResult = await tesseract.recognize(buffer);
    markdown += ocrResult;

    return markdown;
  }

  private async convertAudio(buffer: Buffer): Promise<string> {
    // For this example, we'll use a placeholder for audio transcription
    // In a real-world scenario, you'd use a speech-to-text service like Google Cloud Speech-to-Text

    return '# Audio Transcription\n\nAudio transcription is not implemented in this example.';
  }

  private async convertHTML(buffer: Buffer): Promise<string> {
    const html = buffer.toString('utf-8');
    const $ = cheerio.load(html);
    const turndownService = new TurndownService();
    return turndownService.turndown($.html());
  }
}
