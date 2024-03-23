import pool from "../../../utils/mysql"; // Adjust the import path as needed
import {NextResponse} from 'next/server';

export async function POST(req: any) {
  if (req.method !== 'POST') {
    return NextResponse.json({ error: "Method Not Allowed" });
  }

  let connection; // Declare connection outside try-catch to access it in finally

  function sleep(ms:any) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  try {
    const { pTal, firstName, middleName, lastName, dateOfBirth } = await req.json();
    
    connection = await pool.getConnection();
    console.log("connected to the database");

    const sql = `INSERT INTO persons (pTal, firstName, middleName, lastName, dateOfBirth) VALUES (?, ?, ?, ?, ?)`;
    await connection.query(sql, [pTal, firstName, middleName, lastName, dateOfBirth]);
    await sleep(1000);
    console.log("Data inserted successfully");

    return NextResponse.json({ success: "Data inserted successfully" });
  } catch (error) {
    console.error("error processing request", error);
    return NextResponse.json({ error: "Internal Server Error" });
  } finally {
    if (connection) connection.release(); // Ensure the connection is always released
  }
}
