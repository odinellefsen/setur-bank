"use client"

import ThemeToggle from "@/components/ui/ThemeToggle";
import { useEffect, useState } from "react";

// Define a Person interface that matches the structure of your SQL table tuples
interface Person {
  pTal: string;
  firstName: string;
  middleName: string;
  lastName: string;
  dateOfBirth: Date; // Assuming dateOfBirth is a Date object, adjust if necessary
}

export default function Home() {
  const [data, setData] = useState<Person[]>([]);

  useEffect(() => {
    fetch('/api/persons')
      .then((response) => response.json())
      .then((data: Person[]) => setData(data))
      .catch((error) => console.error("Error fetching data", error));
  }, []);

  // Helper function to format the date of birth
  const formatDate = (date: Date) => {
    // You can adjust the formatting as needed
    return new Date(date).toLocaleDateString("en-US", {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <main className="flex flex-col items-center justify-between p-24">
      <div>Monkey Business</div>
      <ThemeToggle />
      <div className="flex flex-col items-center">
        {data.map((person) => (
          <div key={person.pTal} className="text-center mb-4">
            <div><strong>pTal:</strong> {person.pTal}</div>
            <div><strong>Name:</strong> {`${person.firstName} ${person.middleName} ${person.lastName}`}</div>
            <div><strong>Date of Birth:</strong> {formatDate(person.dateOfBirth)}</div>
          </div>
        ))}
      </div>
    </main>
  );
}
