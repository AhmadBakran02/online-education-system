"use client"; // Required since we're using client-side hooks

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function LessonId() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [lessonId, setLessonId] = useState<string>("");
  useEffect(() => {
    // Full URL construction
    const url = `${window.location.origin}${pathname}${
      searchParams.toString() ? `?${searchParams.toString()}` : ""
    }`;

    console.log("Current URL:", url);

    // If you just need the path and query
    const pathWithQuery = `${pathname}${
      searchParams.toString() ? `?${searchParams.toString()}` : ""
    }`;
    console.log("Path with query:", pathWithQuery);
    setLessonId(pathWithQuery.substring(9));
  }, [pathname, searchParams]);

  return <div>{lessonId}</div>;
}
