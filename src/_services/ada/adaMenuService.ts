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
