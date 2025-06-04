
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

// Use the auto-generated type from Supabase
type Post = Database['public']['Tables']['posts']['Row'];
type PostInsert = Database['public']['Tables']['posts']['Insert'];
type PostUpdate = Database['public']['Tables']['posts']['Update'];

interface PostsContextType {
  posts: Post[];
  addPost: (content: string, images: string[]) => Promise<boolean>;
  updatePost: (id: string, content: string, images: string[]) => Promise<boolean>;
  deletePost: (id: string) => Promise<boolean>;
  loading: boolean;
  refreshPosts: () => Promise<void>;
}

const PostsContext = createContext<PostsContextType | undefined>(undefined);

export const PostsProvider = ({ children }: { children: ReactNode }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching posts:', error);
        return;
      }

      setPosts(data || []);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const sanitizeContent = (content: string): string => {
    return content
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .trim();
  };

  const validateImages = (images: string[]): boolean => {
    if (images.length > 10) return false;
    
    return images.every(image => {
      if (image.startsWith('data:image/')) {
        const sizeInBytes = (image.length * 3) / 4;
        return sizeInBytes < 5 * 1024 * 1024;
      }
      try {
        new URL(image);
        return true;
      } catch {
        return false;
      }
    });
  };

  const addPost = async (content: string, images: string[]): Promise<boolean> => {
    try {
      if (!content.trim()) return false;
      if (!validateImages(images)) return false;

      const sanitizedContent = sanitizeContent(content);
      
      const postData: PostInsert = {
        content: sanitizedContent,
        images: images.slice(0, 10),
      };
      
      const { error } = await supabase
        .from('posts')
        .insert([postData]);

      if (error) {
        console.error('Error adding post:', error);
        return false;
      }

      await fetchPosts();
      return true;
    } catch (error) {
      console.error('Failed to add post:', error);
      return false;
    }
  };

  const updatePost = async (id: string, content: string, images: string[]): Promise<boolean> => {
    try {
      if (!content.trim()) return false;
      if (!validateImages(images)) return false;

      const sanitizedContent = sanitizeContent(content);
      
      const updateData: PostUpdate = {
        content: sanitizedContent,
        images: images.slice(0, 10),
        updated_at: new Date().toISOString(),
      };
      
      const { error } = await supabase
        .from('posts')
        .update(updateData)
        .eq('id', id);

      if (error) {
        console.error('Error updating post:', error);
        return false;
      }

      await fetchPosts();
      return true;
    } catch (error) {
      console.error('Failed to update post:', error);
      return false;
    }
  };

  const deletePost = async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting post:', error);
        return false;
      }

      await fetchPosts();
      return true;
    } catch (error) {
      console.error('Failed to delete post:', error);
      return false;
    }
  };

  const refreshPosts = async () => {
    await fetchPosts();
  };

  return (
    <PostsContext.Provider value={{ 
      posts, 
      addPost, 
      updatePost, 
      deletePost, 
      loading, 
      refreshPosts 
    }}>
      {children}
    </PostsContext.Provider>
  );
};

export const usePosts = () => {
  const context = useContext(PostsContext);
  if (context === undefined) {
    throw new Error('usePosts must be used within a PostsProvider');
  }
  return context;
};

// Export the Post type for other components to use
export type { Post };
