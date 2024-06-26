import dotenv from 'dotenv';

dotenv.config();

const SERVER_PORT = process.env.SERVER_PORT ? Number(process.env.SERVER_PORT) : 3000;

const SERVER_PORT_ETL = process.env.SERVER_PORT_ETL ? Number(process.env.SERVER_PORT_ETL) : 4000;

export const config = {
    server: {
        port: SERVER_PORT,
        port_etl: SERVER_PORT_ETL
    }
};