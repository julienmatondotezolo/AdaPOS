const zenchefUrl: string | undefined = process.env.NEXT_PUBLIC_ZENCHEF_API_URL;
const zenchefAuthToken = process.env.NEXT_PUBLIC_ZENCHEF_AUTH_TOKEN;
const zenchefRestaurantId = process.env.NEXT_PUBLIC_ZENCHEF_RESTAURANT_ID;

export async function fetchBookingsByData({ date }: { date: string }): Promise<any> {
  if (zenchefAuthToken && zenchefRestaurantId)
    try {
      const responseBookings: Response = await fetch(zenchefUrl + `/bookings/daily?date=${date}/&all=1/`, {
        method: "GET",
        headers: {
          "auth-token": zenchefAuthToken,
          restaurantid: zenchefRestaurantId,
        },
      });

      if (responseBookings.ok) {
        return responseBookings.json();
      } else {
        throw responseBookings;
      }
    } catch (error) {
      console.error("Impossible to fetch bookings by date id:", error);
    }
}

export async function fetchRooms(): Promise<any> {
  if (zenchefAuthToken && zenchefRestaurantId)
    try {
      const responseTables: Response = await fetch(zenchefUrl + `/restaurants/${zenchefRestaurantId}/bookingrooms`, {
        method: "GET",
        headers: {
          "auth-token": zenchefAuthToken,
          restaurantid: zenchefRestaurantId,
        },
      });

      if (responseTables.ok) {
        return responseTables.json();
      } else {
        throw responseTables;
      }
    } catch (error) {
      console.error("Impossible to fetch rooms:", error);
    }
}

export async function fetchTableByRoomId({ roomId }: { roomId: string }): Promise<any> {
  if (zenchefAuthToken && zenchefRestaurantId)
    try {
      const responseTables: Response = await fetch(
        zenchefUrl + `/restaurants/${zenchefRestaurantId}/bookingrooms/${roomId}`,
        {
          method: "GET",
          headers: {
            "auth-token": zenchefAuthToken,
            restaurantid: zenchefRestaurantId,
          },
        },
      );

      if (responseTables.ok) {
        return responseTables.json();
      } else {
        throw responseTables;
      }
    } catch (error) {
      console.error("Impossible to fetch tables by room id:", error);
    }
}
