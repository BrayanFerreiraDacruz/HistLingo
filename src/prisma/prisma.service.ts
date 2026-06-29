import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { createPool } from 'mysql2/promise';
import type { Pool } from 'mysql2/promise';

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  public pool!: Pool;

  async onModuleInit() {
    this.pool = createPool(this.config());
    try {
      const conn = await this.pool.getConnection();
      await conn.query('SET NAMES utf8mb4');
      conn.release();
      console.log('[DB] Pool connected');
    } catch (err) {
      console.error('[DB] Connection test failed:', err instanceof Error ? err.message : String(err));
    }
  }

  async onModuleDestroy() {
    await this.pool?.end().catch(() => {});
  }

  private config() {
    try {
      const u = new URL(process.env.DATABASE_URL ?? '');
      return {
        host: u.hostname,
        port: Number(u.port) || 3306,
        user: decodeURIComponent(u.username || ''),
        password: decodeURIComponent(u.password || ''),
        database: u.pathname.replace(/^\//, ''),
        waitForConnections: true,
        connectionLimit: 5,
        charset: 'UTF8MB4_GENERAL_CI',
      };
    } catch {
      return { host: '127.0.0.1', port: 3306, user: '', password: '', database: 'histlingo' };
    }
  }

  async query<T = Record<string, any>>(sql: string, params?: any[]): Promise<T[]> {
    const [rows] = await this.pool.query(sql, params ?? []);
    return rows as T[];
  }

  async queryOne<T = Record<string, any>>(sql: string, params?: any[]): Promise<T | null> {
    const rows = await this.query<T>(sql, params);
    return rows[0] ?? null;
  }

  async run(sql: string, params?: any[]): Promise<void> {
    await this.pool.query(sql, params ?? []);
  }
}
