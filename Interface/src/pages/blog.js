"use client";
import BlogPost from "@/components/blog/BlogPost";
import Layout from "@/components/layout/Layout";
import Link from "next/link";
import { useState, useEffect } from "react";
import axios from "axios";
import { config_url } from "@/util/config";

// Function to group blogs by name and count occurrences
const getBlogNameCounts = (blogs) => {
  return blogs.reduce((acc, blog) => {
    acc[blog.name] = (acc[blog.name] || 0) + 1;
    return acc;
  }, {});
};

// Function to check if a blog post is before the current month
const isBeforeCurrentMonth = (dateString) => {
  const postDate = new Date(dateString);
  const now = new Date();

  return (
    postDate.getFullYear() < now.getFullYear() ||
    (postDate.getFullYear() === now.getFullYear() &&
      postDate.getMonth() < now.getMonth())
  );
};

export default function Blog() {
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]); // State to hold filtered blogs
  const [recentPosts, setRecentPosts] = useState([]); // State to hold recent posts
  const [activeFilter, setActiveFilter] = useState(null);

  useEffect(() => {
    axios
      .get(`${config_url}/api/blogs`)
      .then((res) => {
        setBlogs(res.data);
        setFilteredBlogs(res.data); // Initialize filtered blogs

        // Filter posts before the current month
        const filteredRecentPosts = res.data
          .filter((post) => isBeforeCurrentMonth(post.date_created))
          .slice(0, 3); // Limit to 3 most recent posts
        setRecentPosts(filteredRecentPosts);
      })
      .catch((error) => {
        console.error("Error fetching blogs:", error);
      });
  }, []);

  // Handle click on a collection name to filter blogs
  const handleFilterClick = (name) => {
    setActiveFilter(name); // Set the active filter
    const filtered = name ? blogs.filter((blog) => blog.name === name) : blogs;
    setFilteredBlogs(filtered); // Update filtered blogs
  };

  const blogNameCounts = getBlogNameCounts(blogs); // Get the count of each name

  return (
    <>
      <Layout headerStyle={3} footerStyle={1} breadcrumbTitle="Blog">
        <div className="postbox-area pt-80 pb-30">
          <div className="container">
            <div className="row">
              <div className="col-xxl-8 col-xl-8 col-lg-7 col-md-12">
                <div className="postbox pr-20 pb-50">
                  <BlogPost
                    blogs={filteredBlogs} // Pass filtered blogs
                    showItem={3}
                    style={1}
                    showPagination
                  />
                </div>
              </div>
              <div className="col-xxl-4 col-xl-4 col-lg-5 col-md-12">
                <div className="sidebar__wrapper pl-25 pb-50">
                  <div className="sidebar__widget mb-40">
                    <h3 className="sidebar__widget-title mb-25">Collections</h3>
                    <div className="sidebar__widget-content">
                      <ul>
                        <li
                          key="all"
                          className={activeFilter === null ? "active" : ""}
                          onClick={() => handleFilterClick(null)} // Show all blogs when "All" is clicked
                        >
                          <Link href="">
                            Tout <span>({blogs.length})</span>
                          </Link>
                        </li>
                        {Object.entries(blogNameCounts).map(([name, count]) => (
                          <li
                            key={name}
                            className={activeFilter === name ? "active" : ""}
                            onClick={() => handleFilterClick(name)} // Filter blogs by the clicked name
                          >
                            {name} <span>({count})</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Recent Posts Section */}
                  <div className="sidebar__widget mb-55">
                    <h3 className="sidebar__widget-title mb-25">Recent Post</h3>
                    <div className="sidebar__widget-content">
                      <div className="sidebar__post rc__post">
                        {recentPosts.map((post) => (
                          <div
                            key={post.id}
                            className="rc__post mb-20 d-flex align-items-center"
                          >
                            <div className="rc__post-thumb">
                              <img src={post.image} alt={post.title} />
                            </div>
                            <div className="rc__post-content">
                              <div className="rc__meta">
                                <span>
                                  {new Date(
                                    post.date_created
                                  ).toLocaleDateString()}
                                </span>
                              </div>
                              <h3 className="rc__post-title">{post.title}</h3>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  {/* End of Recent Posts Section */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}
