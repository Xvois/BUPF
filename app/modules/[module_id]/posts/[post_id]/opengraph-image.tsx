

import {ImageResponse} from 'next/og'

export const runtime = 'edge'

export const alt = 'BUPF Post Image'
export const size = {
  width: 800,
  height: 400,
}

export const contentType = 'image/png'

export async function GET(
  request: Request,
  { params }: { params: { post_id: string, module_id: string } }
) {

    const { post_id, module_id } = params
    const url = new URL(request.url)
    const {data: post, postError} = await fetch(`${url.origin}/api/post/` + post_id).then(res => res.json())

    if(postError) {
        return;
    }

    return new ImageResponse(
        (
            <div style={{fontFamily: "Inter"}} tw="flex flex-col w-full h-full justify-start bg-white p-6">
                <div tw="text-xl font-semibold">
                    BUPF
                </div>
                <div tw="flex text-3xl font-bold items-center mb-2 border-b border-black">
                    {/* @ts-ignore */}
                    <svg tw="mr-1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                         fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                         stroke-linejoin="round"
                         className="lucide lucide-component">
                        <path d="M5.5 8.5 9 12l-3.5 3.5L2 12l3.5-3.5Z"/>
                        <path d="m12 2 3.5 3.5L12 9 8.5 5.5 12 2Z"/>
                        <path d="M18.5 8.5 22 12l-3.5 3.5L15 12l3.5-3.5Z"/>
                        <path d="m12 15 3.5 3.5L12 22l-3.5-3.5L12 15Z"/>
                    </svg>
                    {module_id}
                </div>
                <div tw="text-4xl font-black mb-2">
                    {post.heading}
                </div>
                <div tw="mb-2 h-14" style={{overflow: "hidden"}}>
                    {post.content.length > 260 ? `${post.content.substring(0, 260)}...` : post.content}
                </div>
                <div>
                    By Sonny Parker
                </div>
            </div>
        ),
        {
            width: 800,
            height: 400,
        }
    )
}