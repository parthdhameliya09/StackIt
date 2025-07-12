import { useState, useMemo, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { toast } from "sonner";

type Props = {
    isOpen: boolean;
    onClose: () => void;
    question: {
        id: string;
        title: string;
        description: string;
    };
    onVote: (vote: boolean) => void; // ✅ vote: true = vote, false = unvote
    onAnswer: (answer: string) => void;
    hasVoted: boolean;
};

export function QuestionDialog({
    isOpen,
    onClose,
    question,
    onVote,
    onAnswer,
    hasVoted,
}: Props) {
    const [showEditor, setShowEditor] = useState(false);
    const [answerText, setAnswerText] = useState("");
    const [hasAnswered, setHasAnswered] = useState(false);
    const [voted, setVoted] = useState(hasVoted); // ✅ manage local vote toggle

    // Keep local vote state in sync if prop changes
    useEffect(() => {
        setVoted(hasVoted);
    }, [hasVoted]);

    const handleSubmit = () => {
        if (!answerText.trim()) return;
        onAnswer(answerText);
        toast.success("Answer submitted");
        setAnswerText("");
        setShowEditor(false);
        setHasAnswered(true);
    };

    const uploadImageToCloudinary = async (file: File) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "your_upload_preset"); // 🔁 Replace
        const res = await fetch("https://api.cloudinary.com/v1_1/your_cloud_name/image/upload", {
            method: "POST",
            body: formData,
        });
        const data = await res.json();
        return data.secure_url;
    };

    const imageHandler = () => {
        const input = document.createElement("input");
        input.setAttribute("type", "file");
        input.setAttribute("accept", "image/*");
        input.click();
        input.onchange = async () => {
            const file = input.files?.[0];
            if (file) {
                const quill = (window as any).quillRef;
                const range = quill.getSelection();
                const url = await uploadImageToCloudinary(file);
                quill.insertEmbed(range.index, "image", url);
            }
        };
    };

    const modules = useMemo(() => ({
        toolbar: {
            container: [
                [{ header: [1, 2, 3, false] }],
                ["bold", "italic", "underline", "strike"],
                [{ align: [] }],
                [{ list: "ordered" }, { list: "bullet" }],
                ["link", "image"],
                ["clean"],
            ],
            handlers: {
                image: imageHandler,
            },
        },
    }), []);

    const formats = [
        "header",
        "bold", "italic", "underline", "strike",
        "align",
        "list", "bullet",
        "link", "image",
    ];

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    {/* ✅ Breadcrumbs */}
                    <div className="text-sm text-gray-500 mb-1">
                        <span className="text-violet-600 cursor-pointer">Home</span> &gt;{" "}
                        <span className="text-violet-800 font-medium">{question.title}</span>
                    </div>

                    {/* Title */}
                    <DialogTitle className="text-xl font-semibold">{question.title}</DialogTitle>
                </DialogHeader>

                <div
                    className="mt-4 text-sm text-muted-foreground"
                    dangerouslySetInnerHTML={{ __html: question.description }}
                />

                {/* Vote & Answer Buttons */}
                <div className="flex items-center gap-3 mt-6">
                    <Button
                        onClick={() => {
                            const nextVote = !voted;
                            onVote(nextVote);         // 🔁 Notify parent
                            setVoted(nextVote);       // 🔁 Toggle state
                            toast.success(nextVote ? "Voted" : "Vote removed");
                        }}
                        variant={voted ? "default" : "outline"} // ✅ Optional visual feedback
                    >
                        {voted ? "Voted" : "Vote"}
                    </Button>

                    <Button
                        variant="outline"
                        onClick={() => setShowEditor(!showEditor)}
                        disabled={hasAnswered}
                    >
                        {hasAnswered ? "Answered" : showEditor ? "Cancel Answer" : "Answer"}
                    </Button>
                </div>

                {/* Answer Editor */}
                {showEditor && (
                    <div className="mt-4 space-y-2">
                        <ReactQuill
                            theme="snow"
                            value={answerText}
                            onChange={setAnswerText}
                            modules={modules}
                            formats={formats}
                            placeholder="Write your answer..."
                            ref={(el) => {
                                if (el) {
                                    (window as any).quillRef = el.getEditor();
                                }
                            }}
                        />
                        <Button onClick={handleSubmit} className="mt-2">
                            Submit Answer
                        </Button>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
