/**
 * External dependencies.
 */
import { Play, Pause, Upload } from "lucide-react";

/**
 * Internal dependencies.
 */
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useSwiftWords } from "./useSwiftWords";

export const App = () => {
	const {
		text,
		setText,
		handleFileUpload,
		isPlaying,
		stopReading,
		displayWordByWord,
		wordsPerMinute,
		setWordsPerMinute,
		word,
		theme,
		setTheme,
	} = useSwiftWords();

	return (
		<div className={theme === "dark" ? "dark" : ""}>
			<div className="min-h-screen w-full grid place-items-center">
				<Card className="w-full max-w-xl">
					<CardHeader>
						<CardTitle>Swift Words</CardTitle>
						<CardDescription>
							Upload file, or paste text to get started.
						</CardDescription>
					</CardHeader>

					<CardContent>
						{isPlaying ? (
							<div className="relative h-68 border rounded-md shadow-sm flex items-center justify-center">
								<h1 className="absolute inset-0 flex items-center justify-center font-semibold text-5xl">
									{word}
								</h1>
							</div>
						) : (
							<Textarea
								className="h-68 resize-none"
								placeholder="Paste your text here..."
								value={text}
								onChange={(e) => setText(e.target.value)}
							/>
						)}
					</CardContent>

					<CardFooter className="grid gap-2 grid-cols-4">
						{/* Play/Pause Button */}
						<Button
							variant="outline"
							onClick={() => {
								if (isPlaying) stopReading();
								else displayWordByWord();
							}}
						>
							{isPlaying ? <Pause /> : <Play />}
							{isPlaying ? "Stop" : "Start"}
						</Button>

						{/* File Upload */}
						<input
							type="file"
							accept=".pdf,.txt,.md"
							onChange={handleFileUpload}
							className="hidden"
							id="file-upload"
						/>
						<Button
							variant="outline"
							disabled={isPlaying}
							className={isPlaying ? "cursor-not-allowed" : ""}
							onClick={() => document.getElementById("file-upload")?.click()}
						>
							<Upload />
							Upload
						</Button>

						{/* Words Per Minute Selector */}
						<Select
							disabled={isPlaying}
							value={String(wordsPerMinute)}
							onValueChange={(value) => setWordsPerMinute(Number(value))}
						>
							<SelectTrigger className="w-full">
								<SelectValue placeholder="Select words per minute" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="50">50</SelectItem>
								<SelectItem value="100">100</SelectItem>
								<SelectItem value="150">150</SelectItem>
								<SelectItem value="200">200</SelectItem>
								<SelectItem value="250">250</SelectItem>
								<SelectItem value="300">300</SelectItem>
								<SelectItem value="350">350</SelectItem>
								<SelectItem value="400">400</SelectItem>
								<SelectItem value="450">450</SelectItem>
								<SelectItem value="500">500</SelectItem>
							</SelectContent>
						</Select>

						{/* Theme Selector */}
						<Select
							value={theme}
							onValueChange={(value) => setTheme(value as "light" | "dark")}
						>
							<SelectTrigger className="w-full">
								<SelectValue placeholder="Select Theme" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="light">Light</SelectItem>
								<SelectItem value="dark">Dark</SelectItem>
							</SelectContent>
						</Select>
					</CardFooter>
				</Card>
			</div>
		</div>
	);
};
