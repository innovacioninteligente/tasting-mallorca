import { Hotel } from '../domain/hotel.model';
import { HotelRepository } from '../domain/hotel.repository';

export async function updateHotel(
  hotelRepository: HotelRepository,
  hotelData: Partial<Hotel> & { id: string }
): Promise<void> {
  await hotelRepository.update(hotelData);
}
