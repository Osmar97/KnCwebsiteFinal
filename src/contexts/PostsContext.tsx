
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useToast } from "@/hooks/use-toast";
import { listPosts, createPostRecord, updatePostRecord, deletePostRecord } from "@/data/posts";

export interface Post {
  id: string;
  title: string;
  content: string;
  images: string[];
  pdf_urls: string[];
  video_urls: string[];
  category: "article" | "resource";
  created_at: string;
  updated_at: string;
}

interface PostsContextType {
  posts: Post[];
  loading: boolean;
  addPost: (title: string, content: string, images: string[], pdfUrls: string[], videoUrls: string[], category: "article" | "resource") => Promise<boolean>;
  updatePost: (id: string, title: string, content: string, images: string[], pdfUrls: string[], videoUrls: string[], category: "article" | "resource") => Promise<boolean>;
  deletePost: (id: string) => Promise<boolean>;
  getPostById: (id: string) => Post | undefined;
  getPostsByCategory: (category: "article" | "resource") => Post[];
}

const PostsContext = createContext<PostsContextType | undefined>(undefined);

export const PostsProvider = ({ children }: { children: ReactNode }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const data = await listPosts();
      setPosts(data);
    } catch (error) {
      console.error("Error fetching posts:", error);
      toast({
        title: "Error",
        description: "Failed to load posts",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const addPost = async (title: string, content: string, images: string[], pdfUrls: string[], videoUrls: string[], category: "article" | "resource"): Promise<boolean> => {
    try {
      const created = await createPostRecord({ title, content, images, pdf_urls: pdfUrls, video_urls: videoUrls, category });
      if (created) {
        setPosts(prev => [created, ...prev]);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error adding post:", error);
      return false;
    }
  };

  const updatePost = async (id: string, title: string, content: string, images: string[], pdfUrls: string[], videoUrls: string[], category: "article" | "resource"): Promise<boolean> => {
    try {
      const updated = await updatePostRecord(id, { title, content, images, pdf_urls: pdfUrls, video_urls: videoUrls, category });
      if (updated) {
        setPosts(prev => prev.map(post => post.id === id ? updated : post));
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error updating post:", error);
      return false;
    }
  };

  const deletePost = async (id: string): Promise<boolean> => {
    try {
      await deletePostRecord(id);
      setPosts(prev => prev.filter(post => post.id !== id));
      return true;
    } catch (error) {
      console.error("Error deleting post:", error);
      return false;
    }
  };

  const getPostById = (id: string) => {
    return posts.find(post => post.id === id);
  };

  const getPostsByCategory = (category: "article" | "resource") => {
    return posts.filter(post => post.category === category);
  };

  return (
    <PostsContext.Provider value={{
      posts,
      loading,
      addPost,
      updatePost,
      deletePost,
      getPostById,
      getPostsByCategory
    }}>
      {children}
    </PostsContext.Provider>
  );
};

export const usePosts = () => {
  const context = useContext(PostsContext);
  if (context === undefined) {
    throw new Error("usePosts must be used within a PostsProvider");
  }
  return context;
};
