// lib/redirectAfterRegister.js
export function redirectAfterRegister(role, router) {
    switch (role) {
        case "applicant":
            router.push("/applicant/profile"); // Job Seeker setup page
            break;
        case "employer":
            router.push("/employers/create"); // Employer setup page
            break;
        default:
            router.push("/login"); // fallback
            break;
    }
}
