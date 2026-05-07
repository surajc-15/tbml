import { SignUp } from '@clerk/nextjs'
import { PublicNavbar } from "@/components/navigation/public-navbar"

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col relative overflow-hidden">
      {/* Subtle Background Elements */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-gradient-to-br from-sky-400/20 to-cyan-300/20 blur-[100px]" />
        <div className="absolute -bottom-[20%] left-[10%] w-[50%] h-[50%] rounded-full bg-gradient-to-tr from-cyan-400/20 to-blue-400/20 blur-[100px]" />
      </div>

      <PublicNavbar />
      <main className="flex-1 flex items-center justify-center pt-24 pb-16 px-4 relative z-10">
        <SignUp 
          appearance={{
            elements: {
              rootBox: "mx-auto shadow-2xl rounded-2xl",
              card: "bg-white/90 backdrop-blur-xl border border-slate-200",
              formButtonPrimary: "bg-sky-600 hover:bg-sky-700 text-sm normal-case",
            }
          }}
        />
      </main>
    </div>
  )
}
