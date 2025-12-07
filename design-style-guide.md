1. Color Palette

# Primary Colors

#0A66C2 – Main blue (buttons, highlights)
#1A1A1A – Main text color
#F5F5F5 – Light background

# Secondary Colors

#FFFFFF – Cards, containers
#E5E7EB – Borders
#10B981 – Success (accepted application)
#EF4444 – Error/Reject

---

2. Typography Standards

# Fonts

# Primary Font:

Inter / Roboto / System UI

# Font Sizes

Title (H1): 28-32px
Section Title (H2): 22-26px
Sub-title (H3): 18-20px
Body Text: 14-16px
Small Text: 12px

---

3. UI Component Standards

# Buttons

Primary button: Blue (#0A66C2), white text
Secondary button: White background, dark border
Full width on mobile
Inputs
Full-width
Rounded corners (6px)
Border: #E5E7EB
On focus: border blue + light shadow
Cards
White background
Shadow: soft
Padding: 16–24px
Rounded corners: 8–12px

---

4. Page Layout Standards

# Global Layout Structure

Header: Logo + navigation (Login/Register or dashboard links)
Main Content Area: Centered, max width 1200px
Footer: Simple text (copyright)

# Spacing Rules

Section spacing: 40–60px
Component spacing: 15–25px

---

5. Authentication Pages

# Login & Register

Simple layout, centered form
Use the same form styling across all auth pages
Role selection (Applicant or Employer) must be a radio group or toggle button style

---

6. Applicant UI Standards

# applicant Profile Page

Two-column layout
Profile picture on the left
Info sections grouped: Skills, Education, Experience

# Job Browsing

Job cards with:
Title
Company name & log
Location
Type (chip/badge)

# Filters & Search

Left sidebar (desktop)
Top collapsible panel (mobile)
Filter chips for selected filters

---

7. Employer UI Standards

# Company Profile

Similar layout to applicant profile
Logo must be square

# Post a Job Form

Multi-section form (Job Info, Requirements, Salary, Type)
Use consistent field labels and spacing

# Job Management

Table view for job listings
Actions: Edit, Delete, Mark Filled

---

8. Admin Dashboard Standards

# Navigation

Sidebar menu
Sections: Users, Jobs, Reports

# Tables

Use consistent table design across all admin pages:
White table cards
Grey border
Hover effects
Actions shown as icons

---

9. Media & File Upload Standards

# Images

Compress before upload
Max size: 2MB

# CV Upload

File type: PDF only
Max size: 5MB

---

10. Security Rules

Always hash passwords (bcrypt)
Sanitize input
Token-based authentication
Never commit .env files
