import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  DeleteDateColumn,
} from 'typeorm';
import { AccommodationImage } from './accommodation-image.entity';
import { AccommodationAmenity } from './accommodation-amenity.entity';
import { AccommodationAddress } from './accommodation-address.entity';
import { Account } from '#/modules/users/entities/account.entity';
import { Wishlist } from '#/modules/wishlists/entities/wishlist.entity';

@Entity('accommodation')
export class Accommodation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column({ name: 'cover_image' })
  coverImage: string;

  @Column('decimal')
  price: number;

  @Column()
  available: boolean;

  @Column({ name: 'available_from' })
  availableFrom: Date;

  @Column({ name: 'available_to' })
  availableTo: Date;

  @Column({ name: 'square_meters' })
  squareMeters: number;

  @Column({ name: 'number_of_rooms' })
  numberOfRooms: number;

  @Column({ name: 'allowed_number_of_people' })
  allowedNumberOfPeople: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date | null;

  @ManyToOne(() => Account, (account) => account.accommodations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'owner_id' })
  owner: Account;

  @Column({ name: 'owner_id' })
  ownerId: string;

  @OneToMany(() => AccommodationImage, (image) => image.accommodation)
  images: AccommodationImage[];

  @OneToOne(() => AccommodationAmenity, (amenity) => amenity.accommodation)
  amenity: AccommodationAmenity;

  @OneToOne(() => AccommodationAddress, (address) => address.accommodation)
  address: AccommodationAddress;

  @OneToMany(() => Wishlist, (wishlist) => wishlist.accommodation)
  wishlist: Wishlist[];
}
