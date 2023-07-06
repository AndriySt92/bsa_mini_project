import { ThreadToolbarKey } from '~/libs/enums/enums.js';

const DEFAULT_THREAD_TOOLBAR = {
  [ThreadToolbarKey.SHOW_OWN_POSTS]: false,
  [ThreadToolbarKey.SHOW_POSTS_IS_LIKED_BY_ME]: false
};

const POSTS_PER_PAGE = 10;

export { DEFAULT_THREAD_TOOLBAR, POSTS_PER_PAGE };
