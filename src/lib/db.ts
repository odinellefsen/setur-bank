import mysql from "mysql2/promise";

interface QueryResult<T> {
  results: T[];
  fields: mysql.FieldPacket[]; // Adjusted for more specific typing
}

interface User {
  id: number;
  name: string;
  // other fields...
}

export async function query<T>({ query, values = [] }: { query: string; values: any[] }): Promise<QueryResult<T> | { error: any }> {
  const dbconnection = await mysql.createConnection({
    host: process.env.MYSQL_HOST,
    port: 3306,
    database: process.env.MYSQL_DATABASE,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
  });

  try {
    const [results, fields] = await dbconnection.execute<mysql.RowDataPacket[]>(query, values);
    dbconnection.end();
    return { results: results as T[], fields };
  } catch (error: any) {
    dbconnection.end();
    return { error }; // You should not both throw and return in the same catch block; choose one.
  }
}
