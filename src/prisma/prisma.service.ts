import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { createPool } from 'mysql2/promise';
import type { Pool } from 'mysql2/promise';

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  private _pool: Pool;

  private dbConfig() {
    try {
      const u = new URL(process.env.DATABASE_URL ?? 'mysql://localhost/histlingo');
      return {
        host: u.hostname,
        port: Number(u.port) || 3306,
        user: decodeURIComponent(u.username || ''),
        password: decodeURIComponent(u.password || ''),
        database: u.pathname.replace(/^\//, ''),
        connectTimeout: 10000,
        waitForConnections: true,
        connectionLimit: 5,
        queueLimit: 0,
      };
    } catch {
      const raw = process.env.DATABASE_URL ?? '';
      console.error('[DB] Failed to parse DATABASE_URL:', raw ? raw.slice(0, 30) + '...' : 'empty');
      return {
        host: '127.0.0.1', port: 3306, user: '', password: '', database: 'histlingo',
        waitForConnections: true, connectionLimit: 5, queueLimit: 0,
      };
    }
  }

  async onModuleInit() {
    this._pool = createPool(this.dbConfig());
    const conn = await this._pool.getConnection().catch((e: Error) => {
      console.error('[DB] Pool init failed:', e.message);
      return null;
    });
    if (conn) {
      conn.release();
      console.log('[DB] Connection pool ready');
    }
  }

  async onModuleDestroy() {
    await this._pool?.end().catch(() => {});
  }

  async query<T = Record<string, any>>(sql: string, params?: any[]): Promise<T[]> {
    const [rows] = await this._pool.query(sql, params ?? []);
    return rows as T[];
  }

  async queryOne<T = Record<string, any>>(sql: string, params?: any[]): Promise<T | null> {
    const rows = await this.query<T>(sql, params);
    return rows[0] ?? null;
  }

  async run(sql: string, params?: any[]): Promise<void> {
    await this._pool.query(sql, params ?? []);
  }
}
