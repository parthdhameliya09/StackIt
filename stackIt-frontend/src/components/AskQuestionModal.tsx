import React, { useState, useMemo } from "react";
import ReactQuill from "react-quill";
import DOMPurify from "dompurify";
import "react-quill/dist/quill.snow.css";

type Props = {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (question: {
        title: string;
        description: string;
        tags: string[];
    }) => void;
};

export default function AskQuestionModal({ isOpen, onClose, onSubmit }: Props) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [tags, setTags] = useState("");

    const uploadImageToCloudinary = async (file: File) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "your_upload_preset"); // replace
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
                const quill = (window as any).askQuillRef;
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

    if (!isOpen) return null;

    const handleSubmit = () => {
        if (!title.trim() || !description.trim()) return;

        const sanitizedDescription = DOMPurify.sanitize(description);

        onSubmit({
            title: title.trim(),
            description: sanitizedDescription,
            tags: tags
                .split(",")
                .map((tag) => tag.trim())
                .filter(Boolean),
        });

        setTitle("");
        setDescription("");
        setTags("");
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center">
            <div className="bg-gray-100 p-6 rounded-xl border border-gray-300 w-full max-w-2xl text-black relative shadow-xl">
                <button
                    onClick={onClose}
                    className="absolute top-2 right-4 text-black text-xl"
                >
                    ×
                </button>
                <div className="mb-2 text-sm text-gray-600">
                    <span className="text-violet-800 cursor-pointer">Home</span> &gt;{" "}
                    <span className="text-violet-800 font-medium">Ask Question</span>
                </div>
                <h2 className="text-xl font-semibold mb-4">Ask a Question</h2>

                <div className="mb-4">
                    <label className="block mb-1 font-medium">Title</label>
                    <input
                        className="w-full p-2 rounded bg-white border border-gray-300"
                        placeholder="Enter your question title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>

                <div className="mb-4">
                    <label className="block mb-1 font-medium">Description</label>
                    <ReactQuill
                        value={description}
                        onChange={setDescription}
                        theme="snow"
                        modules={modules}
                        formats={formats}
                        className="bg-white text-black rounded"
                        placeholder="Write your question in detail..."
                        ref={(el) => {
                            if (el) {
                                (window as any).askQuillRef = el.getEditor();
                            }
                        }}
                    />
                </div>

                <div className="mb-4">
                    <label className="block mb-1 font-medium">Tags (comma separated)</label>
                    <input
                        className="w-full p-2 rounded bg-white border border-gray-300"
                        placeholder="e.g. react, typescript, jwt"
                        value={tags}
                        onChange={(e) => setTags(e.target.value)}
                    />
                </div>

                <button
                    onClick={handleSubmit}
                    className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
                >
                    Submit
                </button>
            </div>
        </div>
    );
}
