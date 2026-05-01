export interface Author {
  name: string;
  avatar: string;
}

export interface Post {
  id: string;
  imageUrl: string;
  caption: string;
  author: Author;
  likes: number;
  createdAt: number;
}

export interface Story {
  id: string;
  imageUrl: string;
  author: Author;
  createdAt: number;
  isViewed: boolean;
}
