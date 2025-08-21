"use client";
import { apiUrl } from "@/components/url";
import { useCallback, useEffect, useState } from "react";
import Cookies from "js-cookie";
import { GetPost } from "@/types/type";
import "./style.css";
import { MegaphoneIcon } from "lucide-react";
import Link from "next/link";
import Loading from "@/components/loading/Loading";

export default function PostDash() {
  const [loading, setLoading] = useState<boolean>(false);
  const [postItems, setPostItems] = useState<GetPost[]>([]);

  const handleGetAllPost = useCallback(async () => {
    setLoading(true);

    try {
      const token = Cookies.get("token") || "";
      const response = await fetch(apiUrl + `/post/all?limit=2&page=1`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          token,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      const data = await response.json();
      setPostItems(data.posts);
      return data.posts;
    } catch (error) {
      console.error("Request failed:", error);
      // setError(error instanceof Error ? error.message : "Request failed");
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await handleGetAllPost();
      } catch (error) {
        console.error("Initialization error:", error);
      }
    };

    fetchData();
  }, [handleGetAllPost]);


  return (
    // <div className="all-post-dash">
    //   {!loading &&
    //     postItems.map((post) => (
    //       <div
    //         key={post._id}
    //         className="post-dash"
    //         onClick={() => handleShowPost(post._id)}
    //       >
    //         <h2>{post.title}</h2>
    //         <p>{post.article}</p>
    //       </div>
    //     ))}
    // </div>
    // <div className="bg-white rounded-lg shadow-md p-6">
    //   <div className="flex justify-between items-center mb-6">
    //     <h2 className="text-2xl font-bold text-gray-800">
    //       News & Announcements
    //     </h2>
    //     <button className="text-blue-600 hover:text-blue-800 font-medium flex items-center">
    //       View All <ChevronRightIcon className="ml-1 h-4 w-4" />
    //     </button>
    //   </div>

    <div className="flex flex-wrap gap-5 mt-5">
      {loading && <Loading />}
      {postItems.map((item, index) => (
        <div
          key={index}
          className="border border-gray-200 rounded-lg p-5 hover:shadow-lg transition-shadow"
        >
          <div className="flex items-start">
            <div className="bg-blue-100 p-3 rounded-full mr-4">
              <MegaphoneIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="flex flex-col items-start">
              <h3 className="font-semibold text-lg text-gray-800 mb-2">
                {item.title}
              </h3>
              <p className="text-gray-600 line-clamp-2">{item.article}</p>
              <Link
                href={`/post/${item._id}`}
                className="mt-3 text-blue-600 hover:text-blue-800 text-sm font-medium float-left"
              >
                Read more
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
