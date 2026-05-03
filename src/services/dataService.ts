import { 
  collection, 
  onSnapshot, 
  query, 
  orderBy, 
  addDoc, 
  updateDoc, 
  doc, 
  arrayUnion, 
  arrayRemove, 
  increment,
  getDoc,
  setDoc
} from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { Post, Story, Author } from '../types';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export const subscribeToPosts = (callback: (posts: Post[]) => void) => {
  const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const posts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Post));
    callback(posts);
  }, (error) => {
    handleFirestoreError(error, OperationType.LIST, 'posts');
  });
};

export const subscribeToStories = (callback: (stories: Story[]) => void) => {
  const q = query(collection(db, 'stories'), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const stories = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Story));
    callback(stories);
  }, (error) => {
    handleFirestoreError(error, OperationType.LIST, 'stories');
  });
};

export const createPost = async (post: Omit<Post, 'id' | 'likes' | 'createdAt' | 'isLiked' | 'isSaved'>) => {
  try {
    const postData = {
      ...post,
      likes: 0,
      likedBy: [],
      savedBy: [],
      createdAt: Date.now(),
    };
    await addDoc(collection(db, 'posts'), postData);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, 'posts');
  }
};

export const createStory = async (imageUrl: string, author: Author) => {
  try {
    const storyData = {
      imageUrl,
      author,
      createdAt: Date.now(),
      viewedBy: [],
    };
    await addDoc(collection(db, 'stories'), storyData);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, 'stories');
  }
};

export const likePost = async (postId: string, userId: string, isLiked: boolean) => {
  try {
    const postRef = doc(db, 'posts', postId);
    await updateDoc(postRef, {
      likes: increment(isLiked ? -1 : 1),
      likedBy: isLiked ? arrayRemove(userId) : arrayUnion(userId)
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `posts/${postId}`);
  }
};

export const savePost = async (postId: string, userId: string, isSaved: boolean) => {
  try {
    const postRef = doc(db, 'posts', postId);
    await updateDoc(postRef, {
      savedBy: isSaved ? arrayRemove(userId) : arrayUnion(userId)
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `posts/${postId}`);
  }
};

export const markStoryViewed = async (storyId: string, userId: string) => {
  try {
    const storyRef = doc(db, 'stories', storyId);
    await updateDoc(storyRef, {
      viewedBy: arrayUnion(userId)
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `stories/${storyId}`);
  }
};

export const syncUserProfile = async (user: Author & { uid: string, email: string | null }) => {
  try {
    const userRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userRef);
    if (!userDoc.exists()) {
      await setDoc(userRef, {
        ...user,
        createdAt: Date.now()
      });
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `users/${user.uid}`);
  }
};
