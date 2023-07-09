import { AbstractRepository } from '#libs/packages/database/database.js';

class PostReactionRepository extends AbstractRepository {
  constructor({ postReactionModel }) {
    super(postReactionModel);
  }

  getPostReaction(userId, postId) {
    return this.model
      .query()
      .select()
      .where({ userId })
      .andWhere({ postId })
      .withGraphFetched('[post]')
      .first();
  }

  getPostReactionsById(postId) {
    return this.model
      .query()
      .select()
      .where({ postId })
      .withGraphFetched('[post]');
  }
}
export { PostReactionRepository };
