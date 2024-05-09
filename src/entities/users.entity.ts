import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Orders } from './orders.entity';

@Entity({
  name: 'USERS',
})
export class Users {
  /**
   * Autogenerated UUID.
   * @example '15707987-2981-4dd6-a99b-443caea1d6bd'
   */
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * Name must be a not null string and have a maximum of 50 characters.
   * @example 'Juan Carlos Alvarez'
   */
  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
  })
  name: string;

  /**
   * Email must be a unique and not null string and have a maximum of 50 characters.
   * @example 'example@hotmail.com'
   */
  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
    unique: true,
  })
  email: string;

  /**
   * Password must be a not null string.
   * @example '@Example1'
   */
  @Column({
    type: 'varchar',
    length: 80,
    nullable: false,
  })
  password: string;

  /**
   * IsAdmin must NOT be provided by the user.
   */
  @Column({
    default: false,
  })
  isAdmin: boolean;

  /**
   * Phone must be a number.
   * @example '1234567890'
   */
  @Column({
    type: 'integer',
  })
  phone: number;

  /**
   * Country must be a string and has a maximum of 50 characters.
   * @example 'Mexico'
   */
  @Column({
    type: 'varchar',
    length: 50,
  })
  country: string;

  /**
   * Adress must be a string.
   * @example 'Example Street #123'
   */
  @Column({
    type: 'text',
  })
  address: string;

  /**
   * Adress must be a string.
   * @example 'Mexico City'
   */
  @Column({
    type: 'varchar',
    length: 50,
  })
  city: string;

  @OneToMany(() => Orders, (order) => order.user)
  @JoinColumn({ name: 'orders_id' })
  orders: Orders[];
}