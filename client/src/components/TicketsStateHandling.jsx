// React imports
import React, { useState, useEffect, useRef } from 'react';

// Add this near the beginning of your Tickets component
// Before any JSX returns

// Check for loading and error states
if (loading) {
  return <LoadingState message="Loading ticket information..." />;
}

if (error) {
  return <ErrorState error={error} onRetry={handleRetry} showRetry={showRetryButton} />;
}
