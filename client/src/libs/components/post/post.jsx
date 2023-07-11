/* eslint-disable react/jsx-no-bind */
import { useState } from 'react';
import PropTypes from 'prop-types';

import { IconName } from '~/libs/enums/enums.js';
import { getFromNowTime } from '~/libs/helpers/helpers.js';
import { useCallback } from '~/libs/hooks/hooks.js';
import { postType } from '~/libs/prop-types/property-types.js';
import { UpdatePost } from '~/pages/thread/components/update-post/update-post.jsx';
import { IconButton } from '../icon-button/icon-button.jsx';
import { Image } from '../image/image.jsx';
import styles from './styles.module.scss';


const Post = ({ post,
  onUpdatePost, onUploadImage, onPostLike, onDeletePost, userId, onPostDislike, onExpandedPostToggle, onSharePost }) => {
  const {
    id,
    image,
    body,
    user,
    likeCount,
    dislikeCount,
    commentCount,
    createdAt
  } = post;
  const date = getFromNowTime(createdAt);
  const [isUpdatePostActive, setIsUpdatePostActive] = useState(false);
  
  const handlePostLike = useCallback(() => onPostLike(id), [id, onPostLike]);
  const handlePostDislike = useCallback(() => onPostDislike(id), [id, onPostDislike]);
  const handleExpandedPostToggle = useCallback(
    () => onExpandedPostToggle(id),
    [id, onExpandedPostToggle]
  );
  const handleSharePost = useCallback(() => onSharePost(id), [id, onSharePost]);
  const handleDeletePost = useCallback(() => onDeletePost(id), [id, onDeletePost]);

  const handleUpdatePost = useCallback((post) => onUpdatePost(post), [id, onUpdatePost]);
  const handleUpdatePostToggle = () => {
    setIsUpdatePostActive(prevValue => !prevValue);
  };

  return (
    <>
    {!isUpdatePostActive && (
    <div className={styles.card}>
      {image && <Image src={image.link} alt="post image" />}
      <div className={styles.content}>
        <div className={styles.meta}>
          <span>{`posted by ${user.username} - ${date}`}</span>
        </div>
        <p className={styles.description}>{body}</p>
      </div>
      <div className={styles.extra}>
        <IconButton
          iconName={IconName.THUMBS_UP}
          label={likeCount}
          onClick={handlePostLike}
        />
        <IconButton
          iconName={IconName.THUMBS_DOWN}
          label={dislikeCount}
          onClick={handlePostDislike}
        />
        <IconButton
          iconName={IconName.COMMENT}
          label={commentCount}
          onClick={handleExpandedPostToggle}
        />
        <IconButton
          iconName={IconName.SHARE_ALTERNATE}
          onClick={handleSharePost}
        />
        {user.id === userId && (
          <>
          <IconButton iconName={IconName.DELETE} onClick={handleDeletePost} />
          <IconButton iconName={IconName.EDIT} onClick={handleUpdatePostToggle} />
          </>
        )}
      </div>
    </div>)}
    {isUpdatePostActive && (
        <UpdatePost
          post={post}
          onUpdatePostToggle={handleUpdatePostToggle}
          onUpdatePost={handleUpdatePost}
          onUploadImage={onUploadImage}
        />)}
    </>
  );
};

Post.propTypes = {
  post: postType.isRequired,
  userId: PropTypes.number,
  onPostLike: PropTypes.func.isRequired,
  onExpandedPostToggle: PropTypes.func.isRequired,
  onSharePost: PropTypes.func.isRequired,
  onDeletePost: PropTypes.func.isRequired,
  onUploadImage: PropTypes.func.isRequired,
  onUpdatePost: PropTypes.func.isRequired,
};

export { Post };
