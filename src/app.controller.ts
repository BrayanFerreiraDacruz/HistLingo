import { Controller, Get, Res } from '@nestjs/common';
import type { Response } from 'express';
import { join } from 'path';

@Controller()
export class AppController {
  @Get()
  root(@Res() res: Response) {
    if (process.env.NODE_ENV === 'production') {
      return res.sendFile(join(__dirname, '..', 'public', 'index.html'));
    }
    return res.json({ status: 'HistLingo API running', version: '1.0.0' });
  }

  // Catch-all para rotas SPA em produção
  @Get('*path')
  spa(@Res() res: Response) {
    if (process.env.NODE_ENV === 'production') {
      return res.sendFile(join(__dirname, '..', 'public', 'index.html'));
    }
    return res.status(404).json({ message: 'Not found' });
  }
}
