'use client';

import { useEffect, useCallback } from 'react';
import { useForm, UseFormReturn } from 'react-hook-form';
import { debounce } from 'lodash';

export const useFormPersistence = (
    key: string,
    form: UseFormReturn<any>,
    defaultValues: any
) => {
    const { watch, reset } = form;

    const saveState = useCallback(debounce((data: any) => {
        try {
            const stateToSave = JSON.stringify(data, (key, value) => {
                // Do not persist File objects
                if (value instanceof File) {
                    return null;
                }
                return value;
            });
            localStorage.setItem(key, stateToSave);
        } catch (error) {
            console.error("Could not save form state to localStorage", error);
        }
    }, 500), [key]);

    const clearPersistedData = useCallback(() => {
        localStorage.removeItem(key);
    }, [key]);

    // Load state from localStorage on initial render
    useEffect(() => {
        try {
            const savedStateJSON = localStorage.getItem(key);
            if (savedStateJSON) {
                const savedState = JSON.parse(savedStateJSON);
                
                // Parse date strings back to Date objects
                if (savedState.availabilityPeriods) {
                    savedState.availabilityPeriods = savedState.availabilityPeriods.map((p: any) => ({
                        ...p,
                        startDate: p.startDate ? new Date(p.startDate) : undefined,
                        endDate: p.endDate ? new Date(p.endDate) : undefined,
                    }));
                }

                // Merge with default values to ensure all fields are present
                const mergedState = { ...defaultValues, ...savedState };
                reset(mergedState, { keepDefaultValues: true });
            }
        } catch (error) {
            console.error("Could not load form state from localStorage", error);
        }
    }, [key, reset, defaultValues]);
    
    // Watch for form changes and save to localStorage
    useEffect(() => {
        const subscription = watch((value) => {
            saveState(value);
        });
        return () => subscription.unsubscribe();
    }, [watch, saveState]);

    return { clearPersistedData };
};
