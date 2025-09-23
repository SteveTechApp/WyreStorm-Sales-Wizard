import { useState, useCallback } from 'react';

// A more robust useLocalStorage hook that validates data from localStorage.
export const useLocalStorage = <T,>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] => {
    const [storedValue, setStoredValue] = useState<T>(() => {
        try {
            const item = window.localStorage.getItem(key);
            // If no item exists, return the initial value.
            if (item === null) {
                return initialValue;
            }
            
            const parsed = JSON.parse(item);

            // --- Data Validation ---

            // 1. If the initial value is an array, we expect the stored value to be an array.
            if (Array.isArray(initialValue)) {
                if (!Array.isArray(parsed)) {
                    console.warn(`Invalid data type in localStorage for key '${key}'. Expected array, got ${typeof parsed}. Falling back to initial value.`);
                    return initialValue;
                }
                
                // Further validation: This application expects arrays of objects.
                // Filter out any entries that are not non-null objects to prevent downstream errors.
                const validatedArray = parsed.filter(i => i !== null && typeof i === 'object' && !Array.isArray(i));
                
                if (validatedArray.length < parsed.length) {
                    console.warn(`Removed invalid entries (nulls, primitives, or nested arrays) from localStorage for key '${key}'.`);
                }
                return validatedArray as T;
            }

            // 2. If the initial value is a non-array object, we expect a similar object.
            if (typeof initialValue === 'object' && initialValue !== null) {
                 if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
                    console.warn(`Invalid data type in localStorage for key '${key}'. Expected object, got ${Array.isArray(parsed) ? 'array' : typeof parsed}. Falling back to initial value.`);
                    return initialValue;
                 }
                 return parsed;
            }
            
            // 3. For primitive types, ensure the type matches.
            if (typeof parsed !== typeof initialValue) {
                console.warn(`Type mismatch in localStorage for key '${key}'. Expected ${typeof initialValue}, got ${typeof parsed}. Falling back to initial value.`);
                return initialValue;
            }
            
            return parsed;
        } catch (error) {
            console.error(`Error reading or parsing localStorage for key "${key}". Falling back to initial value.`, error);
            return initialValue;
        }
    });

    const setValue = useCallback((value: T | ((val: T) => T)) => {
        try {
            setStoredValue(currentStoredValue => {
                const valueToStore = value instanceof Function ? value(currentStoredValue) : value;
                window.localStorage.setItem(key, JSON.stringify(valueToStore));
                return valueToStore;
            });
        } catch (error) {
            console.error(error);
        }
    }, [key]);

    return [storedValue, setValue];
};
