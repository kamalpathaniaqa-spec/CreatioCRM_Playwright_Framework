import { Client } from 'pg';
// Ensure your tsconfig.json has "resolveJsonModule": true
import config from '../../config/config.json' with { type: 'json' };

export class DBCommons {

    async getData(query: string): Promise<Array<Record<string, any>>> {
        const client = new Client({
            host: config.db.host,
            port: config.db.port,
            database: config.db.database,
            user: config.db.user,
            password: config.db.password
        });

        try {
            await client.connect();
            const result = await client.query(query);
            
            // Return rows cast to your expected type
            return result.rows as Array<Record<string, any>>;
        } catch (error) {
            console.error('Database query error:', error);
            throw error; // Re-throw to let the caller handle it
        } finally {
            // Always close the connection, even on failure
            await client.end();
        }
    }
}