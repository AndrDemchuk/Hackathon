import { Injectable } from '@nestjs/common';
import arcjet, { shield, fixedWindow } from '@arcjet/node';

@Injectable()
export class ArcjetService {
  constructor() {
    console.log('ARCJET_KEY:', process.env.ARCJET_KEY);
  }
  readonly client = arcjet({
    key: process.env.ARCJET_KEY!,
    // Collect IP from every request for rate limiting
    characteristics: ['ip.src'],
    rules: [
      // Block common attack patterns (SQLi, XSS, path traversal, etc.)
      shield({ mode: 'LIVE' }),
      // 100 requests per 60 seconds per IP
      fixedWindow({
        mode: 'LIVE',
        window: '60s',
        max: 10,
      }),
    ],
  });
}
