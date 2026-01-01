/**
 * External dependencies.
 */
import { useCallback, useState, useMemo, useRef, useEffect } from "react";
import { toast } from "sonner";
import pdfToText from "react-pdftotext";

export const useSwiftWords = () => {
  const [text, setText] = useState<string>("");
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [word, setWord] = useState<string>("");
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [wordsPerMinute, setWordsPerMinute] = useState<number>(250);

  const intervalRef = useRef<number | null>(null);
  const currentIndexRef = useRef<number>(0);

  // Calculate interval between words based on WPM
  const intervalBetweenWord = useMemo(
    () => 60000 / wordsPerMinute,
    [wordsPerMinute]
  );

  // Handle File Upload
  const handleFileUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      try {
        if (file.type === "application/pdf") {
          const content = await pdfToText(file);
          setText(content);
          currentIndexRef.current = 0; // Reset index on new text
        } else if (file.type === "text/plain" || file.name.endsWith(".md")) {
          const reader = new FileReader();
          reader.onload = (event) => {
            const result = event.target?.result;
            if (typeof result === "string") {
              setText(result);
              currentIndexRef.current = 0; // Reset index on new text
            }
          };
          reader.readAsText(file);
        } else {
          toast.error("Unsupported file type. Use PDF, TXT, or MD.");
        }
      } catch (error) {
        toast.error("Error reading file: " + (error as Error).message);
      }
    },
    []
  );

  // Start / Resume reading
  const displayWordByWord = useCallback(() => {
    if (!text) {
      toast.error("No text available");
      setIsPlaying(false);
      return;
    }

    const words = text.split(/\s+/).filter(Boolean);

    // Clear previous interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    setIsPlaying(true);

    intervalRef.current = window.setInterval(() => {
      if (currentIndexRef.current >= words.length) {
        clearInterval(intervalRef.current!);
        intervalRef.current = null;
        setIsPlaying(false);
        return;
      }

      setWord(words[currentIndexRef.current]);
      currentIndexRef.current += 1;
    }, intervalBetweenWord);
  }, [text, intervalBetweenWord]);

  // Stop / Pause reading
  const stopReading = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsPlaying(false);
  }, []);

  // Set theme on mount
  useEffect(() => {
    const body = document.body;
    if (theme === "dark") {
      body.classList.add("dark");
    } else {
      body.classList.remove("dark");
    }
  }, [theme]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return {
    text,
    setText,
    handleFileUpload,
    displayWordByWord,
    stopReading,
    isPlaying,
    setIsPlaying,
    wordsPerMinute,
    setWordsPerMinute,
    theme,
    setTheme,
    word,
  };
};
