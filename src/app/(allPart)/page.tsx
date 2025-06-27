"use client";
import Image from "next/image";
import "./style.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useEffect, useState, useCallback } from "react";
import { GetPost } from "../../types/type";
import { PostCard } from "@/components/post-card/post-card";
import { apiUrl } from "@/components/url";

export default function Home() {
  const [postItems, setPostItems] = useState<GetPost[]>([]);
  // const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [photoUrls, setPhotoUrls] = useState<Record<string, string>>({}); // { photoID: url }

  // Fetch all posts
  const handleGetAllPost = useCallback(async () => {
    setLoading(true);
    // setError(null);

    try {
      const token = localStorage.getItem("token") || "";
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
      const token = localStorage.getItem("token") || "";
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

  return (
    <div className="all-home">
      <div className="headd"></div>
      <div className="min-h-screen bg-gray-50 text-gray-900">
        {/* Hero Section */}
        <section className="relative h-[500px] w-full">
          <Image
            src="/images/pic2.jpg"
            alt="School Image"
            layout="fill"
            objectFit="cover"
            priority
          />
          <div className="text-text absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <h1 className="text-white text-4xl md:text-6xl font-bold text-center">
              Welcome to Educational Academy
            </h1>
          </div>
        </section>

        {/* Latest Events */}
        <section className="py-12 px-4 md:px-16">
          <h2 className="text-2xl font-bold mb-6 text-center">
            Latest School Events
          </h2>
          <div className="grid grid-cols-1 gap-6">
            <div className="last-events mx-auto p-4">
              <Swiper
                modules={[Navigation, Pagination]}
                spaceBetween={30}
                slidesPerView={3}
                navigation
                pagination={{ clickable: true }}
                breakpoints={{
                  320: { slidesPerView: 1 },
                  640: { slidesPerView: 2 },
                  1024: { slidesPerView: 2 },
                }}
              >
                {!loading &&
                  postItems.map((post) => (
                    <SwiperSlide key={post._id}>
                      {/* <div className="bg-white rounded-lg overflow-hidden">
                        <Image
                          src={
                            post.photoID
                              ? photoUrls[post.photoID] || "/images/pic2.jpg"
                              : "/images/pic2.jpg"
                          }
                          alt={`Event ${post.title}`}
                          width={600}
                          height={400}
                          className="object-cover w-full h-48"
                        />
                        <div className="p-4">
                          <h3 className="text-lg font-semibold mb-2">
                            {post.title}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {post.article}
                          </p>
                        </div>
                      </div> */}
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
                  ))}

                {loading &&
                  [1, 2, 3, 4, 5].map((index) => (
                    <SwiperSlide key={index}>
                      <PostCard
                        key={index.toString()}
                        _id={index.toString()}
                        postedBy={""}
                        title={"Loading..."}
                        article={"Loading content..."}
                        photoUrl={""}
                        __v={0}
                        editPost={false}
                        photoID={""}
                        showFull={false}
                      />
                    </SwiperSlide>
                  ))}
              </Swiper>
            </div>
          </div>
        </section>

        {/* Rest of your existing calendar and news sections */}
        {/* ... */}

        {/* School Calendar */}
        <section className="py-12 px-4 md:px-16 bg-gray-100">
          <h2 className="text-2xl font-bold mb-6 text-center">
            School Calendar
          </h2>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <p className="text-gray-700">
              Here you can display the upcoming school events calendar.
            </p>
            <section className="newsSection">
              <div className="newsHeader">
                <h3>News & Announcements</h3>

                <div className="newsControls">
                  <span>View All &gt;</span>
                  <span>School Calendar</span>
                  <span>&lt;</span>
                </div>
              </div>

              <div className="calendar">
                <div className="calendarHeader">
                  <h4>April 2025</h4>
                </div>

                <div className="calendarGrid">
                  <div className="calendarDay diff">28</div>
                  <div className="calendarDay diff">29</div>
                  <div className="calendarDay diff">30</div>
                  <div className="calendarDay">1</div>
                  <div className="calendarDay">2</div>
                  <div className="calendarDay">3</div>
                  <div className="calendarDay">4</div>
                  <div className="calendarDay event">5</div>
                  <div className="calendarDay">6</div>
                  <div className="calendarDay">7</div>
                  <div className="calendarDay">8</div>
                  <div className="calendarDay">9</div>
                  <div className="calendarDay">10</div>
                  <div className="calendarDay">11</div>
                  <div className="calendarDay">12</div>
                  <div className="calendarDay">13</div>
                  <div className="calendarDay">14</div>
                  <div className="calendarDay">15</div>
                  <div className="calendarDay">16</div>
                  <div className="calendarDay event">17</div>
                  <div className="calendarDay">18</div>
                  <div className="calendarDay">19</div>
                  <div className="calendarDay">20</div>
                  <div className="calendarDay">21</div>
                  <div className="calendarDay">22</div>
                  <div className="calendarDay">23</div>
                  <div className="calendarDay">24</div>
                  <div className="calendarDay">25</div>
                  <div className="calendarDay">26</div>
                  <div className="calendarDay">28</div>
                  <div className="calendarDay">29</div>
                  <div className="calendarDay">30</div>
                  <div className="calendarDay">27</div>
                  <div className="calendarDay diff">1</div>
                  <div className="calendarDay diff">2</div>
                </div>
              </div>
            </section>
            {/* You can integrate an actual calendar using a third-party library */}
          </div>
        </section>
      </div>
    </div>
  );
}
