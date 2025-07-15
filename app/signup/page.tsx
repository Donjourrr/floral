'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default function SignUpPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [checking, setChecking] = useState(false)
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null)

  const checkUsername = async () => {
    setChecking(true)
    const { data } = await supabase
      .from('profiles')
      .select('username')
      .eq('username', username)

    setIsAvailable(data?.length === 0)
    setChecking(false)
  }

  const handleSignUp = async () => {
    if (!isAvailable) {
      alert('사용할 수 없는 닉네임입니다.')
      return
    }

    const { data: signUpData, error: signUpError } =
      await supabase.auth.signUp({
        email,
        password,
      })

    if (signUpError) {
      alert('회원가입 실패: ' + signUpError.message)
      return
    }

    const user = signUpData.user
    if (!user) {
      alert('유저 생성 실패')
      return
    }

    const { error: profileError } = await supabase
      .from('profiles')
      .insert([{ id: user.id, username }])

    if (profileError) {
      alert('프로필 저장 실패: ' + profileError.message)
      return
    }

    alert('가입 성공! 이메일 인증 후 로그인하세요.')
    router.push('/login')
  }

  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-xl font-bold mb-4">회원가입</h1>
      <input
        type="email"
        placeholder="이메일"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border p-2 w-full mb-2"
      />
      <input
        type="password"
        placeholder="비밀번호"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border p-2 w-full mb-2"
      />
      <div className="flex gap-2 mb-2">
        <input
          type="text"
          placeholder="원하는 닉네임"
          value={username}
          onChange={(e) => {
            setUsername(e.target.value)
            setIsAvailable(null)
          }}
          className="border p-2 flex-1"
        />
        <button
          onClick={checkUsername}
          className="bg-gray-800 text-white px-3 py-2"
        >
          중복확인
        </button>
      </div>
      {isAvailable === true && (
        <p className="text-green-600 text-sm">사용 가능한 닉네임입니다.</p>
      )}
      {isAvailable === false && (
        <p className="text-red-600 text-sm">이미 사용 중인 닉네임입니다.</p>
      )}
      <button
        onClick={handleSignUp}
        className="mt-4 bg-black text-white px-4 py-2 w-full"
      >
        회원가입
      </button>
    </div>
  )
}
