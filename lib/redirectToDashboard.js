export function redirectToDashboard(role, router) {
    // If no role is provided, fallback to login
    if (!role) {
        router.push("/login");
        return;
    }

    // Redirect based on role in the profiles table
    switch (role) {
        case "applicant":
            router.push("/jobs-list"); // Applicant dashboard
            break;
        case "employer":
            router.push("/employers/dashboard"); // Employer dashboard
            break;
        default:
            router.push("/login"); // Fallback for unknown roles
            break;
    }
}
