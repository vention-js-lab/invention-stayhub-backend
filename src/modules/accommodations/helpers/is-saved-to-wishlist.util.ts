import { type Accommodation } from '../entities/accommodations.entity';

export function addIsSavedToWishlistProperty(accommodations: Accommodation[], accoutId: string | null) {
  const parsedAccommodations = accommodations.map((accommodation) => {
    const { wishlist, ...rest } = accommodation;

    return {
      ...rest,
      isSavedToWishlist: accoutId ? wishlist.length > 0 : false,
    };
  });

  return parsedAccommodations;
}
