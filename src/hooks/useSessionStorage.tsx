import { useCallback, useState } from 'react'

export function useSessionStorage<T> (key: string, initialValue: T) {
    const [storedValue, setStoredValue] = useState<T>();

    const getValue = useCallback(() => {
        try {
            const item = window.sessionStorage.getItem(key);
            return item ? (JSON.parse(item) as T) : initialValue;
        } catch (error) {
            console.error(error)
            return initialValue
        }
    }, [initialValue, key]);


    const setValue = useCallback((value: T) => {
        try {
            window.sessionStorage.setItem(key, JSON.stringify(value))
            setStoredValue(value);
        } catch (error) {
            console.log(error)
        }
    }, [key]);

  return {value: storedValue, setValue, getValue}
}












