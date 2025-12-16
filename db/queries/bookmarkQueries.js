import { query } from "../connection";

export async function toggleBookmark(userId, jobId) {
    // Check if exists
    const existing = await query(
        `SELECT id FROM bookmarks WHERE user_id = $1 AND job_id = $2`,
        [userId, jobId]
    );

    if (existing.length > 0) {
        // Remove
        await query(
            `DELETE FROM bookmarks WHERE user_id = $1 AND job_id = $2`,
            [userId, jobId]
        );
        return { bookmarked: false };
    } else {
        // Add
        await query(
            `INSERT INTO bookmarks (user_id, job_id) VALUES ($1, $2)`,
            [userId, jobId]
        );
        return { bookmarked: true };
    }
}

export async function getBookmarks(userId) {
    return await query(
        `SELECT b.job_id, j.*, c.name as company_name, c.logo_url, c.location as company_location
     FROM bookmarks b
     JOIN jobs j ON b.job_id = j.id
     JOIN companies c ON j.company_id = c.user_id
     WHERE b.user_id = $1
     ORDER BY b.created_at DESC`,
        [userId]
    );
}

export async function getBookmarkStatus(userId, jobId) {
    const rows = await query(
        `SELECT id FROM bookmarks WHERE user_id = $1 AND job_id = $2`,
        [userId, jobId]
    );
    return rows.length > 0;
}
