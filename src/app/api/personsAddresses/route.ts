// /pages/api/personsAddresses/index.js
import pool from "../../../utils/mysql";
import { NextResponse } from 'next/server';

export async function POST(req:any) {
  if (req.method !== 'POST') {
    return NextResponse.json({ error: "Method Not Allowed" });
  }

  let connection;

  function sleep(ms:any) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  try {
    console.log('monkeyboyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy')
    await sleep(350);
    const { pTal, addressIDs } = await req.json(); // Expect addressIDs to be an array of addressID strings
    console.log('pTal: ', pTal, 'addressIDs', addressIDs)

    if (!pTal || !Array.isArray(addressIDs) || addressIDs.length === 0) {
      throw new Error("Invalid or missing person identifier or address data");
    }

    connection = await pool.getConnection();

    for (const addressID of addressIDs) {
      const linkSql = `INSERT INTO personsAddresses (pTal, addressID) 
                       VALUES (?, ?) 
                       ON DUPLICATE KEY UPDATE addressID=VALUES(addressID)`;
      await connection.query(linkSql, [pTal, addressID]);
    }

    return NextResponse.json({ success: "Addresses linked to personsAddresses successfully" });
  } 
  
  catch (error:any) {
    console.error("Error processing request:", error);

    // Check if the environment is development for detailed error messages
    if (process.env.NODE_ENV === 'development') {
        // In development, return a detailed error message for debugging
        return NextResponse.json({
            error: "Internal Server Error",
            message: error.message,
            stack: error.stack,
        });
    } else {
        // In production, return a generic error message for security
        return NextResponse.json({ error: "Internal Server Error" });
    }
}
  
  
  finally {
    if (connection) connection.release();
  }
}
