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
}

export { PostService };
