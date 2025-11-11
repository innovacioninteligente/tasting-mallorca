import { Hotel } from '../domain/hotel.model';
import { HotelRepository } from '../domain/hotel.repository';

export async function findHotelById(
  hotelRepository: HotelRepository,
  id: string
): Promise<Hotel | null> {
  return hotelRepository.findById(id);
}

export async function findAllHotels(
  hotelRepository: HotelRepository
): Promise<Hotel[]> {
  return hotelRepository.findAll();
}
