import { createClient } from '@supabase/supabase-js'
import Link from 'next/link' //새로추가

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
const supabase = createClient(supabaseUrl, supabaseKey)

export const dynamic = 'force-dynamic' // SSR 강제

export default async function PostsPage() {
  const { data: posts, error } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    return <div className="p-4 text-red-500">에러: {error.message}</div>
  }

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">게시글 목록</h1>
      {posts && posts.length > 0 ? (
        posts.map((post) => (
          <div key={post.id} className="border-b py-4">
            <h2 className="text-lg font-semibold">
                <Link href={`/posts/${post.id}`} className="hover:underline text-blue-600">
                    {post.title}
                </Link>
                </h2>
            <p className="text-sm text-gray-600">
              작성자:{" "}
              {post.is_anonymous
                ? `익명 (${post.anon_id.slice(0, 6)})`
                : post.user_id?.slice(0, 6)}
              {"  "}·{" "}
              {new Date(post.created_at).toLocaleString('ko-KR', {
                dateStyle: 'short',
                timeStyle: 'short',
              })}
            </p>
          </div>
        ))
      ) : (
        <p>아직 작성된 글이 없습니다.</p>
      )}
    </div>
  )
}
