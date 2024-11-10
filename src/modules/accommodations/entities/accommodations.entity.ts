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
} from 'typeorm';
import { AccommodationImage } from '#/modules/accommodations/entities/accommodation-image.entity';
import { AccommodationAmenity } from '#/modules/accommodations/entities/accommodation-amenity.entity';
import { AccommodationAddress } from '#/modules/accommodations/entities/accommodation-address.entity';
import { User } from '#/modules/user/entities/user.entity';

@Entity('accommodations')
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

  @ManyToOne(() => User, (user) => user.accommodations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'owner_id' })
  owner: User;
  @Column({ name: 'owner_id' })
  ownerId: string;

  @OneToMany(() => AccommodationImage, (image) => image.accommodation)
  images: AccommodationImage[];

  @OneToOne(() => AccommodationAmenity, (amenity) => amenity.accommodation)
  @JoinColumn()
  amenity: AccommodationAmenity;

  @OneToOne(() => AccommodationAddress, (address) => address.accommodation)
  @JoinColumn()
  address: AccommodationAddress;
}