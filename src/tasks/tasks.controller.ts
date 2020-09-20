import { Controller, Get, Post, Body, Param, Delete, Patch, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task, TaskStatus } from './task.model';
import { CreateTaskDto } from './dto/create-task-dto';
import { FilterTaskDto } from './dto/filter-task-dto';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';

@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get()
  getTasks( @Query(ValidationPipe) filter: FilterTaskDto): Array<Task> {
    if (Object.keys(filter).length) {
      return this.tasksService.getFilteredTasks(filter);
    } else {
      return this.tasksService.getAllTasks();
    }    
  }

  @Get(':id')
  getTaskById(@Param('id') id: string): Task {
    return this.tasksService.getTaskById(id);
  }

  @Delete(':id')
  deleteTaskById(@Param('id') id: string) {
    return this.tasksService.deleteTaskById(id);
  }

  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body('status', TaskStatusValidationPipe) status: TaskStatus) {
    return this.tasksService.updateStatus(id, status);
  }

  @Post()
  @UsePipes(ValidationPipe)
  createTask(@Body() createTaskDto: CreateTaskDto ) {
    const task = this.tasksService.createTask(createTaskDto)
    return task;
  }
}
