import pool from "../../../utils/mysql"; // Adjust the import path as needed
import { NextResponse } from 'next/server';

export async function GET(req:any) {
  if (req.method !== 'GET') {
    // Return a 405 Method Not Allowed response if the request is not a GET
    return NextResponse.json({ error: "Method Not Allowed" });
  }

  try {
    const connection = await pool.getConnection();
    console.log("connected to the database");

    const [rows] = await connection.query("SELECT * FROM persons");
    connection.release(); // It's important to release the connection once you're done
    console.log(rows)

    // Send the rows back as JSON
    return NextResponse.json(rows);
  } catch (error) {
    console.error("error fetching data", error);
    // Send an error response
    return NextResponse.json({ error: "Internal Server Error" });
  }
}
