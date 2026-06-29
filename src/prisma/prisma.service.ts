import { Injectable } from '@nestjs/common';
import { createConnection } from 'mysql2/promise';
import type { Connection } from 'mysql2/promise';

@Injectable()
export class PrismaService {
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
      };
    } catch {
      const raw = process.env.DATABASE_URL ?? '';
      console.error('[DB] Failed to parse DATABASE_URL:', raw ? raw.slice(0, 30) + '...' : 'empty');
      return { host: '127.0.0.1', port: 3306, user: '', password: '', database: 'histlingo' };
    }
  }

  private async connect(): Promise<Connection> {
    const conn = await createConnection(this.dbConfig());
    return conn;
  }

  async query<T = Record<string, any>>(sql: string, params?: any[]): Promise<T[]> {
    const conn = await this.connect();
    try {
      const [rows] = await conn.query(sql, params ?? []);
      return rows as T[];
    } finally {
      await conn.end().catch(() => {});
    }
  }

  async queryOne<T = Record<string, any>>(sql: string, params?: any[]): Promise<T | null> {
    const rows = await this.query<T>(sql, params);
    return rows[0] ?? null;
  }

  async run(sql: string, params?: any[]): Promise<void> {
    const conn = await this.connect();
    try {
      await conn.query(sql, params ?? []);
    } finally {
      await conn.end().catch(() => {});
    }
  }

  get pool() {
    throw new Error('pool not available — use query/queryOne/run methods');
  }
}
