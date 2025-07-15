'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function UserStatus() {
  const [userEmail, setUserEmail] = useState<string | null>(null)

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUserEmail(user?.email ?? null)
    }
    getUser()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUserEmail(null)
  }


  return (
   <div className="flex items-center gap-4 text-sm text-gray-700 p-4">
      {userEmail ? (
        <>
          <span>환영합니다, {userEmail}</span>
          <button onClick={handleLogout} className="text-red-500 underline">
            로그아웃
          </button>
        </>
      ) : (
        <span>로그인되지 않음</span>
      )}
    </div>
  )
}
