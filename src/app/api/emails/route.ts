import pool from "../../../utils/mysql"; // Adjust the import path as needed
import {NextResponse} from 'next/server';

export async function POST(req:any) {
  if (req.method !== 'POST') {
    // Return a 405 Method Not Allowed response if the request is not a POST
    return NextResponse.json({ error: "Method Not Allowed" });
  }

  function sleep(ms:any) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  let connection;

  try {
    await sleep(350);
    // Assuming the request body is already parsed into a JSON object
    const { emailID, pTal, emailAddress } = await req.json();
    
    connection = await pool.getConnection();
    console.log("connected to the database");

    // Prepare your SQL statement
    const sql = `INSERT INTO emails (emailID, pTal, emailAddress) VALUES (?, ?, ?)`;

    // Execute the query
    await connection.query(sql, [emailID, pTal, emailAddress]);
    console.log("Data inserted successfully");

    // Send a success response
    return NextResponse.json({ success: "Data inserted successfully" });
  }
  catch (error) {
    console.error("error processing request", error);
    // Send an error response
    return NextResponse.json({ error: "Internal Server Error emails" });
  } finally {
    // Ensure the connection is released in case of success or failure
    if (connection) connection.release();
  }
}
