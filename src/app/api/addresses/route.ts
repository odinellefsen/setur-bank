// /pages/api/addresses/index.js
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
    await sleep(350);
    const { addresses } = await req.json();

    if (!Array.isArray(addresses) || addresses.length === 0) {
      throw new Error("Invalid or missing addresses data");
    }

    connection = await pool.getConnection();

    for (const address of addresses) {
      const { addressID, city, zipCode, streetAddress } = address;
      const addressSql = `INSERT INTO addresses (addressID, city, zipCode, streetAddress) 
                          VALUES (?, ?, ?, ?) 
                          ON DUPLICATE KEY UPDATE city=VALUES(city), zipCode=VALUES(zipCode), streetAddress=VALUES(streetAddress)`;
      await connection.query(addressSql, [addressID, city, zipCode, streetAddress]);
    }

    return NextResponse.json({ success: "Addresses inserted successfully" });
  } catch (error) {
    console.error("error processing request", error);
    return NextResponse.json({ error: "Internal Server Error" });
  } finally {
    if (connection) connection.release();
  }
}
