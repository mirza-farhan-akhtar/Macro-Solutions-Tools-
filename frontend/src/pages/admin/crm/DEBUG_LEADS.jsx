import React, { useEffect, useState } from 'react';
import { crmAPI } from '../../../services/crmAPI';

/**
 * Debug component - Add this to Leads.jsx temporarily to diagnose loading issues
 * Usage: Add <DebugLeads /> before </main> in Leads.jsx render
 */
export function DebugLeads() {
  const [debugInfo, setDebugInfo] = useState(null);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const testAPI = async () => {
      try {
        console.log('🔍 DEBUG: Testing CRM Leads API...');
        const response = await crmAPI.getCRMLeads({ per_page: 100 });
        
        console.log('✅ API Response:', response);
        
        setDebugInfo({
          status: 'SUCCESS',
          statusCode: response.status,
          timestamp: new Date().toISOString(),
          headers: response.headers,
          responseData: {
            success: response.data?.success,
            dataType: typeof response.data?.data,
            dataLength: response.data?.data?.length || 0,
            dataItems: response.data?.data?.slice(0, 3),
            pagination: response.data?.pagination,
          },
          rawResponse: JSON.stringify(response.data, null, 2),
        });
      } catch (error) {
        console.error('❌ API Error:', error);
        setDebugInfo({
          status: 'ERROR',
          message: error.message,
          statusCode: error.response?.status,
          responseData: error.response?.data,
          headers: error.response?.headers,
          timestamp: new Date().toISOString(),
        });
      }
    };

    testAPI();
  }, []);

  if (!debugInfo) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      backgroundColor: debugInfo.status === 'SUCCESS' ? '#10b981' : '#ef4444',
      color: 'white',
      padding: '16px',
      borderRadius: '8px',
      maxWidth: '400px',
      maxHeight: '300px',
      overflow: 'auto',
      zIndex: 9999,
      fontSize: '12px',
      fontFamily: 'monospace',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    }}>
      <div style={{ marginBottom: '8px', fontWeight: 'bold' }}>
        🔧 API Debug Info ({debugInfo.status})
        <button
          onClick={() => setExpanded(!expanded)}
          style={{
            marginLeft: '8px',
            padding: '2px 8px',
            backgroundColor: 'rgba(0,0,0,0.3)',
            border: 'none',
            color: 'white',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          {expanded ? '−' : '+'}
        </button>
      </div>
      
      {expanded && (
        <div style={{ marginTop: '12px', borderTop: '1px solid rgba(255,255,255,0.3)', paddingTop: '12px' }}>
          <div>Status: {debugInfo.statusCode || 'N/A'}</div>
          <div>Time: {debugInfo.timestamp}</div>
          
          {debugInfo.status === 'SUCCESS' && (
            <>
              <div style={{ marginTop: '8px', borderTop: '1px solid rgba(255,255,255,0.3)', paddingTop: '8px' }}>
                <strong>Response Data:</strong>
                <div>✓ Success: {debugInfo.responseData.success ? 'true' : 'false'}</div>
                <div>✓ Data Type: {debugInfo.responseData.dataType}</div>
                <div>✓ Data Length: {debugInfo.responseData.dataLength}</div>
                <div>✓ Pagination: {debugInfo.responseData.pagination ? 'YES' : 'NO'}</div>
                {debugInfo.responseData.pagination && (
                  <div style={{ marginLeft: '16px' }}>
                    - Total: {debugInfo.responseData.pagination.total}
                    - Per Page: {debugInfo.responseData.pagination.per_page}
                    - Current: {debugInfo.responseData.pagination.current_page}
                  </div>
                )}
              </div>
              {debugInfo.responseData.dataItems && debugInfo.responseData.dataItems.length > 0 && (
                <div style={{ marginTop: '8px', borderTop: '1px solid rgba(255,255,255,0.3)', paddingTop: '8px' }}>
                  <strong>First Item:</strong>
                  <div>{JSON.stringify(debugInfo.responseData.dataItems[0], null, 2)}</div>
                </div>
              )}
            </>
          )}
          
          {debugInfo.status === 'ERROR' && (
            <>
              <div>Error: {debugInfo.message}</div>
              {debugInfo.responseData && (
                <div style={{ marginTop: '8px' }}>
                  Response: {JSON.stringify(debugInfo.responseData, null, 2)}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default DebugLeads;
