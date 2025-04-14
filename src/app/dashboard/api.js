const api_url = process.env.NEXT_PUBLIC_SERVICE_URL;

export async function getDashboardCount(subdiv, blk, gp, village ) {
  try {
    const response = await fetch(`${api_url}dashboardCount`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sub_div: subdiv || 1,
        blk: blk || 1,
        gp: gp || 0,
        village: village || 0,
      }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to fetch dashboard count:", error);
    throw error;
  }
}
