import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ArticleService } from './article.service';

@ApiTags('Article')
@Controller('article')
export class ArticleController {
  private readonly logger = new Logger(ArticleController.name);

  constructor(private readonly articleService: ArticleService) {}

  @Get('articles')
  async getArticles(
    @Query('tag') tag: string,
    @Query('author') author: string,
    @Query('favorited') favorited: string,
    @Query('limit') limit: number,
    @Query('offset') offset: number,
  ) {
    return `List of articles via filters`;
  }

  @Get('articles/feed')
  async getArticlesFeed(
    @Query('limit') limit: number,
    @Query('offset') offset: number,
  ) {
    return `List of articles created by followed users`;
  }

  @Get('articles/:slug')
  async getArticleBySlug(@Param('slug') slug: string) {
    return `An article by slug`;
  }

  @Post('articles')
  async createArticle(@Body('article') article: any) {
    return `A created article`;
  }

  @Put('articles/:slug')
  async updateArticle(@Param('slug') slug: string) {
    return `Updates an article`;
  }

  @Delete('articles/:slug')
  async deleteArticle(@Param('slug') slug: string) {
    return `Deletes an article`;
  }

  @Post('articles/:slug/favorite')
  async followArticle(@Param('slug') slug: string) {
    return `Favorite the article`;
  }

  @Delete('articles/:slug/favorite')
  async unFollowArticle(@Param('slug') slug: string) {
    return `Unfavorite the article`;
  }
}
