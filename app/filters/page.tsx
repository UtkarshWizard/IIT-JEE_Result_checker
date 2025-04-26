"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { getUniqueStates } from "@/lib/utils";
import { Header } from "../components/Header";
import { useRouter } from "next/navigation";

interface Student {
  id: string;
  hallTicket: string;
  name: string;
  gender: string;
  state: string;
  physicsMarks: number;
  chemistryMarks: number;
  mathMarks: number;
  totalMarks: number;
  rank: number;
  passed: boolean;
}

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [states, setStates] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    state: "",
    gender: "",
    failedSubject: "",
    resultStatus: "",
  });
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const limit = 100; // students per page

  useEffect(() => {
    const fetchStates = async () => {
      const data = await getUniqueStates();
      setStates(data);
    };
    fetchStates();
  }, []);

  const fetchStudents = async () => {
    setLoading(true);
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...filters,
    });
    const res = await fetch(`/api/student?${params}`);
    const data = await res.json();
    setStudents(data);
    setLoading(false);
  };

  const fetchSummary = async () => {
    const res = await fetch("/api/summary", {
      method: "POST",
      body: JSON.stringify(filters),
    });
    const data = await res.json();
    setSummary(data.summary || "");
  };

  useEffect(() => {
    fetchStudents();
    fetchSummary();
  }, [page, filters]);

  const handleFilterChange = (field: string, value: string) => {
    setPage(1);
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <>
      <Header />
      <div className="m-8">
        <button
          onClick={() => router.push("/")}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          &larr; Back to Search
        </button>
      </div>
      <div className="text-3xl font-semibold w-full flex justify-center items-center px-16 mt-16">
        IIT JEE Result 2025
      </div>
      <div className="p-6 space-y-6">
        <Card>
          <CardContent className="p-6 grid grid-cols-1 md:grid-cols-4 gap-4">
            <Select
              onValueChange={(value) => handleFilterChange("state", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select State" />
              </SelectTrigger>
              <SelectContent>
                {states.map((state) => (
                  <SelectItem key={state} value={state}>
                    {state}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              onValueChange={(value) => handleFilterChange("gender", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Male">Male</SelectItem>
                <SelectItem value="Female">Female</SelectItem>
              </SelectContent>
            </Select>

            <Select
              onValueChange={(value) =>
                handleFilterChange("failedSubject", value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Failed Subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Physics">Physics</SelectItem>
                <SelectItem value="Chemistry">Chemistry</SelectItem>
                <SelectItem value="Math">Math</SelectItem>
              </SelectContent>
            </Select>

            <Select
              onValueChange={(value) =>
                handleFilterChange("resultStatus", value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Result Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Passed">Passed</SelectItem>
                <SelectItem value="Failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {summary && (
          <Card>
            <CardContent className="p-4 text-lg font-medium">
              {summary}
            </CardContent>
          </Card>
        )}

        <div className="overflow-x-auto rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Rank</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>State</TableHead>
                <TableHead>Gender</TableHead>
                <TableHead>Physics</TableHead>
                <TableHead>Chemistry</TableHead>
                <TableHead>Math</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : students.length > 0 ? (
                students.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell>{student.rank}</TableCell>
                    <TableCell>{student.name}</TableCell>
                    <TableCell>{student.state}</TableCell>
                    <TableCell>{student.gender}</TableCell>
                    <TableCell>{student.physicsMarks}</TableCell>
                    <TableCell>{student.chemistryMarks}</TableCell>
                    <TableCell>{student.mathMarks}</TableCell>
                    <TableCell>{student.totalMarks}</TableCell>
                    <TableCell>
                      {student.passed ? "Passed" : "Failed"}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={9} className="text-center">
                    No students found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex justify-between mt-4">
          <Button
            disabled={page === 1}
            onClick={() => setPage((prev) => prev - 1)}
          >
            Previous
          </Button>
          <Button onClick={() => setPage((prev) => prev + 1)}>Next</Button>
        </div>
      </div>
    </>
  );
}
