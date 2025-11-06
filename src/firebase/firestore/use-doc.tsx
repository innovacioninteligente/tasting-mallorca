'use client';

import { useState, useEffect } from 'react';
import { doc, onSnapshot, type DocumentData, type FirestoreError } from 'firebase/firestore';
import { useFirestore } from '../provider';

export const useDoc = (docPath: string | null) => {
  const firestore = useFirestore();
  const [data, setData] = useState<DocumentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<FirestoreError | null>(null);

  useEffect(() => {
    if (!firestore || !docPath) {
      setData(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    const docRef = doc(firestore, docPath);

    const unsubscribe = onSnapshot(
      docRef,
      (docSnap) => {
        if (docSnap.exists()) {
          setData({ id: docSnap.id, ...docSnap.data() });
        } else {
          setData(null);
        }
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
  }, [firestore, docPath]);

  return { data, loading, error };
};
