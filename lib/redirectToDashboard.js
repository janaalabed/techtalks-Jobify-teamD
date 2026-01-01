export function redirectToDashboard(role, router) {
    
    if (!role) {
        router.push("/login");
        return;
    }
   
    switch (role) {
        case "applicant":
            router.push("/jobs-list"); 
            break;
        case "employer":
            router.push("/employers/dashboard"); 
            break;
        default:
            router.push("/login"); 
            break;
    }
}
