"use client";
 
import { useEffect, useState } from "react";
import ProfileForm from "@/components/ProfileForm";
 
export default function Page() {
  const [form, setForm] = useState({
    name: "",
    industry: "",
    logo_url: "",
    description: "",
    website: "",
    location: "",
  });
 
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // "success" | "error" | ""
 
  useEffect(() => {
    (async () => {
      setMessage("");
      setMessageType("");
 
      try {
        const res = await fetch("/api/company/profile");
        const data = await res.json();
 
        if (!res.ok) {
          setMessage(data?.error || "Failed to load profile");
          setMessageType("error");
          return;
        }
 
        if (data?.company) {
          setForm((prev) => ({ ...prev, ...data.company }));
        }
      } catch {
        setMessage("Failed to load profile");
        setMessageType("error");
      }
    })();
  }, []);
 
  async function save() {
    setMessage("");
    setMessageType("");
 
    if (!form.name.trim()) {
      setMessage("Company name is required");
      setMessageType("error");
      return;
    }
 
    setSaving(true);
    try {
      const res = await fetch("/api/company/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
 
      const data = await res.json();
 
      if (!res.ok) {
        setMessage(data?.error || "Failed to save profile");
        setMessageType("error");
        return;
      }
 
      // keep latest returned values if backend changed anything
      if (data?.company) setForm((p) => ({ ...p, ...data.company }));
 
      setMessage("Saved ✅");
      setMessageType("success");
    } catch {
      setMessage("Network error");
      setMessageType("error");
    } finally {
      setSaving(false);
    }
  }
 
  return (
    <ProfileForm
      value={form}
      onChange={setForm}
      onSave={save}
      loading={saving}
      message={message}
      messageType={messageType}
    />
  );
}
 