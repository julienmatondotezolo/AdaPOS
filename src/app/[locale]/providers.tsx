import { NextIntlClientProvider } from "next-intl";
import { ThemeProvider } from "next-themes";
import React, { JSX, ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { Provider } from "react-redux";

// Manually import store
import { store } from "@/lib/store";

// Manually import messages for each locale
import enMessages from "../../../messages/en.json";
import frMessages from "../../../messages/fr.json";
import nlMessages from "../../../messages/nl.json";

type Props = {
  children?: ReactNode;
  locale: string;
};

const queryClient = new QueryClient();

// Function to select the correct messages based on the locale
function selectMessages(locale: string) {
  switch (locale) {
    case "nl":
      return nlMessages;
    case "fr":
      return frMessages;
    // ... add cases for other locales as needed
    default:
      return enMessages; // Default to English messages
  }
}

export default function Providers({ children, locale }: Props): JSX.Element {
  // const messages = useMessages();
  const timeZone = "Europe/Brussels";
  const messages = selectMessages(locale);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <NextIntlClientProvider locale={locale} messages={messages} timeZone={timeZone}>
          <Provider store={store}>{children}</Provider>
        </NextIntlClientProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
