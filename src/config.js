import 'dotenv/config';
import { join, dirname } from 'node:path';
import { env } from 'node:process';
const isProduction = process.env.NODE_ENV === 'production';

export const config = {
    port: env.APP_PORT !== undefined && !isNaN(parseInt(env.APP_PORT)) ? parseInt(env.APP_PORT) : 3000,
    recursos: join(dirname(import.meta.dirname), 'static'),
    vistas: join(dirname(import.meta.dirname), 'vistas'),
    uploads: join(dirname(import.meta.dirname), 'uploads'),
    session: {
        resave: false,
        saveUninitialized: true,
        secret: env.APP_SESSION_SECRET !== undefined ? env.APP_SESSION_SECRET : 'no muy secreto',
    },
    isProduction,
    logs: join(dirname(import.meta.dirname), 'logs'),
    logger: {
        level: process.env.APP_LOG_LEVEL ?? (!isProduction ? 'debug' : 'info'),
        http: (pino) => {
            return {
                logger: pino,
                autoLogging: !isProduction,
                useLevel: 'trace'
            }
        }
    }
}