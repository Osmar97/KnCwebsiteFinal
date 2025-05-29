
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
  addPost: (content: string, images: string[]) => void;
  updatePost: (id: string, content: string, images: string[]) => void;
  deletePost: (id: string) => void;
}

const PostsContext = createContext<PostsContextType | undefined>(undefined);

export const PostsProvider = ({ children }: { children: ReactNode }) => {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const savedPosts = localStorage.getItem('adminPosts');
    if (savedPosts) {
      const parsedPosts = JSON.parse(savedPosts).map((post: any) => ({
        ...post,
        createdAt: new Date(post.createdAt),
        updatedAt: new Date(post.updatedAt)
      }));
      setPosts(parsedPosts);
    }
  }, []);

  const savePosts = (newPosts: Post[]) => {
    setPosts(newPosts);
    localStorage.setItem('adminPosts', JSON.stringify(newPosts));
  };

  const addPost = (content: string, images: string[]) => {
    const newPost: Post = {
      id: Date.now().toString(),
      content,
      images,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const newPosts = [newPost, ...posts];
    savePosts(newPosts);
  };

  const updatePost = (id: string, content: string, images: string[]) => {
    const newPosts = posts.map(post =>
      post.id === id
        ? { ...post, content, images, updatedAt: new Date() }
        : post
    );
    savePosts(newPosts);
  };

  const deletePost = (id: string) => {
    const newPosts = posts.filter(post => post.id !== id);
    savePosts(newPosts);
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
