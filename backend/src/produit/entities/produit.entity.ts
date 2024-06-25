import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Produit {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @Column()
  category: string;
  @Column()
  status: string;
  @Column('double')
  price: number;
  @Column('double')
  price_promo: number;

  @Column()
  image: string;
  @Column()
  meta_image: string;

  @Column()
  images: string;
  @Column()
  meta_images: string;
  @Column()
  nemuro_shoes: string;

  @Column()
  description: string;
}
