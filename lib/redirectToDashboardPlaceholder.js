// lib/redirectToDashboard.js
export function redirectToDashboard(role, router) {
    if (!role) {
        router.push("/login");
        return;
    }

    if (role === "job_seeker") {
        router.push("/jobs-list");
    } else if (role === "employer") {
        router.push("/dashboard/companyPlaceholder");
    } else {
        router.push("/login");
    }
}
