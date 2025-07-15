import { createClient } from '@supabase/supabase-js'
import { notFound } from 'next/navigation'
import Comments from '@/components/Comments'


const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
)

type Props = {
  params: { id: string }
}

export default async function PostDetailPage({ params }: Props) {
  const { data: post, error } = await supabase
    .from('posts')
    .select('*')
    .eq('id', params.id)
    .single()

  if (error || !post) {
    return notFound()
  }

  return (
    <div className="max-w-2xl mx-auto p-8">
        <h1 className="text-2xl font-bold mb-4">{post.title}</h1>
        <div className="text-sm text-gray-600 mb-2">
          작성자:{' '}
          {post.is_anonymous
            ? `익명 (${post.anon_id?.slice(0, 6)})`
            // profiles.username 이 있으면 출력, 없으면 user_id 일부 출력
            : post.profiles?.username ?? post.user_id?.slice(0, 6)}  {/* <-- 여기 바꿈 */}
          <span className="ml-2">
            {new Date(post.created_at).toLocaleString('ko-KR', {
              dateStyle: 'short',
              timeStyle: 'short',
            })}
          </span>
        </div>
        <p className="whitespace-pre-wrap">{post.content}</p>
        <Comments postId={params.id} />
      </div>
    )
}