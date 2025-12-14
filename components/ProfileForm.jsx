"use client";
import styles from "./ProfileForm.module.css";
 
export default function ProfileForm({ value, onChange, onSave, loading, message, messageType }) {
  const v = value || {};
  const setField = (k, val) => onChange({ ...v, [k]: val });
 
  const msgClass =
    messageType === "success"
      ? `${styles.msg} ${styles.msgSuccess}`
      : messageType === "error"
      ? `${styles.msg} ${styles.msgError}`
      : styles.msg;
 
  const logoOk = !!(v.logo_url || "").trim();
 
  return (
    <div className={styles.wrap}>
      <div className="container-app">
        <div className={styles.card}>
          <div className={styles.header}>
            <h1 className="h1">Company Profile</h1>
            <p className="p" style={{ color: "#6B7280", marginTop: 6 }}>
              Set your company logo using a direct image URL.
            </p>
          </div>
 
          <div className={styles.section}>
            <h2 className="h2">Basic Information</h2>
 
            {/* Logo Preview */}
            <div className={styles.logoRow}>
              <div className={styles.logoBox}>
                {logoOk ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={v.logo_url} alt="Company logo" className={styles.logoImg} />
                ) : (
                  <span className={styles.logoPlaceholder}>LOGO</span>
                )}
              </div>
 
              <div className={styles.logoText}>
                <div className={styles.logoTitle}>Logo Preview</div>
                <div className="small">
                  Paste a direct image link ending with .png / .jpg / .jpeg / .webp
                </div>
              </div>
            </div>
 
            <div className={styles.grid2} style={{ marginTop: 14 }}>
              <Field label="Company Name *" placeholder="Acme Inc." value={v.name || ""} onChange={(e) => setField("name", e.target.value)} />
              <Field label="Industry *" placeholder="Tech, Healthcare..." value={v.industry || ""} onChange={(e) => setField("industry", e.target.value)} />
            </div>
 
            <div className={styles.field}>
              <label className={styles.label}>Logo URL</label>
              <div className={styles.inputWrap}>
                <input
                  className={styles.input}
                  placeholder="https://example.com/logo.png"
                  value={v.logo_url || ""}
                  onChange={(e) => setField("logo_url", e.target.value)}
                />
              </div>
              <div className={styles.hint}>
                This saves a URL in the database (no file upload).
              </div>
            </div>
          </div>
 
          <div className={styles.section}>
            <h2 className="h2">Company Details</h2>
 
            <div className={styles.field}>
              <label className={styles.label}>About Company *</label>
              <textarea
                className={styles.textarea}
                placeholder="Describe your company..."
                value={v.description || ""}
                onChange={(e) => setField("description", e.target.value)}
              />
            </div>
 
            <div className={styles.grid2}>
              <Field label="Website" placeholder="https://acme.com" value={v.website || ""} onChange={(e) => setField("website", e.target.value)} />
              <Field label="Location *" placeholder="Beirut, Lebanon" value={v.location || ""} onChange={(e) => setField("location", e.target.value)} />
            </div>
          </div>
 
          <div className={styles.footer}>
            <button className={styles.btnPrimary} onClick={onSave} disabled={loading} type="button">
              {loading ? "Saving..." : "Save Profile"}
            </button>
            {message ? <div className={msgClass}>{message}</div> : null}
          </div>
        </div>
 
        <footer className="footer">© {new Date().getFullYear()} Jobify. All rights reserved.</footer>
      </div>
    </div>
  );
}
 
function Field({ label, placeholder, value, onChange }) {
  return (
    <div className={styles.field}>
      <label className={styles.label}>{label}</label>
      <div className={styles.inputWrap}>
        <input className={styles.input} placeholder={placeholder} value={value} onChange={onChange} />
      </div>
    </div>
  );
}
 