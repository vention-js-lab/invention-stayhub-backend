import { AccommodationsService } from '#/modules/accommodations/services/accommodations.service';
import { WishlistsService } from '#/modules/wishlists/wishlists.service';
import { Wishlist } from '#/modules/wishlists/entities/wishlist.entity';
import { Test, type TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { mockUserId, mockWishlist, mockWishlistItem, mockAccommodation } from './fixtures/wishlists-data.mock';
import { NotFoundException } from '@nestjs/common';

describe('WishlistService', () => {
  let wishlistService: WishlistsService;
  let wishlistRepo: Repository<Wishlist>;

  const accommodationServiceMock = {
    getAccommodationById: jest.fn().mockResolvedValue(mockAccommodation),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WishlistsService,
        AccommodationsService,
        {
          provide: getRepositoryToken(Wishlist),
          useClass: Repository,
        },
        {
          provide: AccommodationsService,
          useValue: accommodationServiceMock,
        },
      ],
    }).compile();

    wishlistService = module.get<WishlistsService>(WishlistsService);
    wishlistRepo = module.get<Repository<Wishlist>>(getRepositoryToken(Wishlist));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('addToWishlist', () => {
    it('adds accommodation to wishlist', async () => {
      const wishlistItem = mockWishlistItem;
      const accommodationId = mockAccommodation.id;
      const accountId = mockUserId;

      wishlistRepo.findOne = jest.fn().mockResolvedValue(null);
      wishlistRepo.create = jest.fn().mockReturnValue(wishlistItem);
      wishlistRepo.save = jest.fn().mockResolvedValue(wishlistItem);

      const result = await wishlistService.addToWishlist(accountId, accommodationId);

      expect(wishlistRepo.create).toHaveBeenCalledWith({
        accountId,
        accommodationId,
      });
      expect(wishlistRepo.save).toHaveBeenCalledWith(wishlistItem);
      expect(result).toEqual(wishlistItem);
    });
  });

  describe('getUserWishlist', () => {
    it('should return user wishlist', async () => {
      const userWishlist = mockWishlist;
      const userId = mockUserId;

      wishlistRepo.find = jest.fn().mockResolvedValue(userWishlist);

      const result = await wishlistService.getUserWishlist(userId);

      expect(wishlistRepo.find).toHaveBeenCalledWith({
        where: { accountId: userId },
        relations: ['accommodation', 'accommodation.address', 'accommodation.reviews'],
      });
      expect(result).toEqual(userWishlist);
    });
  });

  describe('removeFromWishlist', () => {
    it('removes accommodation from wishlist', async () => {
      const accountId = mockUserId;
      const accommodationId = mockAccommodation.id;
      const wishlistItem = mockWishlistItem;

      wishlistRepo.findOne = jest.fn().mockResolvedValue(wishlistItem);
      wishlistRepo.remove = jest.fn().mockResolvedValue(wishlistItem);

      await wishlistService.removeFromWishlist(accountId, accommodationId);

      expect(wishlistRepo.findOne).toHaveBeenCalledWith({
        where: { accountId, accommodationId },
      });
      expect(wishlistRepo.remove).toHaveBeenCalledWith(wishlistItem);
    });

    it('throws error if wishlist item does not exist', async () => {
      const accountId = mockUserId;
      const accommodationId = mockAccommodation.id;

      wishlistRepo.findOne = jest.fn().mockResolvedValue(null);

      await expect(wishlistService.removeFromWishlist(accountId, accommodationId)).rejects.toThrow(NotFoundException);
    });
  });
});
