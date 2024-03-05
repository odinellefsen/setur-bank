import pool from "../../../utils/mysql"; // Adjust the import path as needed
import {NextResponse} from 'next/server';

export async function POST(req:any) {
  if (req.method !== 'POST') {
    // Return a 405 Method Not Allowed response if the request is not a POST
    return NextResponse.json({ error: "Method Not Allowed" });
  }

  try {
    // Assuming the request body is already parsed into a JSON object
    const { pTal, firstName, middleName, lastName, dateOfBirth } = await req.json();
    
    const connection = await pool.getConnection();
    console.log("connected to the database");

    // Prepare your SQL statement
    const sql = `INSERT INTO persons (pTal, firstName, middleName, lastName, dateOfBirth) VALUES (?, ?, ?, ?, ?)`;

    // Execute the query
    await connection.query(sql, [pTal, firstName, middleName, lastName, dateOfBirth]);
    connection.release(); // It's important to release the connection once you're done
    console.log("Data inserted successfully");

    // Send a success response
    return NextResponse.json({ success: "Data inserted successfully" });
  } 
  catch (error) {
    console.error("error processing request", error);
    // Send an error response
    return NextResponse.json({ error: "Internal Server Error" });
  }
}
