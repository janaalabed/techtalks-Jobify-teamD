import pool from '../connection.js';

export async function getAllJobs() {
    const query = `
        SELECT 
            j.*, 
            e.company_name, 
            e.logo_url, 
            e.location as company_location
        FROM jobs j
        JOIN employers e ON j.employer_id = e.id
        ORDER BY j.created_at DESC
    `;
    const result = await pool.query(query);
    return result.rows;
}
