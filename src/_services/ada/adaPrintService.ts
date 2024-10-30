const adaPrintUrl: string | undefined = "http://localhost:8000";

export async function sendPdfFile({ formData }: { formData: any }): Promise<any> {
  try {
    const responseAdaPrint: Response = await fetch(adaPrintUrl + `/order.pdf`, {
      method: "PUT",
      headers: {
        "Content-Type": "multipart/form-data",
      },
      body: formData,
    });

    if (responseAdaPrint.ok) {
      return responseAdaPrint.json();
    } else {
      return responseAdaPrint;
    }
  } catch (error) {
    console.error("Impossible to send pdf file:", error);
  }
}

export async function sendPdfFilePUT({ formData }: { formData: any }): Promise<any> {
  try {
    const responseAdaPrint: Response = await fetch(adaPrintUrl + `/order.pdf`, {
      method: "PUT",
      headers: {
        "Content-Type": "multipart/form-data;",
      },
      body: formData,
    });

    if (responseAdaPrint.ok) {
      return responseAdaPrint.json();
    } else {
      return responseAdaPrint;
    }
  } catch (error) {
    console.error("Impossible to send pdf file:", error);
  }
}
