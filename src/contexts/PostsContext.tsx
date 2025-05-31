
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Post {
  id: string;
  content: string;
  images: string[];
  createdAt: Date;
  updatedAt: Date;
}

interface PostsContextType {
  posts: Post[];
  addPost: (content: string, images: string[]) => boolean;
  updatePost: (id: string, content: string, images: string[]) => boolean;
  deletePost: (id: string) => boolean;
}

const PostsContext = createContext<PostsContextType | undefined>(undefined);

export const PostsProvider = ({ children }: { children: ReactNode }) => {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const savedPosts = localStorage.getItem('adminPosts');
    if (savedPosts) {
      try {
        const parsedPosts = JSON.parse(savedPosts).map((post: any) => ({
          ...post,
          createdAt: new Date(post.createdAt),
          updatedAt: new Date(post.updatedAt)
        }));
        setPosts(parsedPosts);
      } catch (error) {
        console.error('Failed to parse saved posts:', error);
        localStorage.removeItem('adminPosts');
      }
    }
  }, []);

  const savePosts = (newPosts: Post[]) => {
    try {
      setPosts(newPosts);
      localStorage.setItem('adminPosts', JSON.stringify(newPosts));
    } catch (error) {
      console.error('Failed to save posts:', error);
    }
  };

  const sanitizeContent = (content: string): string => {
    // Basic HTML sanitization - in production, use a library like DOMPurify
    return content
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .trim();
  };

  const validateImages = (images: string[]): boolean => {
    if (images.length > 10) return false; // Limit number of images
    
    return images.every(image => {
      // Check if it's a data URL for uploaded images
      if (image.startsWith('data:image/')) {
        // Basic validation for data URLs
        const sizeInBytes = (image.length * 3) / 4;
        return sizeInBytes < 5 * 1024 * 1024; // 5MB limit
      }
      // Check if it's a valid URL for external images
      try {
        new URL(image);
        return true;
      } catch {
        return false;
      }
    });
  };

  const generateSecureId = (): string => {
    // Generate a more secure random ID
    const timestamp = Date.now().toString(36);
    const randomPart = Math.random().toString(36).substring(2, 15);
    return `${timestamp}_${randomPart}`;
  };

  const addPost = (content: string, images: string[]): boolean => {
    try {
      if (!content.trim()) return false;
      if (!validateImages(images)) return false;

      const sanitizedContent = sanitizeContent(content);
      
      const newPost: Post = {
        id: generateSecureId(),
        content: sanitizedContent,
        images: images.slice(0, 10), // Limit to 10 images
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      const newPosts = [newPost, ...posts];
      savePosts(newPosts);
      return true;
    } catch (error) {
      console.error('Failed to add post:', error);
      return false;
    }
  };

  const updatePost = (id: string, content: string, images: string[]): boolean => {
    try {
      if (!content.trim()) return false;
      if (!validateImages(images)) return false;

      const sanitizedContent = sanitizeContent(content);
      
      const newPosts = posts.map(post =>
        post.id === id
          ? { 
              ...post, 
              content: sanitizedContent, 
              images: images.slice(0, 10), 
              updatedAt: new Date() 
            }
          : post
      );
      
      savePosts(newPosts);
      return true;
    } catch (error) {
      console.error('Failed to update post:', error);
      return false;
    }
  };

  const deletePost = (id: string): boolean => {
    try {
      const newPosts = posts.filter(post => post.id !== id);
      savePosts(newPosts);
      return true;
    } catch (error) {
      console.error('Failed to delete post:', error);
      return false;
    }
  };

  return (
    <PostsContext.Provider value={{ posts, addPost, updatePost, deletePost }}>
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
