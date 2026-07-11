"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/components/ui/use-toast"

import { getProfileAction, updateProfileAction, deleteAccountAction } from "@/actions/profile"

const ProfileSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
  currentPassword: z.string().optional(),
  newPassword: z.string().optional(),
  confirmNewPassword: z.string().optional(),
}).refine((data) => {
  const wantsChange = Boolean(data.newPassword || data.confirmNewPassword)
  if (!wantsChange) return true
  if ((data.newPassword ?? "").length < 8) return false
  if (!data.currentPassword) return false
  return data.newPassword === data.confirmNewPassword
}, { message: "Provide current password and matching new passwords (min 8)", path: ["confirmNewPassword"] })

type Values = z.infer<typeof ProfileSchema>

export function ProfileForm() {
  const { toast } = useToast()
  const [loading, setLoading] = React.useState(true)
  const [avatarKeyId, setAvatarKeyId] = React.useState<string | null>(null)
  const [emailState, setEmailState] = React.useState<string>("")
  const [avatar, setAvatar] = React.useState<string | null>(null)
  const form = useForm<Values>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: { firstName: "", lastName: "", email: "", newPassword: "", confirmNewPassword: "" },
    mode: "onTouched",
  })

  // We infer user id for avatar storage key from JWT via a tiny fetch to profile (payload.sub)
  React.useEffect(() => {
    let mounted = true
    ;(async () => {
      const res = await getProfileAction()
      if (mounted) {
        if (res.ok) {
          form.reset({
            firstName: res.profile.firstName,
            lastName: res.profile.lastName,
            email: res.profile.email,
            currentPassword: "",
            newPassword: "",
            confirmNewPassword: "",
          })
          setEmailState(res.profile.email)
          const key = avatarKey(res.profile.email)
          setAvatarKeyId(key)
          setAvatar(localStorage.getItem(key))
        } else if ("error" in res) {
          toast({ description: res.error, variant: "error" })
        }
        setLoading(false)
      }
    })()
    return () => { mounted = false }
  }, [form, toast])

  function avatarKey(email: string) { return `disruptor.profile.avatar.${email.toLowerCase()}` }

  function onFileChange(file: File) {
    if (!file) return
    const allowed = ["image/png", "image/jpeg", "image/gif"]
    if (!allowed.includes(file.type)) {
      toast({ description: "Unsupported file type", variant: "error" })
      return
    }
    if (file.size > 2 * 1024 * 1024) {
      toast({ description: "Image must be under 2MB", variant: "error" })
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      const dataUrl = String(reader.result ?? "")
      setAvatar(dataUrl)
      if (avatarKeyId) localStorage.setItem(avatarKeyId, dataUrl)
      window.dispatchEvent(new CustomEvent("profile:avatar", { detail: { src: dataUrl } }))
      toast({ description: "Image updated", variant: "success" })
    }
    reader.readAsDataURL(file)
  }

  async function onSubmit(values: Values) {
    const prevEmail = emailState
    const res = await updateProfileAction({
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      currentPassword: values.currentPassword || undefined,
      newPassword: values.newPassword || undefined,
      confirmNewPassword: values.confirmNewPassword || undefined,
    })
    if (!res.ok && "error" in res) {
      toast({ description: res.error, variant: "error" })
    } else {
      toast({ description: "Profile saved", variant: "success" })
      // migrate avatar key if email changed
      if (prevEmail.toLowerCase() !== values.email.toLowerCase()) {
        const oldKey = avatarKey(prevEmail)
        const newKey = avatarKey(values.email)
        const dataUrl = localStorage.getItem(oldKey)
        if (dataUrl) {
          localStorage.setItem(newKey, dataUrl)
          localStorage.removeItem(oldKey)
          setAvatarKeyId(newKey)
          setAvatar(dataUrl)
          window.dispatchEvent(new CustomEvent("profile:avatar", { detail: { src: dataUrl } }))
        } else {
          setAvatarKeyId(newKey)
          setAvatar(localStorage.getItem(newKey))
          window.dispatchEvent(new CustomEvent("profile:avatar", { detail: { src: localStorage.getItem(newKey) } }))
        }
        setEmailState(values.email)
      }
      form.reset({ ...values, currentPassword: "", newPassword: "", confirmNewPassword: "" })
    }
  }

  async function onRemoveImage() {
    if (avatarKeyId) localStorage.removeItem(avatarKeyId)
    setAvatar(null)
    window.dispatchEvent(new CustomEvent("profile:avatar", { detail: { src: null } }))
    toast({ description: "Image removed", variant: "success" })
  }

  async function onDeleteAccount() {
    const ok = window.confirm("Delete your account? This cannot be undone.")
    if (!ok) return
    const res = await deleteAccountAction()
    if (!res.ok) {
      toast({ description: res.error ?? "Unable to delete account", variant: "error" })
    } else {
      // Redirect handled by middleware on next navigation
      toast({ description: "Account deleted", variant: "success" })
      window.location.href = "/signin"
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold" style={{ fontFamily: "var(--calson-font)" }}>Account Settings</h1>
        <p className="text-muted-foreground mt-1">Update your profile, preferences, and security settings here.</p>
      </div>

      {/* Avatar and image controls */}
      <div className="flex items-start gap-6">
        <Avatar className="h-16 w-16 border">
          {avatar ? <AvatarImage src={avatar} alt="Avatar" /> : null}
          <AvatarFallback><span className="text-xl">👤</span></AvatarFallback>
        </Avatar>
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <label htmlFor="avatarInput">
              <input id="avatarInput" type="file" accept="image/png,image/jpeg,image/gif" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) onFileChange(f) }} />
              <Button asChild variant="secondary">
                <span className="cursor-pointer">Change Image</span>
              </Button>
            </label>
            <Button onClick={onRemoveImage} variant="outline" disabled={!avatar}>
              Remove Image
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">We support PNGs, JPEGs and GIFs under 2MB</p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField name="firstName" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input placeholder="John" className="bg-zinc-100 py-5" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField name="lastName" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input placeholder="Doe" className="bg-zinc-100 py-5" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </div>

          <FormField name="email" control={form.control} render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="doe@gmail.com" className="bg-zinc-100 py-5" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <div className="pt-2">
            <h2 className="text-xl font-semibold">Password</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField name="currentPassword" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>Current Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••••" className="bg-zinc-100 py-5" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField name="newPassword" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••••" className="bg-zinc-100 py-5" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField name="confirmNewPassword" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm New Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••••" className="bg-zinc-100 py-5" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <div />
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="submit" variant="secondary" className="px-8">Submit</Button>
            <Button type="button" variant="outline" onClick={() => form.reset()}>Reset</Button>
            <div className="flex-1" />
            <Button type="button" variant="destructive" onClick={onDeleteAccount}>Delete Account</Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
