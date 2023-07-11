class PostService {
  constructor({ postRepository, postReactionRepository }) {
    this._postRepository = postRepository;
    this._postReactionRepository = postReactionRepository;
  }

  getPosts(filter) {
    return this._postRepository.getPosts(filter);
  }

  getById(id) {
    return this._postRepository.getPostById(id);
  }

  create(userId, post) {
    return this._postRepository.create({
      ...post,
      userId
    });
  }

  async setReaction(userId, { postId, isLike = false }) {
    const updateOrDelete = react => {
      return react.isLike === isLike
        ? this._postReactionRepository.deleteById(react.id)
        : this._postReactionRepository.updateById(react.id, { isLike });
    };

    const reaction = await this._postReactionRepository.getPostReaction(
      userId,
      postId
    );
     
    reaction
      ? await updateOrDelete(reaction)
      : await this._postReactionRepository.create({ userId, postId, isLike });

    const postReacts = await this._postReactionRepository.getPostReactionsById(
      postId
    );
   
    const likeCount = postReacts.filter(postReact => postReact.isLike === true).length
    const dislikeCount = postReacts.length - likeCount;
     
    return { likeCount, dislikeCount, reaction }
  }

  async deletePost(postId, userId) {
    const post = await this._postRepository.getById(postId);

    if (post.userId !== userId) {
      throw new Error("You cannot delete other people's posts!");
    }

    const deletedPost = await this._postRepository.deleteById(postId);
    return deletedPost ? true : false;
  }

  async updatePost(userId, post) {
    const postById = await this._postRepository.getById(post.id);
   
    if (postById && postById?.userId !== userId) {
      throw new Error("You cannot update other people's posts!");
    }

    const updatedPost = await this._postRepository.updateById(post.id, {body: post.body, imageId: post.imageId});
    return updatedPost
  }
}

export { PostService };
