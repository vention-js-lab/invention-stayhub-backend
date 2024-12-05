import { type Accommodation } from '../entities/accommodation.entity';

export function addIsSavedToWishlistProperty(accommodations: Accommodation[], accoutId: string | undefined) {
  const parsedAccommodations = accommodations.map((accommodation) => {
    const { wishlist, ...rest } = accommodation;

    return {
      ...rest,
      isSavedToWishlist: accoutId ? wishlist.length > 0 : false,
    };
  });

  return parsedAccommodations;
}
