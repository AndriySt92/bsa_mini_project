import {
  addComment,
  applyPost,
  createPost,
  reactPost,
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
  reactPost,
  addComment
};

export { allActions as actions };
export { reducer } from './thread.slice.js';
