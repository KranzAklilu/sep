"use client";
import { PlusIcon, XIcon } from "lucide-react";
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { Table, TableBody, TableRow, TableCell } from "./ui/table";
import { Button } from "./ui/button";

function Feedback() {
  const [feedback, setFeedback] = useState<
    { id: string; name: string; isBeingEdited: boolean }[]
  >([]);

  const [term, setTerm] = useState("");

  return (
    <Card className="col-span-8 w-full">
      <CardHeader>
        <CardTitle>Feedback questions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Input
            className="max-w-lg"
            placeholder="Search..."
            onChange={(event) => setTerm(event.target.value)}
          />
          <Table className="my-5">
            <TableBody>
              <TableRow className="mb-4 hover:bg-transparent">
                {" "}
                <Button
                  onClick={() =>
                    setFeedback((prev) => [
                      {
                        id: feedback.length + 1 + "",
                        name: "",
                        isBeingEdited: true,
                      },
                      ...prev,
                    ])
                  }
                  variant="outline"
                  className="mb-4"
                >
                  <PlusIcon />
                  New Feedback question
                </Button>
              </TableRow>
              {feedback
                .filter((s) =>
                  s.name.toUpperCase().includes(term.toUpperCase()),
                )
                .map(({ id, name, isBeingEdited }) => (
                  <TableRow key={id}>
                    <TableCell>
                      {isBeingEdited ? (
                        <Input
                          autoFocus
                          value={name}
                          onChange={(event) =>
                            setFeedback((prev) =>
                              prev.map((p) =>
                                p.id === id
                                  ? { ...p, name: event.target.value }
                                  : p,
                              ),
                            )
                          }
                        />
                      ) : (
                        <div
                          className="flex h-9 w-full cursor-text items-center px-3 hover:border hover:border-gray-200 "
                          onClick={() => {
                            setFeedback((prev) =>
                              prev.map((p) =>
                                p.id === id ? { ...p, isBeingEdited: true } : p,
                              ),
                            );
                          }}
                        >
                          {name}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="flex">
                      <div className="flex-grow" />
                      <Button
                        onClick={() =>
                          setFeedback((prev) => prev.filter((p) => p.id !== id))
                        }
                        size="sm"
                        variant="ghost"
                        className="hover:text-destructive"
                      >
                        <XIcon className="" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

export default Feedback;
