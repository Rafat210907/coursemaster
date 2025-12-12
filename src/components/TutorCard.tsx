"use client";

import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/Card";

type Props = {
  name: string;
  expertise?: string[];
  profileImage?: string;
  activeCourseCount?: number;
};

export default function TutorCard({
  name,
  expertise = [],
  profileImage,
  activeCourseCount,
}: Props) {
  const resolvedImage = profileImage;

  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
  return (
    <Card aria-label="Tutor Card" className="bg-card text-card-foreground">
      <CardHeader className="pb-3">
        <CardTitle className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Instructor</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4 items-center">
          <div className="h-16 w-16 shrink-0 overflow-hidden rounded-md bg-muted flex items-center justify-center">
            {resolvedImage ? (
              <Image
                src={resolvedImage}
                alt={name}
                width={64}
                height={64}
                className="h-16 w-16 object-cover rounded-md"
                unoptimized
              />
            ) : (
              <span className="text-muted-foreground text-sm font-semibold">{initials}</span>
            )}
          </div>
          <div className="flex-1">
            <div className="text-base font-semibold mb-1">{name}</div>
            {expertise.length > 0 && (
              <div className="text-xs text-primary font-semibold mb-1">
                {expertise.join(" • ")}
              </div>
            )}
            {typeof activeCourseCount === "number" && (
              <div className="text-xs text-muted-foreground">
                {activeCourseCount > 0
                  ? `Active in ${activeCourseCount} ${activeCourseCount === 1 ? "Course" : "Courses"}`
                  : "Inactive"}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
