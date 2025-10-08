export interface TaskProps {
  id?: string;
  userId: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Task {
  private readonly _id?: string;
  private readonly _userId: string;
  private _title: string;
  private _description: string;
  private _completed: boolean;
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  constructor(props: TaskProps) {
    this._id = props.id;
    this._userId = this.validateUserId(props.userId);
    this._title = this.validateTitle(props.title);
    this._description = props.description;
    this._completed = props.completed;
    this._createdAt = props.createdAt || new Date();
    this._updatedAt = props.updatedAt || new Date();
  }

  get id(): string | undefined {
    return this._id;
  }

  get userId(): string {
    return this._userId;
  }

  get title(): string {
    return this._title;
  }

  get description(): string {
    return this._description;
  }

  get completed(): boolean {
    return this._completed;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  update(data: Partial<Pick<TaskProps, 'title' | 'description' | 'completed'>>): void {
    if (data.title !== undefined) {
      this._title = this.validateTitle(data.title);
    }
    if (data.description !== undefined) {
      this._description = data.description;
    }
    if (data.completed !== undefined) {
      this._completed = data.completed;
    }
    this._updatedAt = new Date();
  }

  private validateUserId(userId: string): string {
    if (!userId || userId.trim().length === 0) {
      throw new Error('User ID is required');
    }
    return userId.trim();
  }

  private validateTitle(title: string): string {
    if (!title || title.trim().length === 0) {
      throw new Error('Title is required');
    }
    if (title.trim().length > 100) {
      throw new Error('Title must not exceed 100 characters');
    }
    return title.trim();
  }

  toObject(): Record<string, unknown> {
    const obj: Record<string, unknown> = {
      userId: this._userId,
      title: this._title,
      description: this._description,
      completed: this._completed,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    };
    if (this._id) {
      obj.id = this._id;
    }
    return obj;
  }

  static fromFirestore(id: string, data: Record<string, unknown>): Task {
    return new Task({
      id,
      userId: data.userId as string,
      title: data.title as string,
      description: data.description as string,
      completed: data.completed as boolean,
      createdAt: data.createdAt ? (data.createdAt as Date) : new Date(),
      updatedAt: data.updatedAt ? (data.updatedAt as Date) : new Date(),
    });
  }
}
