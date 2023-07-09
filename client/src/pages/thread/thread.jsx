import InfiniteScroll from 'react-infinite-scroll-component';

import { Checkbox } from '~/libs/components/checkbox/checkbox.jsx';
import { Post } from '~/libs/components/post/post.jsx';
import { Spinner } from '~/libs/components/spinner/spinner.jsx';
import { ThreadToolbarKey, UseFormMode } from '~/libs/enums/enums.js';
import {
  useAppForm,
  useCallback,
  useDispatch,
  useEffect,
  useSelector,
  useState
} from '~/libs/hooks/hooks.js';
import { image as imageService } from '~/packages/image/image.js';
import { actions as threadActionCreator } from '~/slices/thread/thread.js';

import {
  AddPost,
  ExpandedPost,
  SharedPostLink
} from './components/components.js';
import { DEFAULT_THREAD_TOOLBAR } from './libs/common/constants.js';
import { usePostsFilter } from './libs/hooks/use-posts-filter/use-posts-filter.js';
import styles from './styles.module.scss';

const handleUploadImage = file => imageService.uploadImage(file);

const Thread = () => {
  const dispatch = useDispatch();
  const { posts, hasMorePosts, expandedPost, userId } = useSelector(state => ({
    posts: state.posts.posts,
    hasMorePosts: state.posts.hasMorePosts,
    expandedPost: state.posts.expandedPost,
    userId: state.profile.user.id
  }));

  const { postsFilter, handleShownOwnPosts, handleShowPostsIsLikedByMe } =
  usePostsFilter();

  const [sharedPostId, setSharedPostId] = useState();

  const { control, watch } = useAppForm({
    defaultValues: DEFAULT_THREAD_TOOLBAR,
    mode: UseFormMode.ON_CHANGE
  });

  const showOwnPosts = watch(ThreadToolbarKey.SHOW_OWN_POSTS);
  const showPostsIsLikedByMe = watch(ThreadToolbarKey.SHOW_POSTS_IS_LIKED_BY_ME);
  
  const handlePostsLoad = useCallback(
    filtersPayload => {
      dispatch(threadActionCreator.loadPosts(filtersPayload));
    },
    [dispatch]
  );

  const handleToggleShowPostsFilter = useCallback(() => {
    const currentUserId =
      showOwnPosts || showPostsIsLikedByMe ? userId : undefined;

      showPostsIsLikedByMe
      ? handleShowPostsIsLikedByMe(currentUserId)
      : handleShownOwnPosts(currentUserId);
  }, [
    showOwnPosts,
    showPostsIsLikedByMe,
    userId,
    handleShownOwnPosts,
    handleShowPostsIsLikedByMe
  ]);

  useEffect(() => {
    handleToggleShowPostsFilter();
  }, [showOwnPosts, showPostsIsLikedByMe, handleToggleShowPostsFilter]);

  useEffect(() => {
    handlePostsLoad(postsFilter);
  }, [handlePostsLoad, postsFilter]);

  const handlePostLike = useCallback(
    id => dispatch(threadActionCreator.reactPost({postId: id, isLike: true})),
    [dispatch]
  );

  const handlePostDislike = useCallback(
    id => dispatch(threadActionCreator.reactPost({postId: id, isLike: false})),
    [dispatch]
  );

  const handleExpandedPostToggle = useCallback(
    id => dispatch(threadActionCreator.toggleExpandedPost(id)),
    [dispatch]
  );

  const handlePostAdd = useCallback(
    postPayload => dispatch(threadActionCreator.createPost(postPayload)),
    [dispatch]
  );

  const handleMorePostsLoad = useCallback(
    filtersPayload => {
      dispatch(threadActionCreator.loadMorePosts(filtersPayload));
    },
    [dispatch]
  );

  const handleGetMorePosts = useCallback(() => {
    handleMorePostsLoad(postsFilter);
  }, [handleMorePostsLoad, postsFilter]);

  const handleSharePost = useCallback(id => setSharedPostId(id), []);

  const handleCloseSharedPostLink = useCallback(() => setSharedPostId(), []);

  const handleDeletePost = useCallback(
    id => dispatch(threadActionCreator.deletePost(id)),
    [dispatch]
  );


  return (
    <div className={styles.threadContent}>
      <div className={styles.addPostForm}>
        <AddPost onPostAdd={handlePostAdd} onUploadImage={handleUploadImage} />
      </div>
      <form name="thread-toolbar">
        <div className={styles.toolbar}>
          <Checkbox
            name={ThreadToolbarKey.SHOW_OWN_POSTS}
            control={control}
            label="Show only my posts"
          />
            <Checkbox
            name={ThreadToolbarKey.SHOW_POSTS_IS_LIKED_BY_ME}
            control={control}
            label="Show posts which I liked"
          />
        </div>
      </form>
      <div className={styles.posts}>
        <InfiniteScroll
          dataLength={posts.length}
          next={handleGetMorePosts}
          scrollThreshold={0.8}
          hasMore={hasMorePosts}
          loader={<Spinner key="0" />}
        >
          {posts.map(post => (
            <Post
              post={post}
              userId={userId}
              onPostLike={handlePostLike}
              onPostDislike={handlePostDislike}
              onExpandedPostToggle={handleExpandedPostToggle}
              onSharePost={handleSharePost}
              onDeletePost={handleDeletePost}
              key={post.id}
            />
          ))}
        </InfiniteScroll>
      </div>
      {expandedPost && <ExpandedPost onSharePost={handleSharePost} />}
      {sharedPostId && (
        <SharedPostLink
          postId={sharedPostId}
          onClose={handleCloseSharedPostLink}
        />
      )}
    </div>
  );
};

export { Thread };
