'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { v4 as uuidv4 } from 'uuid'

export default function WritePage() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [userId, setUserId] = useState<string | null>(null)
  const [anonId, setAnonId] = useState<string>('')

  // 1. 로그인된 유저 있는지 확인
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUserId(user.id)
      } else {
        // 2. 비로그인 사용자는 브라우저 localStorage에 고유 ID 저장
        let storedAnonId = localStorage.getItem('anon_id')
        if (!storedAnonId) {
          storedAnonId = uuidv4()
          localStorage.setItem('anon_id', storedAnonId)
        }
        setAnonId(storedAnonId)
      }
    }
    checkAuth()
  }, [])

  const handleSubmit = async () => {
    if (!title || !content) {
      alert('제목과 내용을 입력해주세요.')
      return
    }

    const { error } = await supabase.from('posts').insert([
      {
        title,
        content,
        user_id: userId,
        anon_id: !userId ? anonId : null,
        is_anonymous: !userId,
      },
    ])

    if (error) {
      alert('글 저장 실패: ' + error.message)
    } else {
      alert('글이 작성되었습니다!')
      router.push('/posts')
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">글 작성</h1>
      <input
        type="text"
        placeholder="제목"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="border p-2 w-full mb-4"
      />
      <textarea
        placeholder="내용"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="border p-2 w-full h-60 mb-4"
      />
      <button onClick={handleSubmit} className="bg-black text-white px-4 py-2">
        작성 완료
      </button>
    </div>
  )
}
