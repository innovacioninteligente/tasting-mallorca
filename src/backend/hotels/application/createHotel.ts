import { Hotel } from '../domain/hotel.model';
import { HotelRepository } from '../domain/hotel.repository';

export async function createHotel(
  hotelRepository: HotelRepository,
  hotelData: Hotel
): Promise<string> {
  await hotelRepository.save(hotelData);
  return hotelData.id;
}
