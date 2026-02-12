"use server";
import { auth } from "@clerk/nextjs/server";
import { getDBUserID } from "./user.action";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createPost(content: string, image?: string) {
    try {
        const userId = await getDBUserID();
        const post = await prisma.post.create({
            data: {
                content,
                image,
                authorId: userId 
            }
        });
        revalidatePath("/"); //purge cache for home page
        if(content.toLowerCase().replace(/\s+/g, "").includes("cameronlikesboys")) {
           return {success: true, post, cameron: true};
        }
        return {success: true, post, cameron: false};
    } catch (error) {
        console.error("Error creating post:", error);
        return {success: false, error: "Error creating post"};
    }
}

export async function getPosts() {
    try
    {
        const posts = prisma.post.findMany({
            orderBy: {
                createdAt:"desc"
            },
            include: {
                author:{
                    select:{
                        name:true,
                        image:true,
                        username:true
                    }
                },
                comments: {
                    include:{
                        author:{
                            select:{
                                name:true,
                                image:true,
                                username:true
                            }
                        }

                    },
                    orderBy:{
                        createdAt:"desc"
                    }
                },
                likes:{
                    select:{
                        userId:true
                    }
                },
                _count:{
                    select:{
                        likes:true,
                        comments:true
                    }
                }
            }
        })

        return posts
    }

    catch(error)
    {
        throw new Error("Failed to get posts");

    }
}

export async function toggleLike(postId:string) {
    try{
        const userId = await getDBUserID();
        if(!userId) return
        const existingLike = await prisma.like.findUnique({
            where: {
                userId_postId:{
                    userId,
                    postId,
                },
            },
        });

        const post = await prisma.post.findUnique({
            where:{id: postId},
            select:{authorId: true}
        });

        if(!post) throw new Error("Post nor found")

        if(existingLike)
        {
            await prisma.like.delete({
                where:{
                    userId_postId:{
                        userId,
                        postId,
                    }
                }
            })
        }
        else
        {
            await prisma.$transaction([
                prisma.like.create({
                    data:{
                        userId,
                        postId,        
                    },   
                }),
                ...(post.authorId !== userId
                    ? [
                        prisma.notification.create({
                            data:{
                                type:"LIKE",
                                userId: post.authorId,
                                creatorId: userId,
                                postId,
                            },
                        }),
                    ]
                : []),
            ]);
        }

        revalidatePath("/")
        return {success:true }
    }
    catch (error) {
        return {success:false, error:"failed to toggle like" }
    }
}

export async function createComment(postId:string, content:string) {
    try{
        const userId = await getDBUserID();
        if(!userId) return
        if(!content) throw new Error("Comment cannot be empty")

        const post = await prisma.post.findUnique({
            where:{id: postId},
            select:{authorId: true}
        });

        if(!post) throw new Error("Post nor found")

        const [comment] = await prisma.$transaction(async (tx) => {
            const newComment = await tx.comment.create({
                data:{
                    content,
                    postId,
                    authorId: userId,
                },
            });
            if(post.authorId !== userId)
            {
                await tx.notification.create({
                    data:{
                        type:"COMMENT",
                        userId: post.authorId,
                        creatorId: userId,
                        postId,
                        commentId: newComment.id,
                    },
                });
            }
            return [newComment]

        });

        revalidatePath("/")
        return {success:true, comment }
    }
    catch (error) {
        return {success:false, error:"failed to create comment" }
    }
}

export async function deletePost(postId:string) {
    try{
        const userId = await getDBUserID();

        const post = await prisma.post.findUnique({
            where:{id: postId},
            select:{authorId: true}
        });
        if(!post) throw new Error("Post nor found")
        if(post.authorId !== userId) throw new Error("Unauthorized")

        await prisma.post.delete({
            where:{id: postId},
        });

        revalidatePath("/")
        return {success:true }
    }
    catch (error) {
        return {success:false, error:"failed to delete post" }
    }
}