"use client";
import {useUser} from "@clerk/nextjs";
import { useState } from "react";
import { Card, CardContent } from "./card";
import { Textarea } from "./textarea";
import { Button } from "./button";
import { ImageIcon, Loader2Icon, Send, SendIcon } from "lucide-react";
import { createPost } from "@/actions/post.action";
import toast from "react-hot-toast";

function CreatePost() {
    const {user} = useUser();
    const [content, setContent] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [isPosting, setIsPosting] = useState(false);
    const [showImageUpload, setShowImageUpload] = useState(false);

    const flag = "\u{1F3F3}\u{FE0F}\u{200D}\u{1F308}";

    const handleSubmit = async () => {
        if(!content.trim() && !imageUrl) return;
        setIsPosting(true);
        try{
            const result = await createPost(content, imageUrl);
            if (result.success) {
                setContent("");
                setImageUrl("");
                setShowImageUpload(false);
                
                if(result.cameron) {
                    toast.success(`${flag} TRUE ${flag}`);
                } else {
                    toast.success("Post created successfully!");
                }
            }
        }catch(error){
            toast.error("Failed to create post. Please try again.");
        }
        finally{
            setIsPosting(false);
        }
    };

    return (
        <Card className ="mb-6">
            <CardContent>
                <div className="space-y-4">
                    <div className="flex space-x-4">
                        <Textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder=" What's on your mind?"
                            className="min-h-[100px] resize-none border-none focus-visible:ring-0 p-0 text-base"
                            disabled={isPosting}
                        />
                    </div>

                    <div className="flex items-center justify-between border-t pt-4">
                        <div className="flex space-x-2 items-center">
                            <Button
                                type="button"
                                variant="ghost"
                                className="text-muted-foreground hover:text-primary"
                                onClick={() => setShowImageUpload(!showImageUpload)}
                            >
                                <ImageIcon className="mr-2 size-4" />
                            </Button>
                        </div>

                        <Button
                            className="flex items-center bg-[#1f5a17] hover:bg-[#28731D] text-white"
                            onClick={handleSubmit}
                            disabled={(!content.trim() && !imageUrl) || isPosting}
                        >
                            {isPosting ? (
                                <>
                                    <Loader2Icon className="mr-2 size-4 animate-spin" />
                                    Posting...
                                </>
                            ) : (
                                <>
                                    <SendIcon className="mr-2 size-4 text-white" />
                                    <div className="text-white">Post</div>
                                </>

                            )}
                        </Button>
                    </div>

                </div>
            </CardContent>
        </Card>
    )
}

export default CreatePost
