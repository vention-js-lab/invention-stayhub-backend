import { type Accommodation } from '../entities/accommodations.entity';

export function addIsSavedToWishlistProperty(accommodations: Accommodation[]) {
  const parsedAccommodations = accommodations.map((accommodation) => {
    return {
      ...accommodation,
      isSavedToWishlist: Boolean(accommodation.wishlist.length),
    };
  });

  return parsedAccommodations;
}
