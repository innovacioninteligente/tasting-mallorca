'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  collection,
  onSnapshot,
  query,
  where,
  limit,
  orderBy,
  startAfter,
  endBefore,
  limitToLast,
  type DocumentData,
  type Query,
  type FirestoreError,
} from 'firebase/firestore';
import { useFirestore } from '../provider';

interface UseCollectionOptions {
  where?: [string, any, any];
  limit?: number;
  orderBy?: [string, 'asc' | 'desc'];
  startAfter?: any;
  endBefore?: any;
  limitToLast?: number;
}

export const useCollection = (
  collectionPath: string | null,
  options: UseCollectionOptions = {}
) => {
  const firestore = useFirestore();
  const [data, setData] = useState<DocumentData[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<FirestoreError | null>(null);

  const queryKey = useMemo(() => {
    if (!firestore || !collectionPath) return null;
    let q: Query = collection(firestore, collectionPath);
    if (options.where) q = query(q, where(...options.where));
    if (options.orderBy) q = query(q, orderBy(...options.orderBy));
    if (options.startAfter) q = query(q, startAfter(options.startAfter));
    if (options.endBefore) q = query(q, endBefore(options.endBefore));
    if (options.limit) q = query(q, limit(options.limit));
    if (options.limitToLast) q = query(q, limitToLast(options.limitToLast));
    return q;
  }, [firestore, collectionPath, JSON.stringify(options)]);


  useEffect(() => {
    if (!queryKey) {
      setData(null);
      setLoading(false);
      return;
    }
    
    setLoading(true);

    const unsubscribe = onSnapshot(
      queryKey,
      (snapshot) => {
        const docs = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setData(docs);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error(err);
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [queryKey]);

  return { data, loading, error };
};
