import {
  addComment,
  applyPost,
  createPost,
  likePost,
  loadMorePosts,
  loadPosts,
  toggleExpandedPost,
  deletePost
} from './actions.js';
import { actions } from './thread.slice.js';

const allActions = {
  ...actions,
  loadPosts,
  loadMorePosts,
  applyPost,
  createPost,
  toggleExpandedPost,
  likePost,
  addComment,
  deletePost
};

export { allActions as actions };
export { reducer } from './thread.slice.js';
