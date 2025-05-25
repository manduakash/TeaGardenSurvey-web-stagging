const api_url = process.env.NEXT_PUBLIC_SERVICE_URL;

export async function getDashboardCount(dist, subdiv, blk, gp, tg) {
  try {
    const response = await fetch(`${api_url}dashboardCount`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        dist: dist || 0,
        sub_div: subdiv || 0,
        blk: blk || 0,
        gp: gp || 0,
        tg: tg || 0,
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
