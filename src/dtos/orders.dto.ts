import { ArrayMinSize, IsArray, IsNotEmpty, IsUUID } from 'class-validator';
import { Products } from 'src/entities/products.entity';

export class CreateOrderDto {
  /**
   * UserId must be a valid UUID, and belong to a registered user.
   * @example '15707987-2981-4dd6-a99b-443caea1d6bd'
   */

  @IsUUID()
  @IsNotEmpty()
  userId: string;

  /**
   * Product IDs must be a valid UUID, and belong to an existing product.
   * @example '15707987-2981-4dd6-a99b-443caea1d6bd'
   */

  @IsArray()
  @ArrayMinSize(1)
  products: Partial<Products[]>;
}
