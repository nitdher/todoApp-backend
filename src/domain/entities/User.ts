export interface UserProps {
  id?: string;
  email: string;
  createdAt?: Date;
}

export class User {
  private readonly _id?: string;
  private readonly _email: string;
  private readonly _createdAt: Date;

  constructor(props: UserProps) {
    this._id = props.id;
    this._email = this.validateEmail(props.email);
    this._createdAt = props.createdAt || new Date();
  }

  get id(): string | undefined {
    return this._id;
  }

  get email(): string {
    return this._email;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  private validateEmail(email: string): string {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      throw new Error('Invalid email format');
    }
    return email.toLowerCase().trim();
  }

  toObject(): Record<string, unknown> {
    const obj: Record<string, unknown> = {
      email: this._email,
      createdAt: this._createdAt,
    };
    if (this._id) {
      obj.id = this._id;
    }
    return obj;
  }

  static fromFirestore(id: string, data: Record<string, unknown>): User {
    return new User({
      id,
      email: data.email as string,
      createdAt: data.createdAt ? (data.createdAt as Date) : new Date(),
    });
  }
}
