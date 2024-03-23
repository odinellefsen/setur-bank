"use client"

import ThemeToggle from "@/components/ui/ThemeToggle";
import {useEffect, useState} from "react";
import {UserButton, useUser} from "@clerk/nextjs";
import { ProfileForm } from "@/components/ui/ProfileForm";

// Define a Person interface that matches the structure of your SQL table tuples
// interface Person {
//   pTal: string;
//   firstName: string;
//   middleName: string;
//   lastName: string;
//   dateOfBirth: Date; // Assuming dateOfBirth is a Date object, adjust if necessary
// }

export default function Home() {
  // const { user } = useUser();

  // if (!user) {
  //   return <div>Loading...</div>;
  // }

  // const [data, setData] = useState<Person[]>([]);

  // useEffect(() => {
  //   fetch('/api/persons')
  //     .then((response) => response.json())
  //     .then((data: Person[]) => setData(data))
  //     .catch((error) => console.error("Error fetching data", error));
  // }, []);

  // // Helper function to format the date of birth
  // const formatDate = (date: Date) => {
  //   // You can adjust the formatting as needed
  //   return new Date(date).toLocaleDateString("en-US", {
  //     year: 'numeric',
  //     month: 'long',
  //     day: 'numeric',
  //   });
  // };

  return (
    <main className="flex flex-col space-y-4 items-center justify-between p-24">
      <UserButton />
      <ThemeToggle/>
      <ProfileForm/>
    </main>
  );
}