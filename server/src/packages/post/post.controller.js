import {
  Controller,
  ControllerHook
} from '#libs/packages/controller/controller.js';
import { HttpCode, HttpMethod } from '#libs/packages/http/http.js';
import {
  NotificationSocketEvent,
  SocketNamespace
} from '#libs/packages/socket/socket.js';

import { PostsApiPath } from './libs/enums/enums.js';

class PostController extends Controller {
  #postService;

  constructor({ apiPath, postService }) {
    super({ apiPath });
    this.#postService = postService;

    this.addRoute({
      method: HttpMethod.GET,
      url: PostsApiPath.ROOT,
      [ControllerHook.HANDLER]: this.getOnes
    });
    this.addRoute({
      method: HttpMethod.GET,
      url: PostsApiPath.$ID,
      [ControllerHook.HANDLER]: this.getById
    });
    this.addRoute({
      method: HttpMethod.POST,
      url: PostsApiPath.ROOT,
      [ControllerHook.HANDLER]: this.create
    });
    this.addRoute({
      method: HttpMethod.PUT,
      url: PostsApiPath.REACT,
      [ControllerHook.HANDLER]: this.react
    });
    this.addRoute({
      method: HttpMethod.DELETE,
      url: PostsApiPath.$ID,
      [ControllerHook.HANDLER]: this.delete
    });
    this.addRoute({
      method: HttpMethod.PUT,
      url: PostsApiPath.$ID,
      [ControllerHook.HANDLER]: this.update
    });
  }

  getOnes = request => this.#postService.getPosts(request.query);

  getById = request => this.#postService.getById(request.params.id);

  create = async (request, reply) => {
    const post = await this.#postService.create(request.user.id, request.body);

    request.io
      .of(SocketNamespace.NOTIFICATION)
      .emit(NotificationSocketEvent.NEW_POST, post); // notify all users that a new post was created
    return reply.status(HttpCode.CREATED).send(post);
  };

  react = async request => {
    const { likeCount, dislikeCount, reaction } =
      await this.#postService.setReaction(request.user.id, request.body);

    if (reaction?.post && reaction.post.userId !== request.user.id) {
      request.io
        .of(SocketNamespace.NOTIFICATION)
        .to(`${reaction.post.userId}`)
        .emit(
          request.body.isLike === true
            ? NotificationSocketEvent.LIKE_POST
            : NotificationSocketEvent.DISLIKE_POST
        );
    }

    return { likeCount, dislikeCount };
  };

  delete = async (request, reply) => {
    try {
      const response = await this.#postService.deletePost(
        request.params.id,
        request.user.id
      );

      return response
        ? reply.status(HttpCode.OK).send(request.params.id)
        : reply.status(HttpCode.NOT_FOUND);
    } catch (e) {
      return reply.status(HttpCode.FORBIDDEN).send(e.message);
    }
  };
  update = async (request, reply) => {
    try {
      const response = await this.#postService.updatePost(
        request.body.userId,
        request.body
      );
  
      return response ? response : reply.status(HttpCode.NOT_FOUND);
    } catch (error) {
      return reply.status(HttpCode.FORBIDDEN).send(error.message);
    }
  };
}

export { PostController };
