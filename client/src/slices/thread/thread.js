import {
  addComment,
  applyPost,
  createPost,
  reactPost,
  loadMorePosts,
  loadPosts,
  toggleExpandedPost,
  deletePost,
  updatePost
} from './actions.js';
import { actions } from './thread.slice.js';

const allActions = {
  ...actions,
  loadPosts,
  loadMorePosts,
  applyPost,
  createPost,
  deletePost,
  toggleExpandedPost,
  reactPost,
  addComment,
  updatePost
};

export { allActions as actions };
export { reducer } from './thread.slice.js';
