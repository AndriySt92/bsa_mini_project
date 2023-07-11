import PropTypes from 'prop-types';

import { Button } from '~/libs/components/button/button.jsx';
import { Image } from '~/libs/components/image/image.jsx';
import { Input } from '~/libs/components/input/input.jsx';
import { Segment } from '~/libs/components/segment/segment.jsx';
import { ButtonColor, ButtonType, IconName } from '~/libs/enums/enums.js';
import { useAppForm, useCallback, useState } from '~/libs/hooks/hooks.js';
import { PostPayloadKey } from '~/packages/post/libs/enums/enums.js';

// import { DEFAULT_ADD_POST_PAYLOAD } from './libs/constants/constants.js';
import styles from './styles.module.scss';
import { postType } from '~/libs/prop-types/post';

const UpdatePost = ({  onUpdatePost,
  onUpdatePostToggle,
  onUploadImage,
  post,
  }) => {
  const [image, setImage] = useState();
  const [isUploading, setIsUploading] = useState(false);
  const [errorUploadingImage, setErrorUploadingImage] = useState("adawdawd")
  const { body } = post 
  const { control, handleSubmit, reset } = useAppForm({
    defaultValues: { body }
  });

  const handleUpdatePost = useCallback(
    values => {
      if (!values.body) {
        return;
      }
      const newPost = {...post, imageId: image?.imageId, body: values.body}
     
      onUpdatePost(newPost).then(() => {
        reset();
        onUpdatePostToggle()
      });
    },
    [reset, onUpdatePost, onUploadImage, image]
  );
  
  const handleCancelUpdatePost = useCallback(() => {
      onUpdatePostToggle()
    },
    []
  );

  const handleUploadFile = useCallback(
    ({ target }) => {
      setErrorUploadingImage("")
      setIsUploading(true);
      const [file] = target.files;

      onUploadImage(file)
        .then(({ id: imageId, link: imageLink }) => {
          setImage({ imageId, imageLink });
        })
        .catch((e) => {
          setErrorUploadingImage(e)
        })
        .finally(() => {
          setIsUploading(false);
        });
    },
    [onUploadImage]
  );

  return (
    <Segment>
      <form onSubmit={handleSubmit(handleUpdatePost)}>
        <Input
          name={PostPayloadKey.BODY}
          placeholder="What is the news?"
          rows={5}
          control={control}
        />
        {errorUploadingImage && <div className={styles.error}>{errorUploadingImage}</div>}
        {image?.imageLink && (
          <div className={styles.imageWrapper}>
            <Image
              className={styles.image}
              src={image?.imageLink}
              alt="post image"
            />
          </div>
        )}
        <div className={styles.btnWrapper}>
        <Button
            color="teal"
            isLoading={isUploading}
            isDisabled={isUploading}
            iconName={IconName.IMAGE}
          >
            <label className={styles.btnImgLabel}>
              Attach image
              <input
                name="image"
                type="file"
                onChange={handleUploadFile}
                hidden
              />
            </label>
          </Button>
          <Button color={ButtonColor.BLUE} onClick={handleCancelUpdatePost}>
            CANCEL
          </Button>
          <Button color={ButtonColor.BLUE} type={ButtonType.SUBMIT}>
            UPDATE
          </Button>
        </div>
      </form>
    </Segment>
  );
};

UpdatePost.propTypes = {
  onUpdatePost: PropTypes.func.isRequired,
  onUpdatePostToggle: PropTypes.func.isRequired,
  onUploadImage: PropTypes.func.isRequired,
  post: postType.isRequired,
};

export { UpdatePost };
