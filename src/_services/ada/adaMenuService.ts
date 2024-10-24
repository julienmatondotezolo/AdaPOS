const adaMenuUrl: string | undefined = process.env.NEXT_PUBLIC_API_URL;

export async function fetchCategories(): Promise<any> {
  try {
    const responseCategories: Response = await fetch(adaMenuUrl + `/category/parents`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // Authorization: `Bearer ${session.session.user.token}`,
        "ngrok-skip-browser-warning": "1",
      },
    });

    if (responseCategories.ok) {
      return responseCategories.json();
    } else {
      throw responseCategories;
    }
  } catch (error) {
    console.error("Impossible to fetch categories:", error);
  }
}

export async function fetchMenuItemByCategoryId({ categoryId }: { categoryId: string }): Promise<any> {
  try {
    const responseMenuItem: Response = await fetch(adaMenuUrl + `/menu-item/category/${categoryId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // Authorization: `Bearer ${session.session.user.token}`,
        "ngrok-skip-browser-warning": "1",
      },
    });

    if (responseMenuItem.ok) {
      return responseMenuItem.json();
    } else {
      throw responseMenuItem;
    }
  } catch (error) {
    console.error("Impossible to fetch menu items:", error);
  }
}

export async function fetchOrder(): Promise<any> {
  try {
    const responseGetOrder: Response = await fetch(adaMenuUrl + `/order`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // Authorization: `Bearer ${session.session.user.token}`,
        "ngrok-skip-browser-warning": "1",
      },
    });

    if (responseGetOrder.ok) {
      return responseGetOrder.json();
    } else {
      return responseGetOrder;
    }
  } catch (error) {
    console.error("Impossible to create menu item:", error);
  }
}

export async function createOrder({ orderObject }: { orderObject: any }): Promise<any> {
  try {
    const responseCreateOrder: Response = await fetch(adaMenuUrl + `/order`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Authorization: `Bearer ${session.session.user.token}`,
        "ngrok-skip-browser-warning": "1",
      },
      body: JSON.stringify(orderObject),
    });

    if (responseCreateOrder.ok) {
      return responseCreateOrder.json();
    } else {
      return responseCreateOrder;
    }
  } catch (error) {
    console.error("Impossible to create menu item:", error);
  }
}

export async function deleteOrder({ orderId }: { orderId: string }): Promise<any> {
  try {
    const responseDeleteOrder: Response = await fetch(adaMenuUrl + `/order/${orderId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        // Authorization: `Bearer ${session.session.user.token}`,
        "ngrok-skip-browser-warning": "1",
      },
    });

    if (responseDeleteOrder.ok) {
      return responseDeleteOrder.json();
    } else {
      return responseDeleteOrder;
    }
  } catch (error) {
    console.error("Impossible to delete menu item:", error);
  }
}
