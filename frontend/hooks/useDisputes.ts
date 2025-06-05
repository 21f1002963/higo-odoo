import { useState, useCallback, useEffect } from 'react';
import { apiClient } from '../lib/api-client';

interface Dispute {
  id: string;
  productId: string;
  productTitle: string;
  reason: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  createdAt: string;
  updatedAt: string;
  evidence?: string[];
  resolution?: string;
}

interface Complaint {
  id: string;
  disputeId: string;
  reportedBy: {
    id: string;
    username: string;
  };
  reportedUser: {
    id: string;
    username: string;
  };
  reason: string;
  description: string;
  status: 'pending' | 'investigating' | 'resolved' | 'dismissed';
  createdAt: string;
  updatedAt: string;
  evidence?: string[];
  resolution?: string;
}

export function useDisputes() {
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchDisputes = useCallback(async () => {
    try {
      setLoading(true);
      const userDisputes = await apiClient.getDisputes();
      setDisputes(userDisputes);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch disputes'));
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchComplaints = useCallback(async () => {
    try {
      setLoading(true);
      const userComplaints = await apiClient.getComplaints();
      setComplaints(userComplaints);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch complaints'));
    } finally {
      setLoading(false);
    }
  }, []);

  const createDispute = useCallback(async (data: {
    productId: string;
    reason: string;
    description: string;
    evidence?: string[];
  }) => {
    try {
      setLoading(true);
      const newDispute = await apiClient.createDispute(data);
      setDisputes(prev => [...prev, newDispute]);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to create dispute'));
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getDisputeDetails = useCallback(async (disputeId: string) => {
    try {
      setLoading(true);
      const details = await apiClient.getDisputeDetails(disputeId);
      setDisputes(prev => prev.map(d => d.id === disputeId ? { ...d, ...details } : d));
      setError(null);
      return details;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch dispute details'));
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateDisputeStatus = useCallback(async (disputeId: string, status: string) => {
    try {
      setLoading(true);
      const updatedDispute = await apiClient.updateDisputeStatus(disputeId, status);
      setDisputes(prev => prev.map(d => d.id === disputeId ? { ...d, ...updatedDispute } : d));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update dispute status'));
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getComplaintDetails = useCallback(async (complaintId: string) => {
    try {
      setLoading(true);
      const details = await apiClient.getComplaintDetails(complaintId);
      setComplaints(prev => prev.map(c => c.id === complaintId ? { ...c, ...details } : c));
      setError(null);
      return details;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch complaint details'));
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateComplaintStatus = useCallback(async (complaintId: string, status: string) => {
    try {
      setLoading(true);
      const updatedComplaint = await apiClient.updateComplaintStatus(complaintId, status);
      setComplaints(prev => prev.map(c => c.id === complaintId ? { ...c, ...updatedComplaint } : c));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update complaint status'));
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch initial data
  useEffect(() => {
    fetchDisputes();
    fetchComplaints();
  }, [fetchDisputes, fetchComplaints]);

  return {
    disputes,
    complaints,
    loading,
    error,
    createDispute,
    getDisputeDetails,
    updateDisputeStatus,
    getComplaintDetails,
    updateComplaintStatus,
    refreshDisputes: fetchDisputes,
    refreshComplaints: fetchComplaints,
  };
} 