import { Accommodation } from '../entities/accommodations.entity';

export function parseWishlist(accommodations: Accommodation[]) {
  const parsedAccommodations = accommodations.map((accommodation) => {
    return {
      ...accommodation,
      isSavedToWishlist: accommodation.wishlist.length > 0 ? true : false,
    };
  });

  return parsedAccommodations;
}
