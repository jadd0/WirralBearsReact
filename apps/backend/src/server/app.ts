import express, { Request, Response, NextFunction, Application } from 'express';
import indexRouter from '@server/routes/index.route';
import cors from 'cors';
import session from 'express-session';
import { env } from '@/env';
import passport from '@auth/passport';
import pg from 'pg';
import connectPgSimple from 'connect-pg-simple';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';
import { createDatabasePool } from '@/utils/database';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app: Application = express();
const upload = multer();

app.set('trust proxy', 1);

// For parsing application/json
app.use(express.json());

// For parsing application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// Enhanced CORS configuration for cross-origin cookies
app.use(
	cors({
		origin: function (origin, callback) {
			const allowedOrigins = [
				'http://localhost:5173',
				'http://localhost:3000',
				'https://wirralbears.com', // Non-www version
				'https://www.wirralbears.com', // www version
			];

			// Allow requests with no origin (mobile apps, Postman, etc.)
			if (!origin) {
				console.log('Request with no origin allowed');
				return callback(null, true);
			}

			if (allowedOrigins.includes(origin)) {
				callback(null, true);
			} else {
				console.log('Origin blocked:', origin);
				callback(new Error('Not allowed by CORS'));
			}
		},
		credentials: true,
		methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
		allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
		exposedHeaders: ['Set-Cookie'],
		optionsSuccessStatus: 200,
	})
);

// Authentication middleware
let pgPool: any;

if (env.NODE_ENV === 'development') {
	pgPool = new pg.Pool({
		user: env.DB_USER,
		host: env.DB_HOST,
		port: env.DB_PORT,
		password: env.DB_PASSWORD,
		database: env.DB_NAME,
		connectionTimeoutMillis: 30000,
		idleTimeoutMillis: 30000,
		max: 10,
	});
} else {
	pgPool = createDatabasePool();
}

const pgSessionStore = connectPgSimple(session);

// Updated session configuration for cross-origin
app.use(
	session({
		store: new pgSessionStore({
			pool: pgPool,
			createTableIfMissing: true,
			pruneSessionInterval: 60 * 20,
			ttl: 60 * 60 * 24,
			errorLog: (error) => {
				console.error('Session store error:', error);
			},
		}),
		secret: env.SESSION_SECRET ?? 'defaultSecret',
		resave: false,
		saveUninitialized: false,
		name: 'connect.sid',
		rolling: false,
		cookie: {
			httpOnly: true,
			secure: env.NODE_ENV === 'production', // Must be true for cross-origin in production
			sameSite: env.NODE_ENV === 'production' ? 'none' : 'lax', // 'none' required for cross-origin
			maxAge: 1000 * 60 * 60 * 24, // 24 hours
			domain: env.NODE_ENV === 'production' ? '.wirralbears.com' : undefined,
		},
	})
);

app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, '../public')));

// Register Routes
app.use('/', indexRouter);

// Global 404 error handling middleware
app.use((req: Request, res: Response, next: NextFunction) => {
	res.status(404).send('404 - Not Found');
});

// Global catch-all error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
	// Handle database connection errors specifically
	if (err.message && err.message.includes('CONNECT_TIMEOUT')) {
		console.error('Database connection timeout detected');
		res.status(503).json({
			error: 'Database connection timeout',
			message: 'Please try again later',
		});
		return;
	}

	// Handle CORS errors specifically
	if (err.message && err.message.includes('CORS')) {
		console.error('CORS error detected:', err.message);
		res.status(403).json({
			error: 'CORS error',
			message: 'Origin not allowed',
		});
		return;
	}

	res.status(500).json({
		error: 'Internal server error',
		message:
			env.NODE_ENV === 'development' ? err.message : 'Something went wrong',
	});
});

// Graceful shutdown
process.on('SIGINT', async () => {
	console.log('Received SIGINT, shutting down gracefully...');
	if (pgPool) {
		await pgPool.end();
		console.log('Database pool closed.');
	}
	process.exit(0);
});

process.on('SIGTERM', async () => {
	console.log('Received SIGTERM, shutting down gracefully...');
	if (pgPool) {
		await pgPool.end();
		console.log('Database pool closed.');
	}
	process.exit(0);
});

export default app;
