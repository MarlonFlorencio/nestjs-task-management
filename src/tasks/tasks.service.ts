import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import { v4 as uuidv4 } from 'uuid';
import { CreateTaskDto } from './dto/create-task-dto';
import { FilterTaskDto } from './dto/filter-task-dto';

@Injectable()
export class TasksService {
  private tasks: Array<Task> = [];

  getAllTasks = () => this.tasks;

  getFilteredTasks = (filter: FilterTaskDto): Array<Task> => {

    let result = this.getAllTasks();

    if(filter.status) {
      result = result.filter(it => it.status === filter.status)
    }

    if(filter.search) {
      result = result.filter(
        it => it.title.includes(filter.search) || it.description.includes(filter.search)
      )
    }

    return result;
  }

  getTaskById = (id: string): Task =>{
    const task = this.tasks.find(it => it.id === id)
    
    if(!task) {
      throw new NotFoundException(`Task with id=${id} not found`);
    }

    return task;
  } 

  deleteTaskById = (id: string) : void => {
      this.tasks = this.tasks.filter(it => it.id !== id);
  }

  updateStatus = (id: string, status: TaskStatus) : Task => {
    const task = this.getTaskById(id);
    
    if(task) {
      task.status = status;
      this.tasks[this.tasks.indexOf(task)] = task;  
    }

    return task;
  }

  createTask(createTaskDto: CreateTaskDto): Task {

    const {title, description} = createTaskDto;

    const task: Task = {
      id: uuidv4(),
      title,
      description,
      status: TaskStatus.OPEN,
    };

    this.tasks.push(task);
    return task;
  }
}
