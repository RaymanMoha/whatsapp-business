"use client"

import * as React from "react"
import { KeyRound, Mail, ShieldCheck, UserRound } from "lucide-react"

import { getProfileAction } from "@/actions/profile"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"

function avatarKey(email: string) {
  return `commerce.profile.avatar.${email.toLowerCase()}`
}

export function ProfileForm() {
  const { toast } = useToast()
  const [profile, setProfile] = React.useState<{ firstName: string; lastName: string; email: string } | null>(null)
  const [avatar, setAvatar] = React.useState<string | null>(null)

  React.useEffect(() => {
    let active = true
    getProfileAction().then((result) => {
      if (!active) return
      if (!result.ok) {
        toast({ description: "error" in result ? result.error : "Unable to load the administrator profile.", variant: "error" })
        return
      }
      setProfile(result.profile)
      setAvatar(localStorage.getItem(avatarKey(result.profile.email)))
    })
    return () => { active = false }
  }, [toast])

  function onFileChange(file: File | undefined) {
    if (!file || !profile) return
    if (!["image/png", "image/jpeg", "image/webp"].includes(file.type) || file.size > 2 * 1024 * 1024) {
      toast({ description: "Choose a PNG, JPEG, or WebP image under 2 MB.", variant: "error" })
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      const source = String(reader.result || "")
      localStorage.setItem(avatarKey(profile.email), source)
      setAvatar(source)
      window.dispatchEvent(new CustomEvent("profile:avatar", { detail: { src: source } }))
    }
    reader.readAsDataURL(file)
  }

  const name = profile ? `${profile.firstName} ${profile.lastName}`.trim() : "Loading account…"
  const initials = profile ? `${profile.firstName[0] || ""}${profile.lastName[0] || ""}`.toUpperCase() || "AD" : "AD"

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <header>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">Administrator account</p>
        <h1 className="mt-2 text-4xl tracking-tight" style={{ fontFamily: "var(--calson-font)" }}>Profile &amp; access</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-600">Your administrator identity is read from protected server settings. It cannot be changed accidentally from the browser.</p>
      </header>

      <section className="overflow-hidden rounded-[28px] border border-black/10 bg-white shadow-[0_20px_60px_rgba(0,0,0,.06)]">
        <div className="flex flex-col gap-6 bg-[#073f36] p-7 text-white md:flex-row md:items-center">
          <Avatar className="size-20 border-2 border-white/30">
            {avatar ? <AvatarImage src={avatar} alt="Administrator" /> : null}
            <AvatarFallback className="bg-emerald-100 text-xl font-bold text-emerald-900">{initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h2 className="text-2xl font-semibold">{name}</h2>
            <p className="mt-1 text-sm text-white/65">{profile?.email || "Verifying session…"}</p>
          </div>
          <label htmlFor="profile-image">
            <input id="profile-image" className="hidden" type="file" accept="image/png,image/jpeg,image/webp" onChange={(event) => onFileChange(event.target.files?.[0])} />
            <Button asChild variant="secondary" className="rounded-full"><span className="cursor-pointer">Change photo</span></Button>
          </label>
        </div>

        <div className="grid gap-px bg-black/10 md:grid-cols-3">
          {[
            [UserRound, "Account role", "Commerce administrator"],
            [Mail, "Sign-in email", profile?.email || "Loading…"],
            [ShieldCheck, "Session security", "Protected, 12-hour session"],
          ].map(([Icon, label, value]) => (
            <div key={String(label)} className="bg-white p-6">
              <Icon className="size-5 text-emerald-700" />
              <p className="mt-4 text-xs font-bold uppercase tracking-[0.14em] text-zinc-500">{String(label)}</p>
              <p className="mt-1 text-sm font-semibold text-zinc-900">{String(value)}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="flex gap-4 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-amber-950">
        <KeyRound className="mt-0.5 size-5 shrink-0" />
        <div>
          <h2 className="font-semibold">Credential changes are deployment-managed</h2>
          <p className="mt-1 text-sm leading-6 text-amber-900/75">Change the administrator email or password hash in the server environment, then restart the dashboard. This prevents a compromised browser session from rewriting its own credentials.</p>
        </div>
      </section>
    </div>
  )
}
