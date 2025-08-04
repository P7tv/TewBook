import { getCacheStatus, isCacheReady } from "@/lib/rag"

export async function GET() {
  try {
    const status = await getCacheStatus()
    const isReady = await isCacheReady()
    
    return Response.json({
      status,
      isReady,
      timestamp: Date.now()
    })
  } catch (error) {
    console.error("Error getting cache status:", error)
    
    // Return a more detailed error response
    const errorMessage = error instanceof Error ? error.message : String(error)
    
    return Response.json(
      { 
        error: "Failed to get cache status",
        errorDetails: errorMessage,
        status: { loading: 0, ready: 0, error: 1 },
        isReady: false,
        timestamp: Date.now()
      },
      { status: 500 }
    )
  }
} 