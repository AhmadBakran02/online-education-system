"use client";

import Image from "next/image";
import Link from "next/link";
import "./style.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useCallback, useEffect, useState } from "react";
import { GetBlogsType, GetPost, LessonsType } from "@/types/type";
import { PostCard } from "@/components/post-card/post-card";
import { apiUrl } from "@/components/url";
import Cookies from "js-cookie";
import LoadingCard from "@/components/loadingCard/loadingCard";
export default function HomePage() {
  const [postItems, setPostItems] = useState<GetPost[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [lessonsItems, setLessonsItems] = useState<LessonsType[]>([]);
  const [photoUrls, setPhotoUrls] = useState<Record<string, string>>({}); // { photoID: url }
  const [blogs, setBlogs] = useState<GetBlogsType[]>([]);

  const handleGetAllPost = useCallback(async () => {
    setLoading(true);
    // setError(null);

    try {
      const token = Cookies.get("token") || "";
      const response = await fetch(apiUrl + `/post/all?limit=10&page=1`, {
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

  // Fetch photo URLs for all posts
  const fetchPhotoUrls = useCallback(async (posts: GetPost[]) => {
    try {
      const token = Cookies.get("token") || "";
      const urls: Record<string, string> = {};

      // Process posts with photoIDs in parallel
      await Promise.all(
        posts.map(async (post) => {
          if (!post.photoID) return;

          try {
            const response = await fetch(
              apiUrl + `/file?fileID=${post.photoID}`,
              {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                  token,
                },
              }
            );

            if (!response.ok) throw new Error(`Error: ${response.status}`);

            const contentType = response.headers.get("content-type");
            if (!contentType?.startsWith("image/")) {
              throw new Error("Received data is not an image");
            }

            const blob = await response.blob();
            urls[post.photoID] = URL.createObjectURL(blob);
            console.log(urls[post.photoID]);
          } catch (err) {
            console.error(`Error fetching photo ${post.photoID}:`, err);
            // Fallback to default image if there's an error
            urls[post.photoID] = "/images/pic2.jpg";
          }
        })
      );

      setPhotoUrls(urls);
      console.log(urls);
    } catch (error) {
      console.error("Error in fetchPhotoUrls:", error);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const posts = await handleGetAllPost();
        await fetchPhotoUrls(posts);
        // console.log(photoUrls);
      } catch (error) {
        console.error("Initialization error:", error);
      }
    };

    fetchData();
  }, [handleGetAllPost, fetchPhotoUrls]);

  const handleGetAllLessons = useCallback(async () => {
    setLoading(true);
    // setError(null);

    try {
      const token = Cookies.get("token") || "";
      const response = await fetch(`${apiUrl}/lesson/all?page=1&limit=3`, {
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
      setLessonsItems(data.lessons);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      // setError(errorMessage);
      console.error("Request failed:", errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []); // Added numberOfLessons to dependencies

  useEffect(() => {
    const fetchData = async () => {
      await handleGetAllLessons();
    };
    fetchData();
  }, [handleGetAllLessons]);

  const handleGetAllBlogs = useCallback(async () => {
    setLoading(true);
    // setError(null);

    try {
      const token = Cookies.get("token") || "";
      const response = await fetch(`${apiUrl}/blog/all?page=${1}&limit=${3}`, {
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
      setBlogs(data.blogs);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      // setError(errorMessage);
      console.error("Request failed:", errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      await handleGetAllBlogs();
    };
    fetchData();
  }, [handleGetAllBlogs]);

  return (
    <main className="min-h-screen bg-gray-50 text-gray-800">
      {/* Hero Section */}
      <section className="relative h-[500px] w-full rounded-md">
        <Image
          src="/images/pic2.jpg"
          alt="School Image"
          layout="fill"
          objectFit="cover"
          className="rounded-md"
          priority
        />
        <div className="text-text absolute inset-0 bg-black flex items-center justify-center rounded-md">
          <h1 className="text-white text-4xl md:text-6xl font-bold text-center">
            Welcome to Educational Academy
          </h1>
        </div>
      </section>

      {/* About Section */}
      <section className="px-6 py-12 max-w-6xl mx-auto">
        <h2 className="text-3xl font-semibold mb-4">
          About Educational Academy
        </h2>
        <p className="text-lg">
          We are committed to nurturing minds and shaping the future. Our
          academy provides top-tier education, inspiring both academic and
          personal growth.
        </p>
      </section>

      {/* Latest School Events */}
      <section className="px-6 py-12 bg-white max-w-6xl mx-auto rounded-md shadow-box">
        <h2 className="text-3xl font-semibold mb-6">Latest Academy Events</h2>

        <div className="grid grid-cols-1 gap-6 bg-gray-100 round rounded-xl">
          <div className="last-events mx-auto ">
            <Swiper
              modules={[Navigation, Pagination]}
              spaceBetween={30}
              slidesPerView={3}
              navigation
              pagination={{ clickable: true }}
              breakpoints={{
                320: { slidesPerView: 1 },
                640: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
              }}
            >
              {!loading &&
                postItems.map((post) => (
                  <div key={post._id} className="contain-show shadow-box">
                    <SwiperSlide key={post._id}>
                      <PostCard
                        _id={post._id}
                        postedBy={""}
                        title={post.title}
                        article={post.article}
                        photoUrl={photoUrls[post.photoID]}
                        __v={0}
                        editPost={false}
                        photoID={post.photoID}
                        showFull={false}
                      />
                    </SwiperSlide>
                  </div>
                ))}

              {loading  &&
                [1, 2, 3].map((index) => (
                  <div key={index}>
                    <SwiperSlide key={index}>
                      <LoadingCard />
                    </SwiperSlide>
                  </div>
                ))}
            </Swiper>
          </div>
        </div>
      </section>

      {/* Announcements */}
      <section className="px-6 py-12 max-w-6xl mx-auto">
        <h2 className="text-3xl font-semibold mb-6">Latest Forum Posts</h2>
        <ul className="space-y-4">
          {blogs.map((i) => (
            <li
              key={i._id}
              className="p-4 bg-gray-100 rounded-xl shadow hover:bg-gray-200 transition"
            >
              <Link href={"discussions"}>
                <h4 className="font-semibold text-lg">{i.title}</h4>
                <p className="text-sm text-gray-600 max-h-5 latest-class">
                  {i.article}
                  {i.article}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Featured Lessons */}
      <section className="px-6 py-12 bg-white max-w-6xl mx-auto rounded-t-md shadow-box">
        <h2 className="text-3xl font-semibold mb-6">Explore Our Lessons</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {lessonsItems.map((item) => (
            <div
              key={item._id}
              className="bg-gray-100 rounded-xl p-4 shadow lesson-box"
            >
              <div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                {/* <p className="text-sm text-gray-600 mb-2">Instructor: John Doe</p> */}
                <p className="text-sm text-gray-600 mb-2">{item.description}</p>
              </div>
              <Link
                href={`lessons/${item._id}`}
                className="main-blue hover:underline"
              >
                Start Learning
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="last-section bg-main-blue text-white py-16 text-center rounded-b-md">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Ready to Begin Your Learning Journey?
        </h2>
        <Link
          href="lessons"
          className="bg-white main-blue px-6 py-3 font-semibold rounded-full shadow-md hover:bg-gray-100"
        >
          Explore Lessons
        </Link>
      </section>
    </main>
  );
}
