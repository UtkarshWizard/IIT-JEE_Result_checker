import { GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import Link from "next/link";

export function Header() {
  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center px-16">
        <div className="w-full flex items-center justify-between gap-2">
          <div className="flex w-full gap-2">
            <GraduationCap className="h-6 w-6 text-primary" />
            <span className="font-semibold">IIT JEE Results</span>
          </div>
          <Button variant="outline" asChild>
            <Link href="/filters" className="inline-flex items-center">
              <Filter className="mr-2 h-4 w-4" />
              Browse All Results
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
