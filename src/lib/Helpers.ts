import jsPDF from "jspdf";
import { StaticImageData } from "next/image";

import { MenuType } from "@/_types/adaType";

import osteriaLogo from "../assets/images/osteria-logo-black.png";

export async function getBase64FromImage(src: string | HTMLImageElement | StaticImageData): Promise<string> {
  return new Promise((resolve, reject) => {
    let img: HTMLImageElement;

    if (typeof src === "string") {
      img = new Image();
      img.src = src;
    } else if (src) {
      // Convert StaticImageData to base64 string
      const dataUrl = src.src as string;

      resolve(dataUrl);
    } else {
      img = src;
    }

    img.onload = () => {
      const canvas = document.createElement("canvas");

      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;

      const ctx = canvas.getContext("2d");

      ctx.drawImage(img, 0, 0);

      const dataUrl = canvas.toDataURL("image/png");

      resolve(dataUrl);
    };

    img.onerror = () => {
      reject(new Error("Failed to load image"));
    };
  });
}

export const formatDate = (date: Date) => {
  const options: any = { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" };

  return new Intl.DateTimeFormat("en-GB", options).format(date);
};

export const invoiceTicket = async ({ total, allCartItems }: { total: number; allCartItems: MenuType[] }) => {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: [72, 297], // Width: 72 mm, Height: 297 mm
    putOnlyUsedFonts: true,
    floatPrecision: 16, // or "smart", default is 16
  });

  const date = formatDate(new Date());

  // Convert Image component to base64
  const logoBase64 = await getBase64FromImage(osteriaLogo);

  // Add image
  doc.addImage(logoBase64, "PNG", 26, 4, 20, 20);

  // Header
  doc.setFontSize(12);
  doc.text("l'Osteria", 36, 30, {
    align: "center",
  });

  doc.setFontSize(8);
  doc.text(date, 35, 35, {
    align: "center",
  });

  // Table header
  doc.text("Quantity", 5, 45, {
    align: "left",
  });
  doc.text("Description", 28, 45, {
    align: "left",
  });
  doc.text("Price", 56, 45, {
    align: "right",
  });
  doc.text("Total", 67, 45, {
    align: "right",
  });

  // Start at the initial y-coordinate
  let contentHeight = 50;

  // Table content
  allCartItems.forEach((cart: MenuType, index: number) => {
    const yPosition = contentHeight + index * 2;

    doc.text(cart.quantity.toString(), 14, yPosition, {
      align: "right",
    });
    doc.text(cart.names["fr"], 43, yPosition, {
      align: "right",
      maxWidth: 31,
    });
    doc.text(cart.price.toFixed(2), 56, yPosition, {
      align: "right",
    });
    doc.text((cart.price * cart.quantity).toFixed(2), 67, yPosition, {
      align: "right",
    });

    // Update totalHeight after each iteration
    contentHeight = yPosition + 6;
  });

  // Add total
  doc.setLineWidth(0.3);
  doc.setLineDashPattern([0.8], 1);
  doc.line(5, contentHeight, 68, contentHeight);
  doc.text("To pay:", 6, contentHeight + 5);
  doc.text(total + " EUR", 67, contentHeight + 5, {
    align: "right",
  });
  doc.setLineDashPattern([0.8], 1);
  doc.line(5, contentHeight + 8, 68, contentHeight + 8);

  // Add footer
  doc.text("Dit is geen geldig btw-kasticket", 36, contentHeight + 15, {
    align: "center",
    maxWidth: 31,
  });

  doc.setFontSize(12);
  doc.text("Dank u en tot weerziens", 36, contentHeight + 27, {
    align: "center",
  });
  doc.text("Merci et à bientôt", 36, contentHeight + 33, {
    align: "center",
  });
  doc.text("Grazie e a presto", 36, contentHeight + 39, {
    align: "center",
  });

  return doc;
};

type ticketProps = {
  title: string;
  tableNumber: string;
  waiter: string;
  allCartItems?: any[];
};

const ticketHeadSection = ({ title, tableNumber, waiter }: { title: string; tableNumber: string; waiter: string }) => {
  const date = formatDate(new Date());

  var doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: [72, 297], // Width: 72 mm, Height: 297 mm
    putOnlyUsedFonts: true,
    floatPrecision: 16, // or "smart", default is 16
  });

  doc.setFontSize(12);
  doc.text(title, 36, 10, {
    align: "center",
  });

  doc.setFontSize(8);
  doc.text(date, 35, 15, {
    align: "center",
  });

  doc.setFontSize(12);
  doc.text(`T-${tableNumber} - ${waiter}`, 36, 20, {
    align: "center",
  });

  return doc;
};

export const barTicket = async ({ title, tableNumber, waiter }: ticketProps) => {
  const doc = ticketHeadSection({ title, tableNumber, waiter });

  if (title == "bar") {
    doc.setLineWidth(7);
    doc.line(5, 35, 68, 35);

    doc.setFontSize(12);
    doc.setTextColor("#ffffff");
    doc.text(title, 36, 36, {
      align: "center",
    });
  } else if (title == "kitchen") {
    doc.setFontSize(12);
    doc.text("Couverts:", 35, 25, {
      align: "center",
    });
  } else if (title == "pizzeria") {
    doc.setFontSize(12);
    doc.text("Couverts:", 35, 25, {
      align: "center",
    });
  }

  return doc;
};
