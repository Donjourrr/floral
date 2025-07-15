'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { v4 as uuidv4 } from 'uuid'

export default function Comments({ postId }: { postId: string }) {
  const [comments, setComments] = useState<any[]>([])
  const [newComment, setNewComment] = useState('')
  const [userId, setUserId] = useState<string | null>(null)
  const [anonId, setAnonId] = useState<string>('')

  useEffect(() => {
    const fetchUserAndComments = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUserId(user?.id ?? null)

      if (!user) {
        let localAnon = localStorage.getItem('anon_id')
        if (!localAnon) {
          localAnon = uuidv4()
          localStorage.setItem('anon_id', localAnon)
        }
        setAnonId(localAnon)
      }

      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .eq('post_id', postId)
        .order('created_at', { ascending: true })

      if (!error && data) setComments(data)
    }

    fetchUserAndComments()
  }, [postId])

  const handleSubmit = async () => {
    if (!newComment.trim()) return

    const { error } = await supabase.from('comments').insert([
      {
        post_id: postId,
        content: newComment,
        user_id: userId,
        anon_id: !userId ? anonId : null,
        is_anonymous: !userId,
      },
    ])

    if (!error) {
      setNewComment('')
      const { data } = await supabase
        .from('comments')
        .select('*')
        .eq('post_id', postId)
        .order('created_at', { ascending: true })
      setComments(data || [])
    } else {
      alert('댓글 등록 실패: ' + error.message)
    }
  }

  return (
    <div className="mt-10">
      <h3 className="text-lg font-semibold mb-2">댓글</h3>
      <div className="mb-4">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="댓글을 입력하세요"
          className="w-full border p-2 h-24"
        />
        <button
          onClick={handleSubmit}
          className="bg-black text-white px-4 py-2 mt-2"
        >
          댓글 작성
        </button>
      </div>

      {comments.map((c) => (
        <div key={c.id} className="border-t py-2 text-sm">
          <div className="text-gray-600 mb-1">
            {c.is_anonymous
              ? `익명 (${c.anon_id?.slice(0, 6)})`
              : c.user_id?.slice(0, 6)} ·{' '}
            {new Date(c.created_at).toLocaleString('ko-KR', {
              dateStyle: 'short',
              timeStyle: 'short',
            })}
          </div>
          <div>{c.content}</div>
        </div>
      ))}
    </div>
  )
}
