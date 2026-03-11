// src/lib/country-actions.js
"use server";
import pool from "./db";
import { withAuth, withAdmin } from "./action-utils";
import { revalidatePath } from "next/cache";

// 1. Fetch all countries (Public/User access)
export async function getCountries() {
  try {
    const result = await pool.query(
      "SELECT * FROM countries ORDER BY country_name ASC",
    );
    return { data: result.rows };
  } catch (err) {
    return { error: "Failed to fetch countries." };
  }
}

// 2. Create a new country (Admin only)
export async function createCountry(formData) {
  return withAdmin(async (user) => {
    const code = formData.get("country_code")?.toUpperCase();
    const name = formData.get("country_name");
    const capital = formData.get("capital_city");
    const lat = formData.get("latitude") || null;
    const lng = formData.get("longitude") || null;
    const modifier = user.name || user.email;

    if (!code || !name) return { error: "Code and Name are mandatory." };

    try {
      await pool.query(
        `INSERT INTO countries (country_code, country_name, capital_city, latitude, longitude, last_modified_by)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [code, name, capital, lat, lng, modifier],
      );
      revalidatePath("/countries");
      return { success: true };
    } catch (err) {
      if (err.code === "23505")
        return { error: "Country code already exists." };
      return { error: "Database error." };
    }
  });
}

export async function getCountryById(id) {
  try {
    const result = await pool.query("SELECT * FROM countries WHERE id = $1", [
      id,
    ]);
    return result.rows[0];
  } catch (err) {
    return null;
  }
}

export async function updateCountry(formData) {
  return withAdmin(async (user) => {
    const id = formData.get("id");
    const name = formData.get("country_name");
    const capital = formData.get("capital_city");
    const lat = formData.get("latitude") || null;
    const lng = formData.get("longitude") || null;
    const modifier = user.name || user.email;

    try {
      await pool.query(
        `UPDATE countries 
         SET country_name = $1, capital_city = $2, latitude = $3, longitude = $4, 
             last_modified_by = $5, updated_at = NOW() 
         WHERE id = $6`,
        [name, capital, lat, lng, modifier, id],
      );
      revalidatePath("/countries");
      return { success: true };
    } catch (err) {
      return { error: "Failed to update country data." };
    }
  });
}

// src/lib/country-actions.js
export async function syncCountryData(countryCode) {
  return withAdmin(async (user) => {
    try {
      // 1. Fetch from Public API
      const response = await fetch(
        `https://restcountries.com/v3.1/alpha/${countryCode}`,
      );

      if (!response.ok) {
        return {
          error: `Country code ${countryCode} not found in Public API.`,
        };
      }

      const [data] = await response.json();

      // 2. Extract and Sanitize Data
      const code = countryCode.toUpperCase();
      const name = data.name.common;
      const capital = data.capital?.[0] || "Unknown";
      const lat = data.latlng?.[0] || 0;
      const lng = data.latlng?.[1] || 0;
      const modifier = user.name || user.email;

      // 3. PostgreSQL UPSERT (Merge) Logic
      await pool.query(
        `INSERT INTO countries (country_code, country_name, capital_city, latitude, longitude, last_modified_by)
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT (country_code) 
         DO UPDATE SET 
            country_name = EXCLUDED.country_name,
            capital_city = EXCLUDED.capital_city,
            latitude = EXCLUDED.latitude,
            longitude = EXCLUDED.longitude,
            last_modified_by = EXCLUDED.last_modified_by,
            updated_at = NOW()`,
        [code, name, capital, lat, lng, modifier],
      );

      revalidatePath("/countries");
      return { success: true, message: `Successfully synced ${name}` };
    } catch (err) {
      console.error("Sync Error:", err);
      return { error: "Failed to connect to Public API." };
    }
  });
}
