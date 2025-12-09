"use client";

import Image from "next/image";
import { Button } from "./ui/Button";

type Props = {
  name: string;
  expertise?: string[];
  rating?: number;
  profileImage?: string;
  onGiveRating?: () => void;
  activeCourseCount?: number;
};

export default function TutorCard({
  name,
  expertise = [],
  rating = 0,
  profileImage,
  onGiveRating,
  activeCourseCount,
}: Props) {
  const rounded = Math.round(rating * 10) / 10;

  return (
    <div
      className="w-full max-w-sm rounded-2xl bg-white text-slate-900 shadow-xl border border-slate-200 overflow-hidden"
      aria-label="Tutor Card"
    >
      <div className="px-5 pt-4 pb-3 border-b border-slate-100 bg-slate-50">
        <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Instructor
        </div>
      </div>

      <div className="p-5 flex gap-4 items-center">
        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-slate-100">
          {profileImage ? (
            <Image
              src={profileImage}
              alt={`${name} profile image`}
              fill
              className="object-cover"
            />
          ) : (
            <div className="h-full w-full grid place-items-center text-slate-400 text-sm">
              No Image
            </div>
          )}
        </div>
        <div className="flex-1">
          <div className="text-base font-semibold mb-1">{name}</div>
          {expertise.length > 0 && (
            <div className="text-xs text-sky-600 font-semibold mb-1">
              {expertise.join(" • ")}
            </div>
          )}
          {typeof activeCourseCount === "number" && (
            <div className="text-[11px] text-slate-500">
              {activeCourseCount > 0
                ? `Active in ${activeCourseCount} ${
                    activeCourseCount === 1 ? "Course" : "Courses"
                  }`
                : "Inactive"}
            </div>
          )}
        </div>
      </div>

      <div className="px-5 pb-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1 text-sm font-semibold text-slate-900">
            <span>{rounded || "N/A"}</span>
          </div>
          <div className="flex items-center gap-0.5 text-amber-400 text-lg">
            {[1, 2, 3, 4, 5].map((n) => (
              <span key={n}>{n <= Math.round(rating) ? "★" : "☆"}</span>
            ))}
          </div>
        </div>
        <Button className="w-full" onClick={onGiveRating}>
          Give Rating
        </Button>
      </div>
    </div>
  );
}
