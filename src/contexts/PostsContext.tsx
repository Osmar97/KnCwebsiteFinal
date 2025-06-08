import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Post {
  id: string;
  title: string;
  content: string;
  images: string[];
  category: "article" | "resource";
  created_at: string;
  updated_at: string;
}

interface PostsContextType {
  posts: Post[];
  loading: boolean;
  addPost: (title: string, content: string, images: string[], category: "article" | "resource") => Promise<boolean>;
  updatePost: (id: string, title: string, content: string, images: string[], category: "article" | "resource") => Promise<boolean>;
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
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPosts(data || []);
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

  const addPost = async (title: string, content: string, images: string[], category: "article" | "resource"): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from("posts")
        .insert([{ title, content, images, category }])
        .select();

      if (error) throw error;

      if (data && data[0]) {
        setPosts(prev => [data[0], ...prev]);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error adding post:", error);
      return false;
    }
  };

  const updatePost = async (id: string, title: string, content: string, images: string[], category: "article" | "resource"): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from("posts")
        .update({ title, content, images, category, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select();

      if (error) throw error;

      if (data && data[0]) {
        setPosts(prev => prev.map(post => post.id === id ? data[0] : post));
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
      const { error } = await supabase
        .from("posts")
        .delete()
        .eq("id", id);

      if (error) throw error;

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
