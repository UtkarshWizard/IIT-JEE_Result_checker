import { Button } from "@/components/ui/button";
import { Header } from "./Header";
import { Filter } from "lucide-react";
import Link from "next/link";
import SearchForm from "./Formcard";

export default function Home() {
    return (
      <main className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 container mx-auto px-4 py-12 flex flex-col items-center justify-center">
          <div className="max-w-md w-full">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-primary mb-2">IIT JEE Result Checker</h1>
              <p className="text-muted-foreground">Enter your hall ticket number to view your results</p>
            </div>
            <SearchForm />
            <div className="mt-6 text-center">
              <Button variant="outline" asChild>
                <Link href="/filters" className="inline-flex items-center">
                  <Filter className="mr-2 h-4 w-4" />
                  Browse All Results
                </Link>
              </Button>
            </div>
          </div>
        </div>
        {/* <Footer /> */}
      </main>
    );
  }