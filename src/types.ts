export interface Author {
  uid: string;
  name: string;
  avatar: string;
}

export interface Post {
  id: string;
  imageUrl: string;
  caption: string;
  author: Author;
  likes: number;
  likedBy?: string[];
  savedBy?: string[];
  createdAt: number;
  isLiked?: boolean;
  isSaved?: boolean;
}

export interface Story {
  id: string;
  imageUrl: string;
  author: Author;
  createdAt: number;
  isViewed: boolean;
  viewedBy?: string[];
}
