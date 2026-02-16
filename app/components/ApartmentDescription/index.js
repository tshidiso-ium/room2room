 "use client"
import { sanitize } from "dompurify";

export default function ApartmentDescription({ apartment }) {
//   const safeHtml = sanitize(apartment.description);

  return (
    <div
      className="text-base text-gray-700 leading-relaxed mb-6"
      dangerouslySetInnerHTML={{ __html: apartment.description }}
    />
  );
}