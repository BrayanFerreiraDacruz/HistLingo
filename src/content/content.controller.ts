import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ContentService } from './content.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('content')
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @Get('modules')
  getModules() {
    return this.contentService.getModules();
  }

  @Get('modules/:id/lessons')
  getLessons(@Param('id') moduleId: string) {
    return this.contentService.getLessonsByModule(moduleId);
  }

  @Get('lessons/:id/challenges')
  getChallenges(@Param('id') lessonId: string) {
    return this.contentService.getChallengesByLesson(lessonId);
  }
}
