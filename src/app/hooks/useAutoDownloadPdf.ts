// // hooks/usePdfStream.ts
// import { useState } from "react";
// import { streamPdf } from "../api/get-file";

// export const usePdfStream = () => {
//   const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const fetchPdf = async (pdfPath: string) => {
//     setLoading(true);
//     setError(null);

//     try {
//       const blob = await streamPdf({ pdfPath });
//       setPdfBlob(blob);
//       return blob;
//     } catch (err) {
//       setError(err instanceof Error ? err.message : "Failed to load PDF");
//       throw err;
//     } finally {
//       setLoading(false);
//     }
//   };

//   return { pdfBlob, fetchPdf, loading, error };
// };
