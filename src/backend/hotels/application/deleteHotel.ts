import { HotelRepository } from '../domain/hotel.repository';

export async function deleteHotel(
  hotelRepository: HotelRepository,
  id: string
): Promise<void> {
  await hotelRepository.delete(id);
}
