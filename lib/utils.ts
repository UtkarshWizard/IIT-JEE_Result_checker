import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const getBaseUrl = () => {
  if (typeof window !== "undefined") return ""; // client-side, relative path is fine
  return process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"; // server-side
};

export async function findResultByHallTicket(hallTicket: string) {
  const res = await fetch(`${getBaseUrl()}/api/result`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ hallTicket }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Failed to fetch result');
  }

  const data = await res.json();
  return data.student;
}


export async function getUniqueStates(): Promise<string[]> {
  const res = await fetch(`${getBaseUrl()}/api/student/unique-states`);
  return res.json();
}

