// const adaPrintUrl: string | undefined = "http://localhost:8000";
// const adaPrintUrl: string | undefined = "http://192.168.129.18:8000"; // Osteri
const adaPrintUrl: string | undefined = "http://192.168.129.20:8000"; // Windows
// const adaPrintUrl: string | undefined = "http://192.168.129.4:8000"; // Home

export async function sendPdfFile({ filename, formData }: { filename: string; formData: any }): Promise<any> {
  try {
    const responseAdaPrint: Response = await fetch(adaPrintUrl + `/${filename}.pdf`, {
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
