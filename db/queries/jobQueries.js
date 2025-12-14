import pool from '../connection.js';

export async function getAllJobs(filters = {}) {
    const { type, skills, minSalary, maxSalary, location } = filters;

    let query = `
        SELECT 
            j.*, 
            e.company_name, 
            e.logo_url, 
            e.location as company_location
        FROM jobs j
        JOIN employers e ON j.employer_id = e.id
        WHERE 1=1
    `;

    const params = [];
    let paramIndex = 1;

    if (type) {
        query += ` AND j.type = $${paramIndex}`;
        params.push(type);
        paramIndex++;
    }

    if (minSalary) {
        query += ` AND j.salary_min >= $${paramIndex}`;
        params.push(minSalary);
        paramIndex++;
    }

    if (maxSalary) {
        query += ` AND j.salary_max <= $${paramIndex}`;
        params.push(maxSalary);
        paramIndex++;
    }

    if (location) {
        query += ` AND (j.location ILIKE $${paramIndex} OR e.location ILIKE $${paramIndex})`;
        params.push(`%${location}%`);
        paramIndex++;
    }

    // Note: This assumes skills are stored as an array or string in the DB. 
    // Adjusting based on common patterns since schema wasn't fully visible, 
    // but assuming text array or similar for now based on mock data usage.
    // If skills is a simple text column, ILIKE would be used.
    // Given the previous mock data used `includes`, let's assume it might be an array in DB or we need to check containment.
    // For MVP safety with potential text column:
    if (skills && skills.length > 0) {
        // This is a simplification. Ideally we'd check if *all* skills are present.
        // For MVP, let's check if the skills column contains any of the selected skills if it's a string,
        // or use array operators if it's an array.
        // Let's assume it's a text column for now as per common simple setups, or array.
        // We'll try a flexible approach: checking if the skills column contains the text.
        // But wait, the mock data showed `job.skills` as an array.
        // Let's assume the DB has a `skills` column.
        // If it's a text array: `AND j.skills @> $${paramIndex}`
        // If it's JSONB: `AND j.skills @> $${paramIndex}`
        // Let's try to be safe and assume we might need to filter by one skill at a time or use a flexible search.
        // For this MVP, let's iterate and add a condition for each skill to ensure ALL are present (AND logic).

        const skillList = Array.isArray(skills) ? skills : skills.split(',');
        skillList.forEach(skill => {
            query += ` AND $${paramIndex} = ANY(j.skills)`; // Assuming Postgres text[]
            params.push(skill);
            paramIndex++;
        });
    }

    if (filters.search) {
        query += ` AND (
            j.title ILIKE $${paramIndex} OR 
            j.description ILIKE $${paramIndex} OR 
            e.company_name ILIKE $${paramIndex} OR
            array_to_string(j.skills, ' ') ILIKE $${paramIndex}
        )`;
        params.push(`%${filters.search}%`);
        paramIndex++;
    }

    query += ` ORDER BY j.created_at DESC`;

    const result = await pool.query(query, params);
    return result.rows;
}
